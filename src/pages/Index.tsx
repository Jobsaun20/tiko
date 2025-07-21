// src/pages/index.tsx
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



// URL de tu Edge Function en Supabase
const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";

// Footer
function Footer() {
  return (
    <footer
      className="
        w-full
        bg-white/70
        border-t
        border-gray-200
        text-xs
        text-gray-500
        text-center
        py-1.5
        backdrop-blur
        shadow-sm
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

    // ---- NUEVO: Estados para insignias reales ----
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);


  // Si no hay perfil, inicializa datos vacíos para nuevo usuario
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

  // Gamificación
  const currentLevel = calculateLevel(userData.xp);
  const xpProgress = getXPProgress(userData.xp);
  const userBadges = BADGES.filter(badge => (userData.badges || []).includes(badge.id));

  // Validación de teléfono
  const needsPhone = !userData.phone || !isValidSwissPhone(userData.phone);

  // GUARDAR TELÉFONO
  const handleSavePhone = async (phone: string) => {
    if (!isValidSwissPhone(phone)) return;
    await supabase.from("users").update({ phone: normalizeSwissPhone(phone) }).eq("id", profile?.id);
    if (typeof updateProfile === "function") await updateProfile({ phone: normalizeSwissPhone(phone) });
    setShowPhoneModal(false);
    toast({ title: "Teléfono actualizado", description: "Ahora puedes enviar y recibir multas con Twint" });
  };
useEffect(() => {
  const fetchUserBadges = async () => {
    if (!profile?.id) {
      setEarnedBadges([]);
      setBadgesLoading(false);
      return;
    }
    setBadgesLoading(true);

    // 1. Obtener user_badges del usuario
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

    // 2. Obtener datos de badges
    const badgeIds = userBadges.map((b) => b.badge_id);
    const { data: badgesData } = await supabase
      .from("badges")
      .select("*")
      .in("id", badgeIds);

    // 3. Juntar info y asegurar que name/description es JSON
    const joined = userBadges
      .map((ub) => {
        const badge = badgesData.find((b) => b.id === ub.badge_id) || {};
        // Asegúrate de que name y description son objetos
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

    // Ordenar por fecha: el más reciente primero
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

  // ACCIONES
  const handleCreateFine = async (newFine: any) => {
    setIsCreateFineModalOpen(false);
    toast({ title: "Multa creada", description: "La multa ha sido enviada" });
  };

  // ABRIR MODAL DE PAGO
  const handlePayFine = (fine: any) => {
    setSelectedFine(fine);
    setPaymentModalOpen(true);
  };

  // --------- FUNCIÓN DE PAGO CON XP Y BADGES ---------
  const handlePayment = async () => {
  if (selectedFine) {
    try {
      await payFine(selectedFine.id);
      toast({
        title: t.fines.finePaid,
        description: `Multa de ${selectedFine.amount} CHF pagada correctamente`,
      });

      // --- SUMA XP BASE ---
      const BASE_XP = 2;
      let gainedXp = BASE_XP;

      // --- CHEQUEAR Y OTORGAR BADGES (EDGE FUNCTION) ---
      if (user && session?.access_token) {
        const response = await fetch(CHECK_BADGES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.access_token,
          },
          body: JSON.stringify({
            user_id: user.id,
            action: "pay_fine", // asegúrate de que la acción coincida con tu lógica de badges
            action_data: {
              amount: selectedFine.amount,
              fine_id: selectedFine.id,
              lang: language || "es", // si tienes un campo language
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

      // --- ACTUALIZAR XP SIEMPRE, TENGA BADGE O NO ---
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

  const quickActions = [
    {
      title: t.quickActions.newFine,
      description: t.createFine.title,
      icon: Plus,
      color: "from-red-500 to-pink-500",
      onClick: () => navigate("/contacts"),
    },
    {
      title: t.quickActions.contacts,
      description: t.createFine.seeAndManageContacts,
      icon: Users,
      color: "from-blue-500 to-purple-500",
      onClick: () => navigate("/contacts"),
    },
    {
      title: t.quickActions.history,
      description: t.createFine.seeHistoryComplete,
      icon: History,
      color: "from-orange-500 to-yellow-500",
      onClick: () => navigate("/history"),
    },
    {
      title: t.createFine.groups,
      description: t.createFine.manageGroups,
      icon: Users,
      color: "from-green-500 to-emerald-500",
      onClick: () => navigate("/groups"),
    },
    {
      title: t.share.title || "Compartir app",
      description: t.share.description || "Comparte DESWG con tus amigos",
      icon: Share2,
      color: "from-blue-500 to-green-500",
      onClick: () => setShowShareModal(true),
    },
  ];

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
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
          <div className="text-center mb-6 flex flex-col items-center">
            {/* Foto de perfil */}
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
            <h1
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ color: "#52AEB9" }}
            >
              {t.index.hola}, {userData.username || "usuario"}! 👋
            </h1>

            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Nivel {currentLevel}
              </Badge>
              {/* <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {userData.xp} XP
              </Badge> */}
            </div>
            <div className="w-full mb-4">
              <div className="flex justify-center text-sm text-gray-600 mb-1">
                <span>{xpProgress.current} XP</span>
                {/* <span>{t.index.level} {currentLevel + 1}</span> */}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${xpProgress.percentage}%` }}
                ></div>
              </div>
            </div>            

            {/* Insignias */}
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

          {/* Última multa recibida o mensaje */}
          {latestReceivedFine ? (
            <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardHeader>
                <CardTitle className="text-lg text-orange-800">{t.index.lastFineRecived}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-stretch gap-2">
                  {/* Info multa */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {latestReceivedFine.sender.avatar_url ? (
                        <img
                          src={latestReceivedFine.sender.avatar_url}
                          alt={latestReceivedFine.sender.name || "Avatar"}
                          className="rounded-full h-10 w-10 object-cover border-2 border-purple-300 shadow"
                        />
                      ) : (
                        <div className="rounded-full bg-gradient-to-br from-purple-400 to-pink-500 h-10 w-10 flex items-center justify-center text-white font-bold text-xl">
                          {latestReceivedFine.sender.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold">{t.index.de} {latestReceivedFine.sender.name}</div>
                        {latestReceivedFine.status === "pending" ? (
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
                    <div className="text-gray-600 text-sm mb-1">{latestReceivedFine.reason}</div>
                    <div className="text-gray-400 text-xs mb-2">
                      {latestReceivedFine.date ? new Date(latestReceivedFine.date).toLocaleDateString() : ""}
                    </div>
                  </div>
                  {/* Precio y botón alineados a la derecha */}
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-2xl font-bold text-purple-700 mb-2">{latestReceivedFine.amount} CHF</div>
                    {latestReceivedFine.status === "pending" && (
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold px-5"
                        onClick={() => handlePayFine(latestReceivedFine)}
                      >
                        {t.fines.pay}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="px-3 py-4 sm:p-6 text-center flex flex-col items-center">
                <CheckCircle className="h-10 w-10 sm:h-16 sm:w-16 mx-auto text-green-600 mb-2 sm:mb-4" />
                <h3 className="text-lg sm:text-2xl font-bold text-green-800 mb-1 flex items-center justify-center gap-2">
                  {t.index.congrats} <span className="text-base sm:text-2xl">🎉</span>
                </h3>
                <p className="text-green-700 text-base sm:text-lg mb-0.5">{t.index.noPendentFines}</p>
                <p className="text-green-600 text-xs sm:text-base mt-1">
                  {t.index.continueLikeThis}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
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
          </div>

          {/* Acciones rápidas */}
          {/* <Card>
            <CardHeader>
              <CardTitle>{t.index.quickActions}</CardTitle>
              <CardDescription>{t.index.quickQuickActionsDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`h-auto p-3 sm:p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all bg-gradient-to-br ${action.color} text-white border-0 hover:scale-105`}
                    onClick={action.onClick}
                  >
                    <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                      {action.title}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Actividad reciente */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recibidas */}
            <Card>
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
                    >
                      {/* Info multa */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {latestReceivedFine.sender.avatar_url ? (
                            <img
                              src={latestReceivedFine.sender.avatar_url}
                              alt={latestReceivedFine.sender.name || "Avatar"}
                              className="rounded-full h-10 w-10 object-cover border-2 border-purple-300 shadow"
                            />
                          ) : (
                            <div className="rounded-full bg-gradient-to-br from-purple-400 to-pink-500 h-10 w-10 flex items-center justify-center text-white font-bold text-xl">
                              {latestReceivedFine.sender.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}

                          <div>
                            <div className="font-semibold">
                              {t.index.de} {fine.sender.name}
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
                      </div>
                      {/* Precio y botón alineados a la derecha */}
                      <div className="flex flex-col items-end justify-between">
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

            {/* Insignias recientes */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  {t.index.recentInsignias}
                </CardTitle>
                <CardDescription>{t.index.recentHitos}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {userBadges.slice(0, 3).map((badge) => (
                    <Badge
                      key={badge.id}
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      {badge.icon} {badge.name.es || badge.name.en || badge.name.de}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="w-full"
                >
                  {t.index.seeAllInsignias}
                </Button>
              </CardContent>
            </Card> */}
          </div>
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
        appUrl="https://picpic-ruby.vercel.app/welcome"
      />

      {/* Footer siempre al final */}
      <Footer />
    </div>
  );
}
