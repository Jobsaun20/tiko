import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

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

export function useFines() {
  const { user } = useAuthContext();
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Nueva función: Recargar del backend ---
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

    // Refresca desde la base de datos para ambos lados (evita estados inconsistentes)
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

    // 2. Crea una notificación para el destinatario
    let notificationId: string | undefined;
    const notifInsert = await supabase
      .from("notifications")
      .insert([{
        user_id: newFine.recipient_id,
        type: "fine_received",
        title: "Nueva multa recibida",
        message: `Has recibido una multa de ${fineToInsert.sender_name} por ${fineToInsert.amount} CHF.`,
        link: "/", // o el link donde se ve la multa
        read: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .maybeSingle();

    if (notifInsert.data && notifInsert.data.id) {
      notificationId = notifInsert.data.id;
    }

    // 3. Si se ha insertado la notificación, envía la push (CORREGIDO)
    if (notificationId) {
      try {
        // 1. Obtén todas las suscripciones push del destinatario
        const { data: pushSubs } = await supabase
          .from("push_subscriptions")
          .select("subscription")
          .eq("user_id", newFine.recipient_id);

        const subs = (pushSubs || []).map(s => s.subscription);

        // 2. Prepara el objeto notif con los mismos datos de la notificación
        const notif = {
          title: "New fine received",
          body: `You have received a fine from ${fineToInsert.sender_name} for ${fineToInsert.amount} CHF.`,
          url: "/history" // O el link a la multa
        };

        // 3. Llama al endpoint correctamente
        await fetch("https://pic-push-server.vercel.app/api/send-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subs, notif })
        });

      } catch (err) {
        // Opcional: manejar el error
        console.error("Error enviando push notification:", err);
      }
    }

    // 4. Recarga listado tras crear multa
    await refetchFines();

    return data;
  }

  return { fines, loading, error, setFines, payFine, createFine };
}
