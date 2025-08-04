import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Filter, Search, ScrollText } from "lucide-react";
import { Header } from "@/components/Header";
import { PaymentModal } from "@/components/PaymentModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useFines } from "@/hooks/useFines";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { FineCard } from "@/components/FineCard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const CHECK_BADGES_URL = "https://psnxdeykxselxxtvlgzb.supabase.co/functions/v1/check_badges";

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

  const prevReceivedRef = useRef<number>(0);
  useEffect(() => {
    if (!user) return;
    const received = fines.filter(
      f => f.recipient_id === user.id && f.status === "pending"
    );
    if (prevReceivedRef.current && received.length > prevReceivedRef.current) {
      const lastFine = received[0];
      toast({
        title: t.history.newFineReceived,
        description: `${t.history.newFineFrom} ${lastFine.sender_name}`,
        variant: "default",
      });
    }
    prevReceivedRef.current = received.length;
  }, [fines, user, toast, t.history.newFineFrom, t.history.newFineReceived]);

  const handlePayment = async () => {
    if (!selectedFine) return;
    try {
      await payFine(selectedFine.id);
      toast({
        title: t.fines.finePaid,
        description: `${t.history.fineForAmount} ${selectedFine.amount} € ${t.history.correctlyPaid}`,
      });

      const BASE_XP = 2;
      let gainedXp = BASE_XP;

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

  const filteredFines = fines.filter(f => {
    if (!user) return false;
    const isSender = f.sender_id === user.id;
    const isRecipient = f.recipient_id === user.id;
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
      const isSender = f.sender_id === user.id;
      const isRecipient = f.recipient_id === user.id;
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

  // Lista de claves para los filtros
  const FILTER_KEYS = ["all", "sent", "received", "paid", "pending"];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Header />
      <div className="w-full max-w-[340px] mx-auto px-2 py-4">
        <div className="md:hidden mb-4"></div>

        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <ScrollText className="h-8 w-8 text-black" />
            {t.pages.history.title}
          </h1>
          <p className="text-gray-600">{t.pages.history.description}</p>
        </div>      

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(["sent", "received", "paid", "pending"] as const).map((type) => (
            <Card key={type}>
              <CardContent className="p-4 text-center">
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

{/* Filtros en Dropdown con nombre seleccionado */}
        <div className="mb-6 flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
                aria-label="Filtrar"
                type="button"
              >
                <Filter className="h-5 w-5 text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {FILTER_KEYS.map(key => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setFilter(key)}
                  className={filter === key ? "font-semibold text-purple-600" : ""}
                >
                  {t.pages.history[key as keyof typeof t.pages.history]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Texto del filtro seleccionado */}
          <span className="ml-1 text-sm text-gray-700 font-medium flex items-center bg-gray-100 rounded-lg px-2 py-1">
            {t.pages.history[filter as keyof typeof t.pages.history]}
          </span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t.contacts.loading}</div>
          ) : filteredFines.length > 0 ? (
            filteredFines.map(fine => (
              <FineCard
                key={fine.id}
                fine={fine}
                userId={user?.id}
                showPayButton={fine.recipient_id === user?.id && fine.status === "pending"}
                onPay={() => handlePayFine(fine)}
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
