import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, ArrowLeft, Filter, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { PaymentModal } from "@/components/PaymentModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useFines } from "@/hooks/useFines";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeModal } from "@/contexts/BadgeModalContext";

// URL de tu Edge Function en Supabase
const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";

export default function History() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile: user, updateProfile, fetchProfile } = useUserProfile();
  const { user: authUser, session } = useAuthContext();
  const { showBadges } = useBadgeModal();
  const { fines, loading, payFine } = useFines();

  const [filter, setFilter] = useState<string>("all");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedFine, setSelectedFine] = useState<any>(null);

  // --- NOTIFICACIÓN NUEVA MULTA RECIBIDA ---
  const prevReceivedRef = useRef<number>(0);
  useEffect(() => {
    if (!user) return;
    const received = fines.filter(
      f => f.recipient.id === user.id && f.status === "pending"
    );
    if (prevReceivedRef.current && received.length > prevReceivedRef.current) {
      const lastFine = received[0];
      toast({
        title: t.history.newFineReceived,
        description: `${t.history.newFineFrom} ${lastFine.sender.name}`,
        variant: "default",
      });
    }
    prevReceivedRef.current = received.length;
  }, [fines, user, toast, t.history.newFineFrom, t.history.newFineReceived]);

  // -------- PAGO DE MULTA Y CHEQUEO DE BADGES --------
  const handlePayment = async () => {
    if (!selectedFine) return;
    try {
      await payFine(selectedFine.id);
      toast({
        title: t.fines.finePaid,
        description: `${t.history.fineForAmount} ${selectedFine.amount} CHF ${t.history.correctlyPaid}`,
      });

      // XP base
      const BASE_XP = 2;
      let gainedXp = BASE_XP;

      // Chequear y otorgar badges
      if (authUser && session?.access_token) {
        const resp = await fetch(CHECK_BADGES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session.access_token,
          },
          body: JSON.stringify({
            user_id: authUser.id,
            action: "pay_fine",
            action_data: {
              amount: selectedFine.amount,
              fine_id: selectedFine.id,
              lang: language,
            },
          }),
        });
        const result = await resp.json();
        if (result?.newlyEarned?.length) {
          showBadges(result.newlyEarned, language);
          result.newlyEarned.forEach((b: any) => {
            gainedXp += b.xp_reward || b.xpReward || 0;
          });
        }
      }

      // Actualizar XP
      if (gainedXp > 0 && user) {
        const nuevoXP = (user.xp || 0) + gainedXp;
        const res = await updateProfile({ xp: nuevoXP });
        if (res.error) {
          toast({
            title: t.history.experienceUpdateError,
            description: res.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: t.achievements.title || t.history.xpGained,
            description: t.achievements.xpGained
              ? t.achievements.xpGained.replace("{xp}", String(gainedXp))
              : `${t.history.xpGainedDescription1} ${gainedXp} ${t.history.xpGainedDescription2}`,
            variant: "default",
          });
          fetchProfile();
        }
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Unknown Error",
        variant: "destructive",
      });
    } finally {
      setPaymentModalOpen(false);
      setSelectedFine(null);
    }
  };

  const handlePayFine = (fine: any) => {
    setSelectedFine(fine);
    setPaymentModalOpen(true);
  };

  // --- Filtrado ---
  const filteredFines = fines.filter(f => {
    if (!user) return false;
    const isSender = f.sender.id === user.id;
    const isRecipient = f.recipient.id === user.id;

    switch (filter) {
      case "sent": return isSender;
      case "received": return isRecipient;
      case "paid": return f.status === "paid" && (isSender || isRecipient);
      case "pending": return f.status === "pending" && (isSender || isRecipient);
      default: return isSender || isRecipient;
    }
  });

  const getTotalCount = (type: string) => {
    if (!user) return 0;
    return fines.filter(f => {
      const isSender = f.sender.id === user.id;
      const isRecipient = f.recipient.id === user.id;
      switch (type) {
        case "sent": return isSender;
        case "received": return isRecipient;
        case "paid": return f.status === "paid" && (isSender || isRecipient);
        case "pending": return f.status === "pending" && (isSender || isRecipient);
      }
      return false;
    }).length;
  };

  const colorMap: Record<string, string> = {
  sent:    "text-blue-600",
  received:"text-red-600",
  paid:    "text-green-600",
  pending: "text-yellow-600",
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Back en móvil */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Button>
        </div>

        {/* Título */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <HistoryIcon className="h-8 w-8" />
            {t.pages.history.title}
          </h1>
          <p className="text-gray-600">{t.pages.history.description}</p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t.pages.history.filter}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["all","sent","received","paid","pending"].map(key => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(key)}
                  className={filter === key ? "bg-purple-600 text-white" : ""}
                >
                  {t.pages.history[key as keyof typeof t.pages.history]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  {(["sent","received","paid","pending"] as const).map((type) => (
    <Card key={type}>
      <CardContent className="p-4 text-center">
        {/* aplica aquí la clase de color según el tipo */}
        <div className={`text-2xl font-bold ${colorMap[type]}`}>
          {getTotalCount(type)}
        </div>
        <div className="text-sm text-gray-600">
          {t.pages.history[type]}
        </div>
      </CardContent>
    </Card>
  ))}
</div>

        {/* Lista de multas */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t.contacts.loading}</div>
          ) : filteredFines.length > 0 ? (
            filteredFines.map(fine => (
              <div
                key={fine.id}
                className="flex items-stretch gap-2 rounded-lg bg-white/80 shadow-sm px-4 py-3 border"
              >
                {/* Avatar + info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={
                        fine.sender.id === user?.id
                          ? fine.recipient.avatar_url || "/default-avatar.png"
                          : fine.sender.avatar_url || "/default-avatar.png"
                      }
                      alt={
                        fine.sender.id === user?.id
                          ? fine.recipient.name
                          : fine.sender.name
                      }
                      className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="font-semibold">
                        {fine.sender.id === user?.id
                          ? `A ${fine.recipient.name}`
                          : `De ${fine.sender.name}`}
                      </div>
                      <span
                        className={
                          fine.status === "paid"
                            ? "inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-semibold"
                            : "inline-block bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-semibold"
                        }
                      >
                        {fine.status === "pending" ? t.pages.history.pending : t.pages.history.paid}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm mb-1">{fine.reason}</div>
                  <div className="text-gray-400 text-xs mb-2">
                    {fine.date && new Date(fine.date).toLocaleDateString()}
                  </div>
                </div>

                {/* Importe y botón */}
                <div className="flex flex-col items-end justify-between">
                  <div className="text-xl sm:text-2xl font-bold text-purple-700 mb-2">
                    {fine.amount} CHF
                  </div>
                  {fine.recipient.id === user?.id && fine.status === "pending" && (
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-4"
                      size="sm"
                      onClick={() => handlePayFine(fine)}
                    >
                      {t.fines.pay}
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {t.pages.history.noResults}
                </h3>
                <p className="text-gray-600">
                  {t.pages.history.noResultsDescription}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de pago */}
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
    </div>
  );
}
