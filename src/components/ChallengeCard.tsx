import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Trash2 } from "lucide-react";
import { useChallenges } from "@/hooks/useChallenges";
import { useContacts } from "@/hooks/useContacts";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/supabaseClient";
import locales from "@/locales"; // <--- IMPORTANTE

interface ChallengeCardProps {
  challenge: any;
  currentUserId: string;
  refetchChallenges: () => void;
}

const PUSH_ENDPOINT = import.meta.env.VITE_PUSH_SERVER_URL;

// ---------------------------------------
function useUsersAvatars(userIds: string[]) {
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  useEffect(() => {
    if (!userIds.length) return;
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, avatar_url")
        .in("id", userIds);
      if (!error && data) {
        const dict: Record<string, string> = {};
        data.forEach((u) => {
          dict[u.id] = u.avatar_url || "";
        });
        setAvatars(dict);
      }
    })();
  }, [userIds.join(",")]);
  return avatars;
}

export function ChallengeCard({
  challenge,
  currentUserId,
  refetchChallenges,
}: ChallengeCardProps) {
  const { respondToChallenge, markCompletion, deleteChallenge } = useChallenges();
  const { contacts } = useContacts();
  const participants = challenge.challenge_participants || [];
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { t } = useLanguage();
  const finesSentRef = useRef(false);

  // -- Cargar los avatares SOLO para los participantes actuales (incluyendo creador)
  const userIds = [
    ...new Set([
      ...participants.map((p: any) => p.user_id),
      challenge.creator_id,
    ]),
  ];
  const avatars = useUsersAvatars(userIds);

  useEffect(() => {
    if (
      challenge.status === "finished" &&
      isCreator(currentUserId) &&
      !finesSentRef.current
    ) {
      finesSentRef.current = true;
      sendFinesToFailedParticipants();
    }
    // eslint-disable-next-line
  }, [challenge.status]);

  // Devuelve el display info de un participante
  const getParticipantDisplay = (participant: any) => {
    if (participant.user_id === currentUserId) {
      return {
        name: "Tú",
        avatar: avatars[currentUserId] || null,
        fallback: "T",
      };
    }
    return {
      name:
        contacts.find((c) => c.user_supabase_id === participant.user_id)?.name ||
        "Usuario",
      avatar: avatars[participant.user_id] || null,
      fallback: (
        contacts.find((c) => c.user_supabase_id === participant.user_id)?.name?.charAt(0).toUpperCase() ||
        participant.user_id?.[0]?.toUpperCase() ||
        "?"
      ),
    };
  };

  const isCreator = (user_id: string) => user_id === challenge.creator_id;
  const myParticipant = participants.find((p: any) => p.user_id === currentUserId);
  const showAcceptReject =
    challenge.status === "pending" && myParticipant && myParticipant.accepted === null;
  const showComplete =
    challenge.status === "active" && myParticipant && myParticipant.completed === null;

  const handleAccept = async (accept: boolean) => {
    setLoading(true);
    await respondToChallenge(challenge.id, currentUserId, accept);
    setLoading(false);
    refetchChallenges();
  };

  const handleComplete = async (completed: boolean) => {
    setLoading(true);
    await markCompletion(challenge.id, currentUserId, completed);
    setLoading(false);
    refetchChallenges();
  };

  const handleDelete = async () => {
    if (!window.confirm(t.challengeCard.sureDelete)) return;
    setDeleting(true);
    try {
      await deleteChallenge(challenge.id);
      refetchChallenges();
    } catch (e: any) {
      alert(t.challengeCard.errorDeleting + (e?.message || e));
    }
    setDeleting(false);
  };

  // --------- MULTAS Y PUSH EN IDIOMA DEL RECEPTOR ---------
  const sendFinesToFailedParticipants = async () => {
    const { data: finesCandidates, error } = await supabase
      .from("challenge_fines_candidates")
      .select("*")
      .eq("challenge_id", challenge.id);

    if (error) {
      console.error("❌ Error cargando la view challenge_fines_candidates:", error);
      return;
    }

    if (!finesCandidates || !finesCandidates.length) {
      console.log("ℹ️ No hay multas por enviar desde la view");
      return;
    }

    const finesToInsert = [];

    for (const fine of finesCandidates) {
      // 1. Buscar idioma del destinatario
      const { data: recipientData } = await supabase
        .from("users")
        .select("language")
        .eq("id", fine.recipient_id)
        .maybeSingle();
      const lang = recipientData?.language || "es";
      const locale = locales[lang] || locales["es"];

      
      // 2. Construir el motivo con el idioma del receptor
      const reason = locale.challengeCard.challengeNotCompleted.replace(
        "{title}",
        challenge.title
      );

      const { data: exists } = await supabase
        .from("fines")
        .select("id")
        .eq("sender_id", fine.sender_id)
        .eq("recipient_id", fine.recipient_id)
        .eq("reason", reason);

      if (!exists?.length) {
        finesToInsert.push({
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
        });
      }
    }

    if (finesToInsert.length > 0) {
      const { error: insertError } = await supabase.from("fines").insert(finesToInsert);
      if (insertError) {
        console.error("❌ Error al insertar multas:", insertError);
      } else {
        console.log("✅ Multas enviadas desde view:", finesToInsert);

        // ---- PUSH NOTIFICATION por multa, en el idioma del receptor ----
        for (const fine of finesToInsert) {
          const { data: recipientData } = await supabase
            .from("users")
            .select("language")
            .eq("id", fine.recipient_id)
            .maybeSingle();
          const lang = recipientData?.language || "es";
          const locale = locales[lang] || locales["es"];

          function templateReplace(str: string, vars: Record<string, string | number>) {
            return str.replace(/{{(.*?)}}/g, (_, key) => String(vars[key.trim()] ?? ""));
          }
          const notifPayload = {
            title: locale.challengeCard.newFineRecived,
            body: templateReplace(locale.challengeCard.fineReceivedBody, {
              sender: fine.sender_name,
              amount: fine.amount,
              reason: fine.reason,
            }),
            url: "/history",
          };

          const { data: pushSubs, error: subError } = await supabase
            .from("push_subscriptions")
            .select("subscription")
            .eq("user_id", fine.recipient_id);

          if (subError) {
            console.error("❌ Error buscando subscripciones:", subError);
            continue;
          }

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
              (s: any) => s && s.endpoint && s.keys?.auth && s.keys?.p256dh
            );

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
              console.error("Error sending push:", err);
            }
          }
        }
      }
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "pending")
      return <Badge variant="secondary">{t.challengeCard.pending}</Badge>;
    if (status === "active")
      return <Badge variant="default">{t.challengeCard.active}</Badge>;
    if (status === "finished")
      return <Badge variant="destructive">{t.challengeCard.finished}</Badge>;
    return <Badge variant="destructive">{t.challengeCard.canceled}</Badge>;
  };

  return (
  <Card className="w-full max-w-[320px] mx-auto rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
  <CardHeader className="pb-2">
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-start sm:justify-between">
      <div className="flex-1 min-w-0">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold">
          {challenge.title}
          <Crown className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        {challenge.description && (
          <div className="text-xs sm:text-sm text-gray-600 mt-1 mb-1">
            {challenge.description}
          </div>
        )}
        <div className="text-xs text-gray-500 mb-1">
          {t.challengeCard.createdBy}{" "}
          <span className="text-gray-700">
            {
              getParticipantDisplay({ user_id: challenge.creator_id }).name
            }
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end sm:items-end">
        <div className="text-xs text-gray-400 mb-0.5">
          {t.challengeCard.penalty}
        </div>
        <div className="text-3xl font-extrabold text-purple-700 leading-none mb-1 sm:mb-2">
          CHF {challenge.amount}
        </div>
        <div className="flex items-center gap-2 mb-2">
          {getStatusBadge(challenge.status)}
          {challenge.status === "finished" && isCreator(currentUserId) && (
            <Button
              size="icon"
              variant="destructive"
              className="w-9 h-9"
              disabled={deleting}
              onClick={handleDelete}
              title={t.challengeCard.deleteChallenge}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="mb-2">
      <div className="font-semibold text-xs sm:text-sm mb-1">
        {t.challengeCard.members} ({participants.length}):
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {participants.map((p: any) => {
          const info = getParticipantDisplay(p);
          let chipClass =
            "flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs border ";
          if (p.completed === true)
            chipClass += "bg-green-100 text-green-700 border-green-200";
          else if (p.completed === false)
            chipClass += "bg-red-100 text-red-700 border-red-200";
          else chipClass += "text-gray-700 border-gray-200";
          return (
            <div key={p.user_id} className={chipClass}>
              <Avatar className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                {info.avatar ? (
                  <AvatarImage src={info.avatar} alt={info.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold">
                    {info.fallback}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="truncate font-medium text-gray-700">{info.name}</span>
              {isCreator(p.user_id) && (
                <Crown className="h-3 w-3 text-yellow-500 ml-1" />
              )}
              {p.accepted === false && (
                <span className="ml-1 text-xs text-red-500">
                  ({t.challengeCard.rejected})
                </span>
              )}
              {challenge.status === "finished" &&
                (p.completed === true ? (
                  <span className="ml-1">✔️</span>
                ) : p.completed === false ? (
                  <span className="ml-1">❌</span>
                ) : null)}
            </div>
          );
        })}
      </div>
      {showAcceptReject && (
        <div className="flex gap-2 mt-2 w-full">
          <Button
            size="sm"
            className="bg-green-500 hover:bg-green-600 text-white w-full xs:w-1/2 py-2 font-bold"
            disabled={loading}
            onClick={() => handleAccept(true)}
            style={{ minWidth: "120px" }}
          >
            {t.challengeCard.accept}
          </Button>
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white w-full xs:w-1/2 py-2 font-bold"
            disabled={loading}
            onClick={() => handleAccept(false)}
            style={{ minWidth: "120px" }}
          >
            {t.challengeCard.reject}
          </Button>
        </div>
      )}
      {showComplete && (
        <div className="flex gap-2 mt-2 w-full">
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleComplete(true)}
            className="bg-green-500 hover:bg-green-600 text-white w-full xs:w-1/2 py-2 font-bold"
            style={{ minWidth: "120px" }}
          >
            {t.challenges.status_achieved}
          </Button>
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleComplete(false)}
            className="bg-red-500 hover:bg-red-600 text-white w-full xs:w-1/2 py-2 font-bold"
            style={{ minWidth: "120px" }}
          >
            {t.challenges.status_failed}
          </Button>
        </div>
      )}
    </div>
  </CardContent>
</Card>
  );
}
