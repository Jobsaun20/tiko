import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import locales from "@/locales";

// ENDPOINT push notification
const PUSH_ENDPOINT = import.meta.env.VITE_PUSH_SERVER_URL;

// ENDPOINT check_badges
const CHECK_BADGES_URL = "https://psnxdeykxselxxtvlgzb.supabase.co/functions/v1/check_badges";

// --- FUNCION AUXILIAR PARA CREAR NOTIFICACION ---
async function addNotification(user_id: string, type: string, data: any, link?: string) {
  await supabase.from("notifications").insert([{
    user_id,
    type,
    data,
    link: link || null,
    read: false
  }]);
}

// Utilidad para template handlebars: {{var}}
function templateReplace(str: string, vars: Record<string, any>) {
  if (!str || typeof str !== "string") return "";
  return str.replace(/{{(.*?)}}/g, (_, key) => vars[key.trim()] ?? "");
}

// PUSH individual localizado por idioma del receptor
async function sendLocalizedPush(
  userId: string,
  titleKey: string,
  bodyKey: string,
  vars: Record<string, any>
) {
  try {
    const { data: userProfile } = await supabase
      .from("users")
      .select("language")
      .eq("id", userId)
      .maybeSingle();

    const lang = userProfile?.language || "es";
    // challengeCard o challenge, según donde guardes los textos
const dict = locales[lang]?.challenges || locales["es"].challenges;

    // FallBack: si envías directamente el texto (desde t.challenges...)
    const title =
      dict?.[titleKey] || titleKey || "Nuevo reto propuesto";
    const body =
      templateReplace(dict?.[bodyKey], vars) ||
      templateReplace(bodyKey, vars) ||
      bodyKey;

    const { data: pushSubs } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", userId);

    const subs = (pushSubs || []).map((s: any) => {
      try {
        return typeof s.subscription === "string"
          ? JSON.parse(s.subscription)
          : s.subscription;
      } catch {
        return null;
      }
    }).filter((s: any) => s && s.endpoint && s.keys?.auth && s.keys?.p256dh);

    for (const subscription of subs) {
      await fetch(PUSH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subs: subscription, notif: { title, body, url: "/challenges" } }),
      });
    }
  } catch (err) {
    console.error("Error en sendLocalizedPush:", err);
  }
}

export interface Challenge {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  amount: number;
  status: "pending" | "active" | "finished" | "cancelled";
  start_date?: string;
  end_date?: string;
  created_at: string;
  challenge_participants?: ChallengeParticipant[];
}

export interface ChallengeParticipant {
  id: string;
  challenge_id: string;
  user_id: string;
  accepted: boolean | null;
  accepted_at?: string;
  completed: boolean | null;
  completed_at?: string;
}

export function useChallenges() {
  const { user, session } = useAuthContext();
  const { showBadges } = useBadgeModal();
  const { t, language } = useLanguage();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Obtener retos donde participa el usuario o que ha creado
  async function fetchChallenges() {
    if (!user) {
      setChallenges([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // Retos que creaste tú
    const { data: myCreatedChallenges, error: error1 } = await supabase
      .from("challenges")
      .select(`*, challenge_participants(*)`)
      .eq("creator_id", user.id);

    if (error1) {
      setChallenges([]);
      setLoading(false);
      return;
    }

    // Retos donde participas (aunque no seas el creador)
    const { data: asParticipant, error: error2 } = await supabase
      .from("challenge_participants")
      .select(`challenge:challenge_id (*, challenge_participants(*))`)
      .eq("user_id", user.id);

    if (error2) {
      setChallenges([]);
      setLoading(false);
      return;
    }

    const allChallenges = [
      ...(myCreatedChallenges || []),
      ...((asParticipant || []).map((p: any) => p.challenge))
    ];

    const uniqueChallenges = Array.from(
      new Map(allChallenges.map((c: any) => [c.id, c])).values()
    );

    uniqueChallenges.sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setChallenges(uniqueChallenges);
    setLoading(false);
  }

  useEffect(() => {
    fetchChallenges();
    // eslint-disable-next-line
  }, [user]);

  // === 🔥 SUSCRIPCIÓN REALTIME EN DOS TABLAS ===
  useEffect(() => {
    if (!user) return;

    // Canal para tabla 'challenges'
    const channelChallenges = supabase
      .channel("realtime-challenges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "challenges" },
        fetchChallenges
      )
      .subscribe();

    // Canal para tabla 'challenge_participants'
    const channelParticipants = supabase
      .channel("realtime-challenge-participants")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "challenge_participants" },
        (payload) => {
          // Solo refresca si cambia algo importante (aceptación, completado, etc.)
          fetchChallenges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelChallenges);
      supabase.removeChannel(channelParticipants);
    };
    // eslint-disable-next-line
  }, [user]);

  // === FUNCIÓN PARA CHEQUEAR Y MOSTRAR BADGES ===
  async function checkBadges(userId: string, action: string, challengeId?: string) {
    try {
      const token = session?.access_token;
      if (!token) return;

      const res = await fetch(CHECK_BADGES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          action,
          action_data: {
            challenge_id: challengeId,
            lang: language || "es",
          },
        }),
      });

      const result = await res.json();
      if (result?.newlyEarned?.length > 0) {
        showBadges(result.newlyEarned, language || "es");
      }
      return result;
    } catch (err) {
      console.error("Error comprobando badges:", err);
    }
  }

  // 2. Crear un reto nuevo e invitar participantes
  async function createChallenge({ creator_id, title, description, amount, participants, end_date }: any) {
    const { data: challenge, error } = await supabase
      .from("challenges")
      .insert([{ creator_id, title, description, amount, end_date }])
      .select()
      .single();

    if (error) throw error;

    // Añade participantes (todos menos el creador)
    const participantsRows = participants
      .filter((id: string) => id !== creator_id)
      .map((user_id: string) => ({
        challenge_id: challenge.id,
        user_id,
        accepted: null,
        completed: null,
      }));

    // Creador se agrega como participante y acepta automáticamente
    participantsRows.push({
      challenge_id: challenge.id,
      user_id: creator_id,
      accepted: true,
      completed: null,
    });

    await supabase.from("challenge_participants").insert(participantsRows);

    // --- PUSH: invita a los demás participantes (NO al creador) ---
    if (participantsRows.length > 1) {
      const participantIds = participantsRows
        .filter((p: any) => p.user_id !== creator_id)
        .map((p: any) => p.user_id);

      for (const user_id of participantIds) {
        // NOTA: aquí pasas las keys, no el texto traducido.
        await sendLocalizedPush(
          user_id,
          "newChallengeProposed",         // clave del título
          "youHaveNewChallengeToAccept",  // clave del body
          { title }                       // variables de reemplazo, ejemplo: {{title}}
        );
      }

      // --- NOTIFICACIONES: crea notificación para cada invitado (NO el creador) ---
      for (const user_id of participantIds) {
        await addNotification(
          user_id,
          "challenge_invited",
          { challenge_id: challenge.id, challenge_title: title },
          "/challenges"
        );
      }
    }

    // === DESBLOQUEO DE BADGE: Reto creado ===
    await checkBadges(creator_id, "challenge_created", challenge.id);

    // --- NOTIFICACION para el creador ---
    await addNotification(
      creator_id,
      "challenge_created",
      { challenge_id: challenge.id, challenge_title: title },
      "/challenges"
    );

    // Refresca la lista
    await fetchChallenges();

    return challenge;
  }

  // 3. Aceptar o rechazar challenge
  async function respondToChallenge(challenge_id: string, user_id: string, accepted: boolean) {
    await supabase
      .from("challenge_participants")
      .update({ accepted, accepted_at: new Date() })
      .eq("challenge_id", challenge_id)
      .eq("user_id", user_id);

    // Trae el challenge para sacar el título (nombre)
    const { data: challenge } = await supabase
      .from("challenges")
      .select("title")
      .eq("id", challenge_id)
      .single();

    // === DESBLOQUEO DE BADGE: Reto aceptado ===
    if (accepted) {
      await checkBadges(user_id, "challenge_accepted", challenge_id);

      // --- NOTIFICACION: aceptado ---
      await addNotification(
        user_id,
        "challenge_accepted",
        { challenge_id, challenge_title: challenge?.title ?? "" },
        "/challenges"
      );
    } else {
      // --- NOTIFICACION: rechazado ---
      await addNotification(
        user_id,
        "challenge_rejected",
        { challenge_id, challenge_title: challenge?.title ?? "" },
        "/challenges"
      );
    }

    // Trae todos los participantes para ver si alguien rechazó o todos aceptaron
    const { data: participants } = await supabase
      .from("challenge_participants")
      .select("accepted, user_id")
      .eq("challenge_id", challenge_id);

    if (participants) {
      // SI ALGUIEN RECHAZÓ, SE MARCA COMO FINALIZADO Y SE ENVÍA PUSH CON NOMBRE
      const rejected = participants.find((p: any) => p.accepted === false);
      if (rejected) {
        // Traer los datos de los usuarios para el nombre, username o email
        const { data: users } = await supabase
          .from("users")
          .select("id, name, username, email")
          .in("id", [rejected.user_id]);

        const userObj = users?.find((u: any) => u.id === rejected.user_id);
        const displayName =
          userObj?.name?.trim() ||
          userObj?.username?.trim() ||
          userObj?.email?.trim() ||
          "User";

        await supabase
          .from("challenges")
          .update({ status: "finished" })
          .eq("id", challenge_id);

        const allIds = participants.map((p: any) => p.user_id);
        for (const user_id of allIds) {
          await sendLocalizedPush(
            user_id,
            "challengeFinished",
            "whoRejected",
            {
              name: displayName,
              title: challenge?.title ?? "Challenge",
            }
          );
        }

        // --- NOTIFICACION a todos de que alguien ha rechazado ---
        for (const p of participants) {
          await addNotification(
            p.user_id,
            "challenge_rejected_by_other",
            { challenge_id, challenge_title: challenge?.title ?? "", rejected_name: displayName },
            "/challenges"
          );
        }

      } else if (participants.every((p: any) => p.accepted === true)) {
        // Si todos aceptan, activa el reto
        await supabase
          .from("challenges")
          .update({ status: "active", start_date: new Date() })
          .eq("id", challenge_id);

        // PUSH: Notifica a todos que el reto ya está activo
        const allIds = participants.map((p: any) => p.user_id);
        for (const user_id of allIds) {
          await sendLocalizedPush(
            user_id,
            "challengeActivated",
            "everyoneAccepted",
            {}
          );
        }

        // --- NOTIFICACION a todos de que el reto está activo ---
        for (const p of participants) {
          await addNotification(
            p.user_id,
            "challenge_activated",
            { challenge_id, challenge_title: challenge?.title ?? "" },
            "/challenges"
          );
        }
      }
    }

    await fetchChallenges();
  }

  // 4. Marcar completado/no completado Y ASIGNAR XP + NOTIFICACION
  async function markCompletion(challenge_id: string, user_id: string, completed: boolean) {
    await supabase
      .from("challenge_participants")
      .update({ completed, completed_at: new Date() })
      .eq("challenge_id", challenge_id)
      .eq("user_id", user_id);

    let gainedXp = 0;

    // Trae el challenge para el nombre
    const { data: challenge } = await supabase
      .from("challenges")
      .select("title")
      .eq("id", challenge_id)
      .single();

    // === DESBLOQUEO DE BADGE: Reto completado o perdido ===
    if (completed === true) {
      gainedXp += 5;

      // 2. Chequear badges (y sumar xp extra si toca)
      const result = await checkBadges(user_id, "challenge_completed", challenge_id);
      if (result?.newlyEarned?.length) {
        result.newlyEarned.forEach((badge: any) => {
          gainedXp += badge.xp_reward || badge.xpReward || 0;
        });
      }

      // 3. Sumar el XP al usuario
      // Lee XP actual:
      const { data: users, error } = await supabase
        .from("users")
        .select("xp")
        .eq("id", user_id)
        .single();
      if (!error) {
        const currentXp = users?.xp || 0;
        await supabase
          .from("users")
          .update({ xp: currentXp + gainedXp })
          .eq("id", user_id);
      }

      // --- NOTIFICACION: completado
      await addNotification(
        user_id,
        "challenge_completed",
        { challenge_id, challenge_title: challenge?.title ?? "" },
        "/challenges"
      );
    } else if (completed === false) {
      await checkBadges(user_id, "challenge_lost", challenge_id);

      // --- NOTIFICACION: no completado
      await addNotification(
        user_id,
        "challenge_failed",
        { challenge_id, challenge_title: challenge?.title ?? "" },
        "/challenges"
      );
    }

    // Si todos han marcado, termina el reto
    const { data: participants } = await supabase
      .from("challenge_participants")
      .select("completed, user_id")
      .eq("challenge_id", challenge_id);

    if (participants && participants.every((p: any) => p.completed !== null)) {
      await supabase
        .from("challenges")
        .update({ status: "finished" })
        .eq("id", challenge_id);

      // PUSH: Notifica a todos que el reto ha terminado
      const allIds = participants.map((p: any) => p.user_id);
      for (const user_id of allIds) {
        await sendLocalizedPush(
          user_id,
          "challengeFinished",
          "challengeFinishCheckResult",
          {}
        );
      }

      // --- NOTIFICACION a todos: reto finalizado
      for (const p of participants) {
        await addNotification(
          p.user_id,
          "challenge_finished",
          { challenge_id, challenge_title: challenge?.title ?? "" },
          "/challenges"
        );
      }
    }

    await fetchChallenges();
  }

  // 5. BORRAR RETO (primero participantes, luego challenge)
  async function deleteChallenge(challenge_id: string) {
    const { error: partError } = await supabase
      .from("challenge_participants")
      .delete()
      .eq("challenge_id", challenge_id);

    if (partError) throw partError;

    const { error: challError } = await supabase
      .from("challenges")
      .delete()
      .eq("id", challenge_id);

    if (challError) throw challError;

    await fetchChallenges();
  }

  return {
    challenges,
    loading,
    createChallenge,
    respondToChallenge,
    markCompletion,
    deleteChallenge,
    fetchChallenges,
  };
}
