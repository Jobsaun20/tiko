// src/components/PhoneWarningBanner.tsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhoneWarningBannerProps {
  onAddPhone: () => void;
}

export default function PhoneWarningBanner({ onAddPhone }: PhoneWarningBannerProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-4">
      <AlertTriangle className="mr-2" />
      <span className="flex-1">
        {t.banner.phoneWarning ||
          "Debes añadir tu número de teléfono para enviar y recibir multas con Twint."}
      </span>
      <Button
        size="sm"
        variant="outline"
        className="ml-4"
        onClick={onAddPhone}
      >
        {t.banner.phoneWarningButton || "Añadir número"}
      </Button>
    </div>
  );
}
