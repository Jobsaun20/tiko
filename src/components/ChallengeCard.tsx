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
import { ScrollText, Clock, Send, Zap } from "lucide-react";


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
  

  // -- Cargar los avatares SOLO para los participantes actuales (incluyendo creador)
  const userIds = [
    ...new Set([
      ...participants.map((p: any) => p.user_id),
      challenge.creator_id,
    ]),
  ];
  const avatars = useUsersAvatars(userIds);

  // Devuelve el display info de un participante
  const getParticipantDisplay = (participant: any) => {
    if (participant.user_id === currentUserId) {
      return {
        name: t.paymentModal.you,
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
  <div className="flex flex-row gap-3 items-start">
    {/* Columna icono + corona (badge) */}
    <div className="flex flex-col items-center min-w-[48px] mr-1 pt-1">
      <div className="relative inline-block">
        <span className="inline-flex items-center justify-center rounded-xl w-12 h-12 bg-purple-100">
          <Zap className="w-7 h-7 text-purple-500" />
        </span>
       
      </div>
    </div>
    {/* Columna texto alineada a la izquierda */}
    <div className="flex flex-col flex-1 min-w-0 justify-center">
      {/* Título */}
      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-bold pl-0">
        {challenge.title}
      </CardTitle>
      {/* Descripción */}
      {challenge.description && (
        <div className="text-xs sm:text-sm text-gray-600 mt-1 mb-1 pl-0">
          {challenge.description}
        </div>
      )}
      {/* Erstellt von */}
      <div className="text-xs text-gray-500 mb-1 pl-0">
        {t.challengeCard.createdBy}{" "}
        <span className="text-gray-700">
          {getParticipantDisplay({ user_id: challenge.creator_id }).name}
        </span>
      </div>
    </div>
    {/* Columna lateral derecha (penalty, cantidad, status, papelera) */}
    <div className="flex flex-col items-end sm:items-end min-w-fit ml-2">
      <div className="text-xs text-gray-800 mb-0.5">
        {t.challengeCard.penalty}
      </div>
      <div className="text-3xl font-extrabold text-purple-700 leading-none mb-0 sm:mb-2">
        € {challenge.amount}
      </div>
      {/* STATUS debajo del precio */}
      <div className="mt-1 mb-1">
        {getStatusBadge(challenge.status)}
      </div>
      {/* Papelera solo si finished y creator */}
      {challenge.status === "finished" && isCreator(currentUserId) && (
        <Button
          size="icon"
          variant="destructive"
          className="w-9 h-9 mt-1"
          disabled={deleting}
          onClick={handleDelete}
          title={t.challengeCard.deleteChallenge}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      )}
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
                  <AvatarFallback className="bg-gradient-to-r from-[#72bfc4] to-[#57b8c9] shadow-md text-white text-xs font-bold">
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
            className="rounded-full bg-green-500 hover:bg-green-600 text-white w-full xs:w-1/2 py-2 font-bold"
            disabled={loading}
            onClick={() => handleAccept(true)}
            style={{ minWidth: "120px" }}
          >
            {t.challengeCard.accept}
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-red-500 hover:bg-red-600 text-white w-full xs:w-1/2 py-2 font-bold"
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
            className="rounded-full bg-green-500 hover:bg-green-600 text-white w-full xs:w-1/2 py-2 font-bold"
            style={{ minWidth: "120px" }}
          >
            {t.challenges.status_achieved}
          </Button>
          <Button
            size="sm"
            disabled={loading}
            onClick={() => handleComplete(false)}
            className="rounded-full bg-red-500 hover:bg-red-600 text-white w-full xs:w-1/2 py-2 font-bold"
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
