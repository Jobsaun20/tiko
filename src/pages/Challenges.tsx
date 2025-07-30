import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useChallenges } from "@/hooks/useChallenges";
import { Button } from "@/components/ui/button";
import { CreateChallengeModal } from "@/components/CreateChallengeModal";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Header } from "@/components/Header";
import { X, Trophy, ArrowLeft, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/supabaseClient"; // ⬅️ IMPORTANTE

const colorMap: Record<string, string> = {
  accepted: "text-blue-600",
  rejected: "text-red-600",
  achieved: "text-green-600",
  failed: "text-yellow-600",
};

export default function ChallengesPage() {
  const { t, language } = useLanguage();
  const statusLabels = {
    all: t.challenges.status_all,
    accepted: t.challenges.status_accepted,
    rejected: t.challenges.status_rejected,
    achieved: t.challenges.status_achieved,
    failed: t.challenges.status_failed,
  };
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { challenges, loading, fetchChallenges } = useChallenges();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<keyof typeof statusLabels>("all");

  // 💥 SUPABASE REALTIME: Recarga la lista al cambiar la tabla challenges
  useEffect(() => {
    // Si usas una view para la lista, cambia 'challenges' por el nombre real de la view
    const channel = supabase
      .channel('challenges-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',       // 'INSERT', 'UPDATE', 'DELETE' o '*'
          schema: 'public', // Ajusta el schema si no es 'public'
          table: 'challenges', // <-- Cambia aquí si usas view
        },
        (payload) => {
          // Opcional: puedes loggear el cambio
          // console.log("🔄 Cambio realtime en challenges:", payload);
          fetchChallenges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchChallenges]);

  function getUserStatus(challenge: any): keyof typeof statusLabels {
    if (!user) return "all";
    const part = challenge.challenge_participants?.find(
      (p: any) => p.user_id === user.id
    );
    if (!part) return "all";
    if (part.accepted === false) return "rejected";
    if (part.accepted === true && part.completed === true) return "achieved";
    if (part.accepted === true && part.completed === false) return "failed";
    if (part.accepted === true && (part.completed === null || part.completed === undefined)) return "accepted";
    return "all";
  }

  const filteredChallenges = useMemo(() => {
    let filtered = challenges;
    if (filter !== "all") {
      filtered = filtered.filter((c: any) => getUserStatus(c) === filter);
    }
    const term = search.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter((c: any) =>
        (c.title || "").toLowerCase().includes(term) ||
        (c.description || "").toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [search, filter, challenges, user?.id]);

  const getTotalCount = (status: keyof typeof statusLabels) => {
    if (!user) return 0;
    if (status === "all") return challenges.length;
    return challenges.filter((c: any) => getUserStatus(c) === status).length;
  };

  const clearSearch = () => setSearch("");

  if (!user) {
    return (
      <div className="p-4 max-w-xl mx-auto text-center text-gray-500">
        {t.challenges.notLoggedIn}
      </div>
    );
  }

  return (
<div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Botón volver para móviles */}
        <div className="md:hidden mb-4">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.challenges.back}
          </Button> */}
        </div>
        {/* Título e icono */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            {t.challenges.titleChallengePage}
          </h1>
          <p className="text-gray-600">{t.challenges.subtitle}</p>
        </div>
        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t.challenges.filterChallenges}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.keys(statusLabels).map((key) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(key as keyof typeof statusLabels)}
                  className={filter === key ? "bg-purple-600 text-white" : ""}
                >
                  {statusLabels[key as keyof typeof statusLabels]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Resumen de contadores por estado */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(["accepted", "rejected", "achieved", "failed"] as const).map((type) => (
            <Card key={type}>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${colorMap[type]}`}>
                  {getTotalCount(type)}
                </div>
                <div className="text-sm text-gray-600">
                  {statusLabels[type]}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Barra de búsqueda y botón crear */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  {/* Botón morado redondeado */}
  <Button
    className="bg-[#A259E6] hover:bg-[#8b41cc] text-white font-semibold px-8 py-2 rounded-full shadow-md flex items-center gap-2 text-base transition-all"
    onClick={() => setModalOpen(true)}
  >
    <span className="text-lg font-bold">+</span>
    {t.challenges.createChallenge}
  </Button>
  
  {/* Barra de búsqueda redondeada */}
  <div className="relative w-full sm:w-72">
    <input
      type="text"
      className="border border-gray-300 rounded-full px-5 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A259E6] text-base"
      placeholder={t.challenges.searchChallengePlaceholder}
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
    {search && (
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
        onClick={clearSearch}
        tabIndex={-1}
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
</div>

        <CreateChallengeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          currentUserId={user.id}
          refetchChallenges={fetchChallenges}
        />
        {/* Lista de retos filtrados */}
        <div>
          {loading ? (
            <div className="mt-8 text-gray-500">{t.challenges.loadingChallenges}</div>
          ) : challenges.length === 0 ? (
            <div className="mt-8 text-gray-400 text-center">{t.challenges.noChallenges}</div>
          ) : filteredChallenges.length === 0 ? (
            <div className="mt-8 text-gray-400 text-center">{t.challenges.noResults}</div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredChallenges.map((challenge: any) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  currentUserId={user.id}
                  refetchChallenges={fetchChallenges}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
