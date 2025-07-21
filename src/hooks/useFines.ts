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
  sender_phone?: string;
  sender_email: string;
  recipient_id: string;
  recipient_name: string;
  recipient_email: string;
  status: "pending" | "paid";
  date: string;
  type: string; // "sent", "received", etc
}

// URL del Edge Function de badges
const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";

// ENDPOINT push notification
const PUSH_ENDPOINT = "https://pic-push-server.vercel.app/api/send-push";

export function useFines() {
  const { user, session } = useAuthContext();
  const { showBadges } = useBadgeModal();
  const { language } = useLanguage();

  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Recargar multas desde backend ---
  async function refetchFines() {
    if (!user) {
      setFines([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("fines")
      .select("*")
      .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      .order("date", { ascending: false });
    if (error) {
      setError(error.message);
      setFines([]);
    } else {
      setFines(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    refetchFines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function payFine(fineId: string) {
    if (!user) throw new Error("Usuario no autenticado");
    const { data, error } = await supabase
      .from("fines")
      .update({ status: "paid" })
      .eq("id", fineId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);

    await refetchFines();
    return data;
  }

  async function createFine(
    newFine: {
      reason: string;
      amount: number;
      recipient_id: string;
      recipient_name: string;
      recipient_email: string;
      sender_name?: string;
      sender_phone?: string;
      date?: string;
      type?: string;
    }
  ) {
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
        user.email,
      sender_phone: newFine.sender_phone || "",
      sender_email: user.email,
      recipient_id: newFine.recipient_id,
      recipient_name: newFine.recipient_name,
      recipient_email: newFine.recipient_email,
      date: newFine.date || new Date().toISOString(),
      status: "pending",
      type: newFine.type || "sent"
    };

    // 1. Inserta la multa en la tabla "fines"
    const { data, error } = await supabase
      .from("fines")
      .insert([fineToInsert])
      .select()
      .maybeSingle();

    if (error) throw new Error(error.message);

    // 2. Crea una notificación en la tabla notifications (para UI)
    let notificationId: string | undefined;
    const notifInsert = await supabase
      .from("notifications")
      .insert([{
        user_id: newFine.recipient_id,
        type: "fine_received",
        title: "Nueva multa recibida",
        message: `Has recibido una multa de ${fineToInsert.sender_name} por ${fineToInsert.amount} CHF.`,
        link: "/history",
        read: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .maybeSingle();

    if (notifInsert.data && notifInsert.data.id) {
      notificationId = notifInsert.data.id;
    }

    // 3. Si se ha insertado la notificación, envía la push
    if (notificationId) {
      try {
        // a) Obtén todas las suscripciones push del destinatario
        const { data: pushSubs } = await supabase
          .from("push_subscriptions")
          .select("subscription")
          .eq("user_id", newFine.recipient_id);

        // b) Convierte cada suscripción a objeto JS, filtra solo válidas
        const subs = (pushSubs || [])
          .map(s => {
            try {
              return typeof s.subscription === "string"
                ? JSON.parse(s.subscription)
                : s.subscription;
            } catch {
              return null;
            }
          })
          .filter(sub => sub && typeof sub === "object" && !!sub.endpoint && !!sub.keys && !!sub.keys.auth && !!sub.keys.p256dh);

        if (subs.length === 0) {
          console.log("No hay suscripciones push válidas para este usuario.");
        } else {
          // c) Prepara el objeto notif con los datos de la notificación push
          const notif = {
            title: "New fine received",
            body: `You have received a fine from ${fineToInsert.sender_name} for ${fineToInsert.amount} CHF.`,
            url: "/history"
          };

          // d) Envía la notificación push a cada endpoint del usuario
          for (const subscription of subs) {
            try {
              await fetch(PUSH_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  subs: subscription,
                  notif: notif
                })
              });
            } catch (err) {
              // Error individual por suscripción (no interrumpe el resto)
              console.error("Error enviando push a una suscripción:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error enviando push notification:", err);
      }
    }

    // 4. Chequeo y despliegue de badges
    if (user && session?.access_token && data) {
      try {
        const response = await fetch(CHECK_BADGES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.access_token,
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
        const result = await response.json();
        if (result?.newlyEarned?.length > 0) {
          showBadges(result.newlyEarned, language);
        }
      } catch (err) {
        console.error("Error check_badges:", err);
      }
    }

    // 5. Recarga el listado tras crear multa
    await refetchFines();

    return data;
  }

  return { fines, loading, error, setFines, payFine, createFine };
}
