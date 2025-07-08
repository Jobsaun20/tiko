import React, { createContext, useContext, useState, ReactNode } from "react";
import { BadgeUnlockedModal } from "@/components/BadgeUnlockedModal";
import { Badge } from "@/types/badge"; // <--- Usa SIEMPRE el tipo único

interface BadgeModalContextType {
  showBadges: (badges: Badge[], lang?: string) => void;
}

const BadgeModalContext = createContext<BadgeModalContextType | undefined>(undefined);

export const useBadgeModal = () => {
  const ctx = useContext(BadgeModalContext);
  if (!ctx) throw new Error("useBadgeModal must be used within BadgeModalProvider");
  return ctx;
};

export const BadgeModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [badges, setBadges] = useState<Badge[] | null>(null);
  const [lang, setLang] = useState<string>("es"); // Idioma por defecto

  // Puedes pasar el idioma manualmente al mostrar el modal (o desde tu contexto global)
  const showBadges = (newBadges: Badge[], badgeLang?: string) => {
    setBadges(newBadges);
    if (badgeLang) setLang(badgeLang);
  };

  const handleClose = () => setBadges(null);

  return (
    <BadgeModalContext.Provider value={{ showBadges }}>
      {children}
      {badges && (
        <BadgeUnlockedModal badges={badges} onClose={handleClose} lang={lang} />
      )}
    </BadgeModalContext.Provider>
  );
};
