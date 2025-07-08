import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, History, UserPlus, Award, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { CreateFineModal } from "@/components/CreateFineModal";
import { FineCard } from "@/components/FineCard";
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
// --- INTEGRACIÓN DE LOGROS ---
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { checkAndAwardBadge } from "@/utils/checkAndAwardBadge";

export default function Index() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session } = useAuthContext(); // <-- asegúrate de que tienes session o access_token
  const { profile, loading, updateProfile } = useUserProfile();
  const { fines, payFine } = useFines();
  const { showBadges } = useBadgeModal();

  // Estados para modales y multas
  const [isCreateFineModalOpen, setIsCreateFineModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

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
  // Usa SIEMPRE fines del hook global
  const finesList = Array.isArray(fines) ? fines : [];

  // Multas (calculadas en tiempo real)
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

  // MARCAR MULTA COMO PAGADA y refrescar local y en la BD (usando payFine)
  // --------- MODIFICADO PARA CHEQUEAR Y MOSTRAR LOGROS ---------
  const handlePayment = async () => {
    if (selectedFine) {
      try {
        await payFine(selectedFine.id);
        toast({
          title: t.fines.finePaid,
          description: `Multa de ${selectedFine.amount} CHF pagada correctamente`
        });
        // --------- CHEQUEAR BADGES ---------
        if (user && session?.access_token) {
          const badges = await checkAndAwardBadge(
            user.id,
            "pay_qr", // Usa la key correspondiente a tu acción
            { amount: selectedFine.amount, fine_id: selectedFine.id },
            session.access_token
          );
          if (badges && badges.length > 0) {
            showBadges(badges);
          }
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive"
        });
      }
    }
    setPaymentModalOpen(false);
    setSelectedFine(null);
  };

  const handleStatsCardClick = (filter: string) => {
    navigate(`/history?filter=${filter}`);
  };

  const quickActions = [
    {
      title: t.quickActions.newFine,
      description: "Crear una nueva multa social",
      icon: Plus,
      color: "from-red-500 to-pink-500",
      onClick: () => navigate("/contacts")},
    {
      title: t.quickActions.contacts,
      description: "Ver y gestionar contactos",
      icon: Users,
      color: "from-blue-500 to-purple-500",
      onClick: () => navigate("/contacts")
    },
    {
      title: t.quickActions.history,
      description: "Ver historial completo",
      icon: History,
      color: "from-orange-500 to-yellow-500",
      onClick: () => navigate("/history")
    },
    {
      title: "Grupos",
      description: "Gestionar grupos",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      onClick: () => navigate("/groups")
    },
    {
      title: t.nav.invite,
      description: "Invitar amigos a Oopsie",
      icon: UserPlus,
      color: "from-pink-500 to-rose-500",
      onClick: () => setIsInviteModalOpen(true)
    }
  ];

  // ----------- LOGIN O DASHBOARD ------------
  if (loading) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
      </div>
    );
  }

  // ----------- DASHBOARD PRINCIPAL -----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Mensaje bienvenida */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            ¡Hola, {userData.username || "usuario"}! 👋
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Nivel {currentLevel}
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {userData.xp} XP
            </Badge>
          </div>
          <div className="max-w-md mx-auto mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{xpProgress.current} XP</span>
              <span>Nivel {currentLevel + 1}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${xpProgress.percentage}%` }}
              ></div>
            </div>
          </div>
          {/* Insignias */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {userBadges.length === 0 ? (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Sin insignias
              </Badge>
            ) : (
              userBadges.slice(0, 3).map((badge) => (
                <Badge key={badge.id} variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {badge.icon} {badge.name}
                </Badge>
              ))
            )}
          </div>
        </div>
        {/* Última multa recibida o mensaje */}
        {latestReceivedFine ? (
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-orange-800">Última Multa Recibida</CardTitle>
            </CardHeader>
            <CardContent>
              <FineCard
                fine={latestReceivedFine}
                onPay={() => handlePayFine(latestReceivedFine)}
                showPayButton={latestReceivedFine.status === "pending"}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                ¡Enhorabuena! 🎉
              </h3>
              <p className="text-green-700 text-lg">
                No tienes multas pendientes
              </p>
              <p className="text-green-600 mt-2">
                Mantén este buen comportamiento
              </p>
            </CardContent>
          </Card>
        )}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatsCardClick("pending")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Pendientes</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl font-bold text-red-700">{pendingFines.length}</p>
                    <p className="text-xs sm:text-sm text-red-600">multas</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800 border-red-200 px-2 py-1">
                  {pendingAmount} CHF
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatsCardClick("sent")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Enviadas</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-700">{sentFines.length}</p>
                    <p className="text-xs sm:text-sm text-blue-600">total enviado</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-2 py-1">
                  {sentAmount} CHF
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card 
            className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleStatsCardClick("received")}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Recibidas</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl sm:text-3xl font-bold text-green-700">{receivedFines.length}</p>
                    <p className="text-xs sm:text-sm text-green-600">total recibido</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-2 py-1">
                  {receivedAmount} CHF
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Gestiona tus multas de forma eficiente</CardDescription>
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
        </Card>
        {/* Actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recibidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Multas Recibidas Recientes</CardTitle>
              <CardDescription>Multas que has recibido recientemente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {receivedFines.length > 0 ? (
                receivedFines.slice(0, 3).map((fine) => (
                  <FineCard
                    key={fine.id}
                    fine={fine}
                    onPay={() => handlePayFine(fine)}
                    showPayButton={fine.status === "pending"}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">No has recibido multas</p>
              )}
              {receivedFines.length > 3 && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleStatsCardClick("received")}
                >
                  Ver todas las recibidas
                </Button>
              )}
            </CardContent>
          </Card>
          {/* Insignias recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5" />
                Insignias Recientes
              </CardTitle>
              <CardDescription>Tus logros más recientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {userBadges.slice(0, 3).map((badge) => (
                  <Badge key={badge.id} variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {badge.icon} {badge.name}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/profile")}
                className="w-full"
              >
                Ver todas las insignias
              </Button>
            </CardContent>
          </Card>
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
    </div>
  );
}
