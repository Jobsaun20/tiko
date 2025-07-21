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
  // Extraemos t Y language
  const { t, language } = useLanguage();
  const m = t.badgeUnlocked;

  // Helper multilenguaje para badge.name/description
  function getText(field: string | Record<string, string> | undefined) {
    if (!field) return "";
    if (typeof field === "string") return field;
    // Ahora usamos la variable language, no t.language
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
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center w-full max-w-md relative">
        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label={m.close}
        >
          ×
        </button>

        {/* Icono */}
        <div className="text-5xl mb-4">{badges[0]?.icon || "🏆"}</div>

        {/* Título y descripción */}
        <h2 className="text-2xl font-bold text-purple-700 mb-2 text-center">
          {isSingle ? m.titleSingle : m.titleMultiple}
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          {isSingle ? m.descriptionSingle : m.descriptionMultiple}
        </p>

        {/* Lista de badges */}
        <div className="flex flex-col gap-4 w-full">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center p-2 border-b last:border-b-0"
            >
              <span className="text-3xl mb-1">{badge.icon || "🎖️"}</span>
              <span className="text-lg font-semibold text-purple-800 text-center">
                {getText(badge.name)}
              </span>
              <span className="text-sm text-gray-600 text-center">
                {getText(badge.description)}
              </span>
            </div>
          ))}
        </div>

        {/* Botón de cierre */}
        <button
          className="mt-8 px-6 py-2 rounded bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
          onClick={onClose}
        >
          {m.close}
        </button>
      </div>
    </div>
  );
};

export default BadgeUnlockedModal;
