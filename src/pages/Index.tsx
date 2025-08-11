import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, History, Award, CheckCircle, Share2, Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { CreateFineModal } from "@/components/CreateFineModal";
import { AuthModal } from "@/components/AuthModal";
import { InviteModal } from "@/components/InviteModal";
import { AchievementModal } from "@/components/AchievementModal";
import { PaymentModal } from "@/components/PaymentModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { calculateLevel, getXPProgress, BADGES } from "@/utils/gamification";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuthContext } from "@/contexts/AuthContext";
import PhoneWarningBanner from "@/components/PhoneWarningBanner";
import PhoneModal from "@/components/PhoneModal";
import { supabase } from "@/supabaseClient";
import { isValidSwissPhone, normalizeSwissPhone } from "@/utils/validateSwissPhone";
import { useFines } from "@/hooks/useFines";
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { checkAndAwardBadge } from "@/utils/checkAndAwardBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useChallenges } from "@/hooks/useChallenges";
import { ScrollText, Zap } from "lucide-react";
import { FineCard } from "@/components/FineCard"; // Ajusta la ruta si es distinta

// ======== AÑADIDO: import del tutorial =========
import IndexTutorialOverlay from "@/components/IndexTutorialOverlay";
// ===============================================


// URL de tu Edge Function en Supabase
const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";

// Footer
function Footer() {
  return (
    <footer
      className="
        w-full
        bg-gray-50
        border-t
        border-gray-200
        text-xs
        text-gray-500
        text-center
        py-1.5
        
        
        mx-auto
        mt-8
      "
      style={{ fontSize: "12px", letterSpacing: "0.01em" }}
    >
      © {new Date().getFullYear()} DESWG · Plataforma de entretenimiento —{" "}
      <a href="/legal/agb" className="underline text-blue-500">AGB</a> ·{" "}
      <a href="/legal/datenschutz" className="underline text-blue-500">Datenschutz</a> ·{" "}
      <a href="/legal/haftungsausschluss" className="underline text-blue-500">Haftungsausschluss</a>
    </footer>
  );
}

// --------- MODAL PARA COMPARTIR LA APP ---------
function ShareAppModal({ isOpen, onClose, appUrl }: { isOpen: boolean; onClose: () => void; appUrl: string; }) {
  const { t, language } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
    inputRef.current?.select();
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-sm p-5">
        <DialogHeader>
          <DialogTitle className="text-center mb-2">{t.share.title}</DialogTitle>
        </DialogHeader>
        <div className="text-center mb-3 text-gray-600 text-sm">
          {t.share.description || "Comparte esta web con tus amigos o familiares:"}
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
          <Input
            ref={inputRef}
            value={appUrl}
            readOnly
            className="border-0 bg-transparent text-center font-mono px-0 py-1 focus:outline-none focus:ring-0"
            style={{ background: "transparent" }}
            onClick={() => inputRef.current?.select()}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            title={t.share.copy || "Copiar enlace"}
          >
            <Copy className="w-5 h-5" />
          </Button>
        </div>
        <div className="text-center mt-2 text-green-600 text-xs h-4">
          {copied ? t.share.copied || "¡Copiado!" : ""}
        </div>
        <DialogFooter className="pt-4 flex justify-center">
          <Button onClick={onClose} variant="outline" className="w-full">
            {t.share.close || "Cerrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Index() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session } = useAuthContext();
  const { profile, loading, updateProfile, fetchProfile } = useUserProfile();
  const { fines, payFine } = useFines();
  const { showBadges } = useBadgeModal();

  const [isCreateFineModalOpen, setIsCreateFineModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [earnedBadges, setEarnedBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);
  
  // ======== AÑADIDO: estado para mostrar el tutorial solo 1ª vez ========
  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    if (user?.id) {
      const key = `tutorialDone:${user.id}`;
      const already = localStorage.getItem(key);
      if (!already) setShowTutorial(true);
    }
  }, [user?.id]);
  // ======================================================================

  // Colores para cada segmento
const COLORS_FINES = ["#FF718B", "#52AEB9"];
const COLORS_CHALLENGES = ["#a882f6", "#00b36b"];


function MultasRetosSection({
  sentFines,
  receivedFines,
  challengesAccepted,
  challengesFailed,
  challengesCompleted,
  t,
  navigate,
}) {
  const finesPieData = [
    { name: t.pages.history.sent, value: sentFines.length },
    { name: t.pages.history.received, value: receivedFines.length },
  ];
  const challengesPieData = [
    { name: t.challenges.accepted || "Nicht geschafft", value: challengesFailed },
    { name: t.challenges.completed || "Geschafft", value: challengesCompleted },
  ];
  const COLORS_FINES = ["#E5677E", "#68B1BC"];
  const COLORS_CHALLENGES = ["#A259F7", "#00B36B"];

  return (
    <div className="w-full flex flex-row gap-4 mb-4 justify-center">
      {/* FINES CARD */}
      <div
        onClick={() => navigate("/history")}
        className="
          bg-white
          rounded-2xl
          shadow
          border border-gray-100
          hover:shadow-lg
          transition
          flex flex-col items-center
          py-3 px-4
          cursor-pointer
          min-w-[150px] max-w-[170px]
        "
        style={{ minHeight: 190 }}
      >
        <div className="flex items-center gap-1 mb-2">
          <span className="rounded-full bg-[#FFF1F3] p-1">
            {/* Icono ScrollText (lucide) */}
            <ScrollText className="w-5 h-5 text-[#c44a3a]" />
          </span>
          <span className="font-semibold text-[15px] text-gray-800">{t.nav.fines || "Fines"}</span>
        </div>
        <div className="w-20 h-20 flex items-center justify-center mx-auto relative mb-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={finesPieData}
                cx="50%"
                cy="50%"
                innerRadius={24}
                outerRadius={32}
                dataKey="value"
                stroke="none"
                labelLine={false}
              >
                {finesPieData.map((entry, idx) => (
                  <Cell key={`cell-fines-${idx}`} fill={COLORS_FINES[idx % COLORS_FINES.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Números grandes, centrados uno encima de otro */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <span className="text-[19px] font-bold text-[#E5677E] leading-none">{sentFines.length}</span>
            <span className="text-[17px] font-bold text-[#68B1BC] leading-none">{receivedFines.length}</span>
          </div>
        </div>
        {/* Leyenda */}
        <div className="flex flex-col gap-0.5 mt-0 text-xs font-medium w-full text-center">
          <span className="flex items-center justify-left gap-1 text-gray-500">
            <span className="inline-block rounded-full w-2.5 h-2.5 mr-1" style={{ background: COLORS_FINES[0] }} />
            {t.pages.history.sent || "Sent"}
          </span>
          <span className="flex items-center justify-left gap-1 text-gray-500">
            <span className="inline-block rounded-full w-2.5 h-2.5 mr-1" style={{ background: COLORS_FINES[1] }} />
            {t.pages.history.received || "Received"}
          </span>
        </div>
      </div>
      {/* CHALLENGES CARD */}
      <div
        onClick={() => navigate("/challenges")}
        className="
          bg-white
          rounded-2xl
          shadow
          border border-gray-100
          hover:shadow-lg
          transition
          flex flex-col items-center
          py-3 px-4
          cursor-pointer
          min-w-[150px] max-w-[170px]
        "
        style={{ minHeight: 190 }}
      >
        <div className="flex items-center gap-1 mb-2">
          <span className="rounded-full bg-[#F4F2FD] p-1">
            {/* Icono Zap (rayo) */}
            <Zap className="w-5 h-5 text-[#A259F7]" />
          </span>
          <span className="font-semibold text-[15px] text-gray-800">{t.challenges.challenges || "Challenges"}</span>
        </div>
        <div className="w-20 h-20 flex items-center justify-center mx-auto relative mb-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={challengesPieData}
                cx="50%"
                cy="50%"
                innerRadius={24}
                outerRadius={32}
                dataKey="value"
                stroke="none"
                labelLine={false}
              >
                {challengesPieData.map((entry, idx) => (
                  <Cell key={`cell-challenge-${idx}`} fill={COLORS_CHALLENGES[idx % COLORS_CHALLENGES.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <span className="text-[19px] font-bold text-[#A259F7] leading-none">{challengesFailed}</span>
            <span className="text-[17px] font-bold text-[#00B36B] leading-none">{challengesCompleted}</span>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 mt-0 text-xs font-medium w-full text-center">
          <span className="flex items-center justify-left gap-1 text-gray-500">
            <span className="inline-block rounded-full w-2.5 h-2.5 mr-1" style={{ background: COLORS_CHALLENGES[0] }} />
            {t.challenges.status_failed || "Nicht geschafft"}
          </span>
          <span className="flex items-center justify-left gap-1 text-gray-500">
            <span className="inline-block rounded-full w-2.5 h-2.5 mr-1" style={{ background: COLORS_CHALLENGES[1] }} />
            {t.challenges.status_achieved || "Geschafft"}
          </span>
        </div>
      </div>
    </div>
  );
}

  const userData = profile || {
    id: "",
    username: "",
    email: "",
    phone: "",
    avatar_url: "",
    xp: 0,
    badges: [],
    groups: [],
    fines: [],
    totalSent: 0,
    totalReceived: 0,
    totalPaid: 0,
    totalEarned: 0,
    contacts: [],
  };

  const userId = userData.id;
  const finesList = Array.isArray(fines) ? fines : [];
const { challenges } = useChallenges();


// Calcula los retos aceptados y completados:
const challengesAccepted = Array.isArray(challenges)
  ? challenges.filter((challenge: any) => {
      const part = challenge.challenge_participants?.find((p: any) => p.user_id === userId);
      return part && part.accepted === true && (part.completed === null || part.completed === undefined);
    }).length
  : 0;

const challengesCompleted = Array.isArray(challenges)
  ? challenges.filter((challenge: any) => {
      const part = challenge.challenge_participants?.find((p: any) => p.user_id === userId);
      return part && part.accepted === true && part.completed === true;
    }).length
  : 0;
// Retos NO completados: aceptados pero completed === false
const challengesFailed = Array.isArray(challenges)
  ? challenges.filter((challenge: any) => {
      const part = challenge.challenge_participants?.find((p: any) => p.user_id === userId);
      return part && part.accepted === true && part.completed === false;
    }).length
  : 0;

const pendingFinesToPay = finesList.filter(
  (f: any) => f.status === "pending" && f.recipient_id === userId
);

  const pendingFines = finesList.filter(
    (f: any) =>
      f.status === "pending" &&
      (f.recipient_id === userId || f.sender_id === userId)
      
  );
  const sentFines = finesList.filter((f: any) => f.sender_id === userId);
  const receivedFines = finesList.filter((f: any) => f.recipient_id === userId);
  const pendingAmount = pendingFines.reduce((sum: number, f: any) => sum + (f.amount || 0), 0);
  const sentAmount = sentFines.reduce((sum: number, f: any) => sum + (f.amount || 0), 0);
  const receivedAmount = receivedFines.reduce((sum: number, f: any) => sum + (f.amount || 0), 0);
  const latestReceivedFine = pendingFines
    .filter((f: any) => f.recipient_id === userId)
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const contacts = Array.isArray(userData.contacts) ? userData.contacts : [];

  const currentLevel = calculateLevel(userData.xp);
  const xpProgress = getXPProgress(userData.xp);
  const userBadges = BADGES.filter(badge => (userData.badges || []).includes(badge.id));
  const needsPhone = !userData.phone || !isValidSwissPhone(userData.phone);

  const handleSavePhone = async (phone: string) => {
    if (!isValidSwissPhone(phone)) return;
    await supabase.from("users").update({ phone: normalizeSwissPhone(phone) }).eq("id", profile?.id);
    if (typeof updateProfile === "function") await updateProfile({ phone: normalizeSwissPhone(phone) });
    setShowPhoneModal(false);
    toast({ title: t.notifications.phoneUpdated, description: t.notifications.phoneUpdatedDescription });
  };
  useEffect(() => {
    const fetchUserBadges = async () => {
      if (!profile?.id) {
        setEarnedBadges([]);
        setBadgesLoading(false);
        return;
      }
      setBadgesLoading(true);

      const { data: userBadges, error } = await supabase
        .from("user_badges")
        .select("badge_id, achieved_at")
        .eq("user_id", profile.id);

      if (error) {
        setBadgesLoading(false);
        setEarnedBadges([]);
        return;
      }
      if (!userBadges || userBadges.length === 0) {
        setEarnedBadges([]);
        setBadgesLoading(false);
        return;
      }

      const badgeIds = userBadges.map((b) => b.badge_id);
      const { data: badgesData } = await supabase
        .from("badges")
        .select("*")
        .in("id", badgeIds);

      const joined = userBadges
        .map((ub) => {
          const badge = badgesData.find((b) => b.id === ub.badge_id) || {};
          let name = badge.name;
          let description = badge.description;
          try {
            if (typeof name === "string") name = JSON.parse(name);
            if (typeof description === "string") description = JSON.parse(description);
          } catch {}
          return {
            ...badge,
            name,
            description,
            achieved_at: ub.achieved_at,
          };
        })
        .filter((b) => b.id);

      joined.sort((a, b) => {
        const dateA = a.achieved_at ? new Date(a.achieved_at).getTime() : 0;
        const dateB = b.achieved_at ? new Date(b.achieved_at).getTime() : 0;
        return dateB - dateA;
      });
      setEarnedBadges(joined);
      setBadgesLoading(false);
    };

    fetchUserBadges();
  }, [profile?.id]);

  
  const handleCreateFine = async (newFine: any) => {
    setIsCreateFineModalOpen(false);
    toast({ title: "Multa creada", description: "La multa ha sido enviada" });
  };

  const handlePayFine = (fine: any) => {
    setSelectedFine(fine);
    setPaymentModalOpen(true);
  };

  const handlePayment = async () => {
    if (selectedFine) {
      try {
        await payFine(selectedFine.id);
        toast({
          title: t.fines.finePaid,
          description: `Multa de ${selectedFine.amount} CHF pagada correctamente`,
        });

        const BASE_XP = 2;
        let gainedXp = BASE_XP;

        if (user && session?.access_token) {
          const response = await fetch(CHECK_BADGES_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + session.access_token,
            },
            body: JSON.stringify({
              user_id: user.id,
              action: "pay_fine",
              action_data: {
                amount: selectedFine.amount,
                fine_id: selectedFine.id,
                lang: language || "es",
              },
            }),
          });
          const result = await response.json();
          if (result?.newlyEarned?.length > 0) {
            showBadges(result.newlyEarned, language || "es");
            result.newlyEarned.forEach((badge: any) => {
              gainedXp += badge.xp_reward || badge.xpReward || 0;
            });
          }
        }

        if (gainedXp > 0 && profile) {
          const nuevoXP = (profile.xp || 0) + gainedXp;
          const result = await updateProfile({ xp: nuevoXP });

          if (result.error) {
            toast({
              title: "Error XP",
              description: "No se pudo actualizar la experiencia: " + result.error,
              variant: "destructive",
            });
            alert("No se pudo actualizar la experiencia: " + result.error);
          } else {
            toast({
              title: t.achievements.title || "¡Has ganado experiencia!",
              description: t.achievements.xpGained
                ? t.achievements.xpGained.replace("{xp}", String(gainedXp))
                : `Has ganado ${gainedXp} XP por tu acción.`,
              variant: "default",
            });
            if (typeof fetchProfile === "function") fetchProfile();
          }
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || "Error desconocido",
          variant: "destructive",
        });
      }
    }
    setPaymentModalOpen(false);
    setSelectedFine(null);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatsCardClick = (filter: string) => {
    navigate(`/history?filter=${filter}`);
  };

  if (loading) {
    return <div className="text-center py-16">{t.contacts.loading}</div>;
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pb-8 flex flex-col">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-3xl">O</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {t.app.name}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t.app.subtitle}
              </p>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
              >
                {t.auth.login}
              </Button>
              <p className="text-gray-600">
                {t.auth.noAccount}{" "}
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-purple-600 font-medium hover:underline"
                >
                  {t.auth.signUp}
                </button>
              </p>
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuth={() => window.location.reload()}
        />
        <Footer />
      </div>
    );
  }

  return (
<div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {/* Banner y modal teléfono */}
      {needsPhone && (
        <PhoneWarningBanner onAddPhone={() => setShowPhoneModal(true)} />
      )}
      <PhoneModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSave={handleSavePhone}
      />

      <div className="flex-grow">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Mensaje bienvenida */}

          <Card className="rounded-2xl shadow-lg bg-white px-6 py-6 w-full max-w-[340px] mx-auto mb-6">
            <div className="text-center flex flex-col items-center">
              {/* Avatar */}
              {userData.avatar_url ? (
                <img
                  src={userData.avatar_url}
                  alt={userData.username || userData.email || "Foto de perfil"}
                  className="mx-auto mb-3 rounded-full border-4 border-[#52AEB9] shadow h-20 w-20 object-cover"
                  style={{ background: "#fff" }}
                />
              ) : (
                <div className="mx-auto mb-3 rounded-full bg-[#52AEB9] flex items-center justify-center h-20 w-20 text-white text-3xl font-bold shadow">
                  {userData.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              {/* <h1
                className="text-2xl sm:text-3xl font-bold mb-2"
                style={{ color: "#52AEB9" }}
              >
                {t.index.hola}, {userData.username || "usuario"}! 👋
              </h1> */}

              <div className="flex items-center justify-center gap-4 mb-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {t.index.level} {currentLevel}
                </Badge>
              </div>

              <div className="w-full mb-4">
                <div className="flex justify-center text-sm text-gray-600 mb-1">
                  <span>{xpProgress.current} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${xpProgress.percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="w-full flex flex-col items-center mb-2">
                {badgesLoading ? (
                  <div className="text-gray-400 text-xs">{t.profile.loadingBadges || "Cargando insignias..."}</div>
                ) : earnedBadges.length === 0 ? (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs py-1 px-2">
                    {t.index.noinsignias}
                  </Badge>
                ) : (
                  <Badge
                    key={earnedBadges[0].id}
                    variant="secondary"
                    className={
                      getRarityColor(earnedBadges[0].rarity) +
                      " flex items-center gap-1 text-xs font-medium py-1 px-3"
                    }
                    style={{ fontWeight: 500 }}
                  >
                    <span className="mr-1 text-base">{earnedBadges[0].icon}</span>
                    {earnedBadges[0].name?.[language] || earnedBadges[0].name?.en || "Sin nombre"}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
          
          {/* Última multa recibida o mensaje */}
         {pendingFinesToPay.length > 0 ? (
  <div className="flex justify-center my-2">
    <div className="w-full max-w-md">
      <Card className="w-full max-w-[340px] mx-auto border-0 rounded-2xl shadow bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardHeader className="pb-2 pt-2">
          <CardTitle className="text-base text-orange-800 font-semibold">
            {t.index.lastFineRecived}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 pt-0 px-2">
          <FineCard
            fine={pendingFinesToPay[0]}
            userId={userId}
            showPayButton={pendingFinesToPay[0].status === "pending"}
            onPay={() => handlePayFine(pendingFinesToPay[0])}
          />
        </CardContent>
      </Card>
      </div>
  </div>
) : (
  // Card verde "Congratulations" si no hay multas pendientes de pago
  <div className="flex justify-center my-2">
    <div className="w-full max-w-md">
      <Card className="border-0 rounded-2xl shadow bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="py-4 text-center flex flex-col items-center">
          <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
          <h3 className="text-base font-bold text-green-800 mb-0 flex items-center justify-center gap-2">
            {t.index.congrats} <span className="text-xs">🎉</span>
          </h3>
          <p className="text-green-700 text-xs mb-0">{t.index.noPendentFines}</p>
        </CardContent>
      </Card>
    </div>
  </div>
)}
  

          {/* Stats Cards */}
          <MultasRetosSection
            sentFines={sentFines}
            receivedFines={receivedFines}
            challengesAccepted={challengesAccepted}
            challengesFailed={challengesFailed} 
            challengesCompleted={challengesCompleted}
            t={t}
            navigate={navigate}
          />

          {/* <div className="grid grid-cols-3 gap-2 mb-4">
            <Card
              className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center"
              onClick={() => handleStatsCardClick("pending")}
            >
              <CardContent className="p-2 flex flex-col items-center justify-center">
                <p className="text-xs font-semibold text-red-600 mb-0.5">{t.index.pendents}</p>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <p className="text-xl font-bold text-red-700">{pendingFines.length}</p>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200 px-1 py-0.5 text-xs">
                  {pendingAmount} CHF
                </Badge>
              </CardContent>
            </Card>
            <Card
              className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center"
              onClick={() => handleStatsCardClick("sent")}
            >
              <CardContent className="p-2 flex flex-col items-center justify-center">
                <p className="text-xs font-semibold text-blue-600 mb-0.5">{t.pages.history.sent}</p>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <p className="text-xl font-bold text-blue-700">{sentFines.length}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-1 py-0.5 text-xs">
                  {sentAmount} CHF
                </Badge>
              </CardContent>
            </Card>
            <Card
              className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col justify-center items-center"
              onClick={() => handleStatsCardClick("received")}
            >
              <CardContent className="p-2 flex flex-col items-center justify-center">
                <p className="text-xs font-semibold text-green-600 mb-0.5">{t.pages.history.received}</p>
                <div className="flex items-baseline gap-1 mb-0.5">
                  <p className="text-xl font-bold text-green-700">{receivedFines.length}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-1 py-0.5 text-xs">
                  {receivedAmount} CHF
                </Badge>
              </CardContent>
            </Card>
          </div> */}

          {/* Actividad reciente */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}

            {/* Recibidas */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.index.recivedFines}</CardTitle>
                <CardDescription>{t.index.recentRecivedFines}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {receivedFines.length > 0 ? (
                  receivedFines.slice(0, 3).map((fine) => (
                    <div
                      key={fine.id}
                      className="flex flex-row items-stretch gap-2 rounded-lg bg-white/80 shadow-sm px-4 py-3 border"
                    > */}

                      {/* Info multa */}
                      {/* <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={fine.sender_avatar_url || undefined}
                              alt={fine.sender_name || "Avatar"}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-xl">
                              {fine.sender_name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">
                              {t.index.de} {fine.sender_name}
                            </div>
                            {fine.status === "pending" ? (
                              <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-semibold">
                                {t.index.pendent}
                              </span>
                            ) : (
                              <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-semibold">
                                {t.index.payed}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-600 text-sm mb-1">{fine.reason}</div>
                        <div className="text-gray-400 text-xs mb-2">
                          {fine.date ? new Date(fine.date).toLocaleDateString() : ""}
                        </div>
                      </div> */}
                      
                      {/* Precio y botón alineados a la derecha */}
                      {/* <div className="flex flex-col items-end justify-between">
                        <div className="text-xl sm:text-2xl font-bold text-purple-700 mb-2">
                          {fine.amount} CHF
                        </div>
                        {fine.status === "pending" && (
                          <Button
                            className="bg-green-500 hover:bg-green-600 text-white font-bold px-4"
                            onClick={() => handlePayFine(fine)}
                            size="sm"
                          >
                            {t.fines.pay}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {t.index.noRecivedFines}
                  </p>
                )}
                {receivedFines.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleStatsCardClick("received")}
                  >
                    {t.index.seeAllRecivedFines}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div> */}
        </div>
      </div>

      {/* Modals */}
      <CreateFineModal
        isOpen={isCreateFineModalOpen}
        onClose={() => setIsCreateFineModalOpen(false)}
        onSubmit={handleCreateFine}
        contacts={contacts}
        preselectedContact={null}
        currentUser={userData}
        currentUserUsername={userData.username}
      />
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
      {selectedFine && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedFine(null);
          }}
          fine={selectedFine}
          onPayment={handlePayment}
        />
      )}
      <AchievementModal
        achievements={achievements}
        onComplete={() => setAchievements([])}
      />
      <ShareAppModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        appUrl="https://deswg.vercel.app/welcome"
      />
      {/* Footer siempre al final */}
      {/* <Footer /> */}

      {/* ======== AÑADIDO: Mostrar el tutorial solo 1ª vez tras login ======== */}
      {showTutorial && user && (
        <IndexTutorialOverlay
          user={user}
          profileId={profile?.id}
          onFinish={() => setShowTutorial(false)}
          onOpenShare={() => setShowShareModal(true)}
        />
      )}
      {/* ==================================================================== */}
    </div>
  );
}
