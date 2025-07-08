import React from "react";

interface Badge {
  id: string;
  icon: string;
  name: Record<string, string>;         // { es: string, en: string, ... }
  description: Record<string, string>;  // { es: string, en: string, ... }
}

interface BadgeUnlockedModalProps {
  badges: Badge[];             // Array de logros desbloqueados
  onClose: () => void;         // Handler para cerrar el modal
  lang?: string;               // Idioma a mostrar (por defecto "es")
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badges,
  onClose,
  lang = "es",
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          {badges.length === 1 ? "¡Has desbloqueado un logro!" : "¡Nuevos logros desbloqueados!"}
        </h2>
        <div className="flex flex-col gap-4 w-full">
          {badges.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center p-2 border-b last:border-b-0">
              <span className="text-3xl mb-1">{badge.icon}</span>
              <span className="text-lg font-semibold text-purple-800 text-center">
                {badge.name?.[lang] || badge.name?.["es"]}
              </span>
              <span className="text-sm text-gray-600 text-center">
                {badge.description?.[lang] || badge.description?.["es"]}
              </span>
            </div>
          ))}
        </div>
        <button
          className="mt-8 px-6 py-2 rounded bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
          onClick={onClose}
        >
          ¡Genial!
        </button>
      </div>
    </div>
  );
};
