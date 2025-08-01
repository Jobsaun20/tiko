// src/components/BadgeUnlockedModal.tsx

import React from "react";
import { Badge } from "@/types/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface BadgeUnlockedModalProps {
  badges: Badge[];
  onClose: () => void;
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badges,
  onClose,
}) => {
  const { t, language } = useLanguage();
  const m = t.badgeUnlocked;

  // Helper multilenguaje para badge.name/description
  function getText(field: string | Record<string, string> | undefined) {
    if (!field) return "";
    if (typeof field === "string") return field;
    return (
      field[language] ||
      field["es"] ||
      Object.values(field)[0] ||
      ""
    );
  }

  const isSingle = badges.length === 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-full max-w-[320px] relative">
        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label={m.close}
        >
          ×
        </button>

        {/* Icono destacado */}
        <div className="text-5xl mb-3">{badges[0]?.icon || "🏆"}</div>

        {/* Título */}
        <h2 className="text-xl font-bold text-center text-[#52AEB9] mb-1">
          {isSingle ? m.titleSingle : m.titleMultiple}
        </h2>
        <p className="text-xs text-gray-500 mb-5 text-center">
          {isSingle ? m.descriptionSingle : m.descriptionMultiple}
        </p>

        {/* Lista de badges */}
        <div className="flex flex-col gap-3 w-full">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center p-2 bg-gradient-to-r from-[#e5f8fa] to-[#e3f2fd] rounded-xl"
            >
              <span className="text-3xl mb-1">{badge.icon || "🎖️"}</span>
              <span className="text-base font-semibold text-[#52AEB9] text-center">
                {getText(badge.name)}
              </span>
              <span className="text-xs text-gray-600 text-center">
                {getText(badge.description)}
              </span>
            </div>
          ))}
        </div>

        {/* Botón de cierre */}
        <button
          className="mt-7 px-6 py-2 rounded-full bg-[#52AEB9] hover:bg-[#3192a4] text-white font-semibold text-sm transition"
          onClick={onClose}
        >
          {m.close}
        </button>
      </div>
    </div>
  );
};

export default BadgeUnlockedModal;
