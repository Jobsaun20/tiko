import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhoneWarningBannerProps {
  onAddPhone: () => void;
}

export default function PhoneWarningBanner({ onAddPhone }: PhoneWarningBannerProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-4 flex flex-col items-center text-center">
      <div className="mb-3">
        <span>
          {t.banner.phoneWarning ||
            "Debes añadir tu número de teléfono para enviar y recibir multas con Twint."}
        </span>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={onAddPhone}
        className="mx-auto"
      >
        {t.banner.phoneWarningButton || "Añadir número"}
      </Button>
    </div>
  );
}
