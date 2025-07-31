// src/hooks/useSendPendingChallengeFines.ts
import { useEffect, useRef } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import locales from "@/locales";

const PUSH_ENDPOINT = import.meta.env.VITE_PUSH_SERVER_URL;

/**
 * Hook global para enviar automáticamente las multas pendientes
 * al terminar retos tipo "challenge". Pásale la lista de retos para
 * asegurar que detecta los cambios.
 *
 * @param {any[]} challenges - Lista de retos (opcional, pero recomendable).
 */
export function useSendPendingChallengeFines(challenges: any[] = []) {
  const { user } = useAuthContext();
  const runningRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    // Si no hay ningún challenge "finished" de este usuario, no hagas nada.
    if (challenges.length && !challenges.some(
      c => c.status === "finished" && c.creator_id === user.id
    )) return;

    if (runningRef.current) return;
    runningRef.current = true;

    const process = async () => {
      // Buscar multas por enviar, solo para los retos creados por este usuario
      const { data: pendingFines, error } = await supabase
        .from("challenge_fines_candidates")
        .select("*")
        .eq("sender_id", user.id);

      if (error) {
        console.error("Error cargando multas pendientes:", error);
        runningRef.current = false;
        return;
      }
      if (!pendingFines || !pendingFines.length) {
        runningRef.current = false;
        return;
      }

      for (const fine of pendingFines) {
        // Verifica que NO exista ya la multa para este reto y usuario
        const { data: exists } = await supabase
          .from("fines")
          .select("id")
          .eq("sender_id", fine.sender_id)
          .eq("recipient_id", fine.recipient_id)
          .eq("challenge_id", fine.challenge_id);

        if (exists && exists.length) continue;

        // Busca idioma del receptor
        const { data: recipientData } = await supabase
          .from("users")
          .select("language")
          .eq("id", fine.recipient_id)
          .maybeSingle();
        const lang = recipientData?.language || "es";
        const locale = locales[lang] || locales["es"];
        const reason = locale.challengeCard.challengeNotCompleted.replace(
          "{title}",
          fine.challenge_title || "Reto"
        );

        // Inserta la multa
        const fineObj = {
          sender_id: fine.sender_id,
          sender_name: fine.sender_name,
          sender_phone: fine.sender_phone,
          recipient_id: fine.recipient_id,
          recipient_name: fine.recipient_name,
          recipient_email: fine.recipient_email,
          reason,
          amount: fine.amount,
          status: "pending",
          date: new Date().toISOString(),
          type: "challenge",
          challenge_id: fine.challenge_id,
        };
        const { error: insertError } = await supabase.from("fines").insert([fineObj]);
        if (insertError) {
          console.error("Error insertando multa:", insertError);
          continue;
        }

        // Notifica PUSH al receptor, en su idioma
        function templateReplace(str: string, vars: Record<string, string | number>) {
          return str.replace(/{{(.*?)}}/g, (_, key) => String(vars[key.trim()] ?? ""));
        }
        const notifPayload = {
          title: locale.challengeCard.newFineRecived,
          body: templateReplace(locale.challengeCard.fineReceivedBody, {
            sender: fine.sender_name,
            amount: fine.amount,
            reason,
          }),
          url: "/history",
        };

        const { data: pushSubs } = await supabase
          .from("push_subscriptions")
          .select("subscription")
          .eq("user_id", fine.recipient_id);

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
          .filter((s: any) => s && s.endpoint && s.keys?.auth && s.keys?.p256dh);

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
      }

      runningRef.current = false;
    };

    process();
    // Si quieres máxima robustez, puedes usar un intervalo aquí.
    // const interval = setInterval(process, 60000);
    // return () => clearInterval(interval);
  // eslint-disable-next-line
  }, [user, JSON.stringify(challenges)]);
}

