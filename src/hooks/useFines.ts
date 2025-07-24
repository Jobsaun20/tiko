import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Fine {
  id: string;
  reason: string;
  amount: number;
  sender_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone?: string;
  recipient_id: string;
  recipient_name: string;
  recipient_email: string;
  status: "pending" | "paid";
  date: string;
  type: string;
  // De la view:
  sender_avatar_url?: string | null;
  sender_username?: string | null;
  recipient_avatar_url?: string | null;
  recipient_username?: string | null;
}

// URL del Edge Function de badges
const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";
// ENDPOINT push notification
const PUSH_ENDPOINT = import.meta.env.VITE_PUSH_SERVER_URL;

export function useFines() {
  const { user, session } = useAuthContext();
  const { showBadges } = useBadgeModal();
  const { language } = useLanguage();

  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Recargar multas desde la VIEW ---
  async function refetchFines() {
    if (!user) {
      setFines([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data, error: fetchError } = await supabase
      .from("fines_with_users")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("date", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setFines([]);
    } else {
      setFines(data as Fine[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    refetchFines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // --- Pagar multa ---
  async function payFine(fineId: string) {
    if (!user) throw new Error("Usuario no autenticado");

    const { data, error: updateError } = await supabase
      .from("fines")
      .update({ status: "paid" })
      .eq("id", fineId)
      .select()
      .maybeSingle();

    if (updateError) throw new Error(updateError.message);

    await refetchFines();
    return data;
  }

  // --- Crear nueva multa ---
  async function createFine(newFine: {
    reason: string;
    amount: number;
    recipient_id: string;
    recipient_name: string;
    recipient_email: string;
    sender_name?: string;
    sender_phone?: string;
    date?: string;
    type?: string;
  }) {
    if (!user) throw new Error("Usuario no autenticado");
    if (newFine.recipient_id === user.id)
      throw new Error("No puedes enviarte una multa a ti mismo.");
    if (
      !newFine.recipient_id ||
      typeof newFine.recipient_id !== "string" ||
      newFine.recipient_id.length < 16
    ) {
      throw new Error("El destinatario es inválido.");
    }

    const fineToInsert = {
      reason: newFine.reason,
      amount: newFine.amount,
      sender_id: user.id,
      sender_name:
        newFine.sender_name ||
        user.user_metadata?.username ||
        user.user_metadata?.name ||
        user.email!,
      sender_phone: newFine.sender_phone || "",
      sender_email: user.email!,
      recipient_id: newFine.recipient_id,
      recipient_name: newFine.recipient_name,
      recipient_email: newFine.recipient_email,
      date: newFine.date || new Date().toISOString(),
      status: "pending" as const,
      type: newFine.type || "sent",
    };

    // 1. Inserta la multa
    const { data, error: insertError } = await supabase
      .from("fines")
      .insert([fineToInsert])
      .select()
      .maybeSingle();

    if (insertError) throw new Error(insertError.message);

    // 2. Crea notificación interna
    const { data: notifData } = await supabase
      .from("notifications")
      .insert([
        {
          user_id: newFine.recipient_id,
          type: "fine_received",
          title: "Nueva multa recibida",
          message: `Has recibido una multa de ${fineToInsert.sender_name} por ${fineToInsert.amount} CHF.`,
          link: "/history",
          read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .maybeSingle();

    // 3. Push notification
    if (notifData?.id) {
      try {
        const { data: pushSubs } = await supabase
          .from("push_subscriptions")
          .select("subscription")
          .eq("user_id", newFine.recipient_id);

        const subs = (pushSubs || [])
          .map((s: any) => {
            try {
              return typeof s.subscription === "string"
                ? JSON.parse(s.subscription)
                : s.subscription;
            } catch {
              return null;
            }
          })
          .filter(
            (s: any) =>
              s &&
              s.endpoint &&
              s.keys?.auth &&
              s.keys?.p256dh
          );

        const notifPayload = {
          title: "New fine received",
          body: `You have received a fine from ${fineToInsert.sender_name} for ${fineToInsert.amount} CHF.`,
          url: "/history",
        };

        for (const subscription of subs) {
          try {
            await fetch(PUSH_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                subs: subscription,
                notif: notifPayload,
              }),
            });
          } catch (err) {
            console.error("Error enviando push:", err);
          }
        }
      } catch (err) {
        console.error("Error en push notification flow:", err);
      }
    }

    // 4. Chequeo de badges
    if (user && session?.access_token && data) {
      try {
        const resp = await fetch(CHECK_BADGES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session.access_token,
          },
          body: JSON.stringify({
            user_id: user.id,
            action: "create_fine",
            action_data: {
              fine_id: data.id,
              amount: data.amount,
              lang: language || "es",
            },
          }),
        });
        const result = await resp.json();
        if (result?.newlyEarned?.length) {
          showBadges(result.newlyEarned, language);
        }
      } catch (err) {
        console.error("Error check_badges:", err);
      }
    }

    // 5. Refrescar lista
    await refetchFines();

    return data;
  }

  return {
    fines,
    loading,
    error,
    setFines,
    payFine,
    createFine,
  };
}
