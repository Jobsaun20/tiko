import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryIcon, ArrowLeft, Filter, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { FineCard } from "@/components/FineCard";
import { PaymentModal } from "@/components/PaymentModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useFines } from "@/hooks/useFines";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { checkAndAwardBadge } from "@/utils/checkAndAwardBadge";


export default function History() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile: user, updateProfile } = useUserProfile(); // Usar updateProfile
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
      (f: any) => f.recipient_id === user.id && f.status === "pending"
    );
    if (prevReceivedRef.current && received.length > prevReceivedRef.current) {
      const lastFine = received[0];
      toast({
        title: "¡Nueva multa recibida!",
        description: `Has recibido una nueva multa de ${lastFine.sender_name}`,
        variant: "default",
      });
    }
    prevReceivedRef.current = received.length;
  }, [fines, user, toast]);

  // Pago de multa - con chequeo de logros y modal global
  const handlePayment = async () => {
    if (selectedFine) {
      try {
        await payFine(selectedFine.id);
        toast({
          title: t.fines.finePaid,
          description: `Multa de ${selectedFine.amount} CHF pagada correctamente`,
        });

        // --------- CHEQUEAR BADGES (misma key que Index) ---------
        if (authUser && session?.access_token) {
          const badges = await checkAndAwardBadge(
            authUser.id,
            "pay_qr", // Usa la key de acción correspondiente a tu lógica de badges
            { amount: selectedFine.amount, fine_id: selectedFine.id, lang: language || "en" },
            session.access_token
          );
          if (badges && badges.length > 0) {
            showBadges(badges);

            // --- Sumar XP y mostrar toast para el primero ganado
            let gainedXp = 0;
            badges.forEach((badge: any) => {
              gainedXp += badge.xp_reward || badge.xpReward || 0;
            });
            if (gainedXp > 0 && user) {
              updateProfile({ xp: (user.xp || 0) + gainedXp });
              toast({
                title: "¡Has ganado experiencia!",
                description: `Has ganado ${gainedXp} XP por tu acción.`,
                variant: "default",
              });
            }
          }
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    }
    setPaymentModalOpen(false);
    setSelectedFine(null);
  };

  // Abrir modal de pago
  const handlePayFine = (fine: any) => {
    setSelectedFine(fine);
    setPaymentModalOpen(true);
  };

  // Filtro según pestaña
  const filteredFines = fines.filter((fine: any) => {
    if (!user) return false;
    if (filter === "all") {
      return fine.sender_id === user.id || fine.recipient_id === user.id;
    }
    if (filter === "sent") {
      return fine.sender_id === user.id;
    }
    if (filter === "received") {
      return fine.recipient_id === user.id;
    }
    if (filter === "paid") {
      return fine.status === "paid" && (fine.sender_id === user.id || fine.recipient_id === user.id);
    }
    if (filter === "pending") {
      return fine.status === "pending" && (fine.sender_id === user.id || fine.recipient_id === user.id);
    }
    return true;
  });

  // Suma de multas por tipo para los cuadros
  const getTotalAmount = (type: string) => {
    if (!user) return 0;
    return fines
      .filter((fine: any) => {
        if (type === "sent") return fine.sender_id === user.id;
        if (type === "received") return fine.recipient_id === user.id;
        if (type === "paid") return fine.status === "paid" && (fine.sender_id === user.id || fine.recipient_id === user.id);
        if (type === "pending") return fine.status === "pending" && (fine.sender_id === user.id || fine.recipient_id === user.id);
        return true;
      })
      .length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-6">
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
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <HistoryIcon className="h-8 w-8" />
            {t.pages.history.title}
          </h1>
          <p className="text-gray-600">{t.pages.history.description}</p>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t.pages.history.filter}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: t.pages.history.all },
                { key: "sent", label: t.pages.history.sent },
                { key: "received", label: t.pages.history.received },
                { key: "paid", label: t.pages.history.paid },
                { key: "pending", label: t.pages.history.pending }
              ].map((filterOption) => (
                <Button
                  key={filterOption.key}
                  variant={filter === filterOption.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterOption.key)}
                  className={filter === filterOption.key ? "bg-purple-600 text-white" : ""}
                >
                  {filterOption.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{getTotalAmount("sent")}</div>
              <div className="text-sm text-gray-600">{t.pages.history.sent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{getTotalAmount("received")}</div>
              <div className="text-sm text-gray-600">{t.pages.history.received}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{getTotalAmount("paid")}</div>
              <div className="text-sm text-gray-600">{t.pages.history.paid}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{getTotalAmount("pending")}</div>
              <div className="text-sm text-gray-600">{t.pages.history.pending}</div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Cargando...</div>
          ) : filteredFines.length > 0 ? (
            filteredFines.map((fine: any) => (
              <FineCard
                key={fine.id}
                fine={fine}
                onPay={() => handlePayFine(fine)}
                showPayButton={fine.recipient_id === user.id && fine.status === "pending"}
                userId={user.id}
              />
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
