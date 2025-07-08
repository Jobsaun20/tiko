import React, { createContext, useContext, useState, ReactNode } from "react";
import { BadgeUnlockedModal } from "@/components/BadgeUnlockedModal";

interface Badge {
  id: string;
  icon: string;
  name: Record<string, string>;
  description: Record<string, string>;
}

interface BadgeModalContextType {
  showBadges: (badges: Badge[]) => void;
}

const BadgeModalContext = createContext<BadgeModalContextType | undefined>(undefined);

export const useBadgeModal = () => {
  const ctx = useContext(BadgeModalContext);
  if (!ctx) throw new Error("useBadgeModal must be used within BadgeModalProvider");
  return ctx;
};

export const BadgeModalProvider = ({ children }: { children: ReactNode }) => {
  const [badges, setBadges] = useState<Badge[] | null>(null);

  const showBadges = (newBadges: Badge[]) => setBadges(newBadges);

  const handleClose = () => setBadges(null);

  return (
    <BadgeModalContext.Provider value={{ showBadges }}>
      {children}
      {badges && (
        <BadgeUnlockedModal badges={badges} onClose={handleClose} />
      )}
    </BadgeModalContext.Provider>
  );
};
