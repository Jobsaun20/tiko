// src/components/PhoneWarningBanner.tsx
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PhoneWarningBanner({ onAddPhone }: { onAddPhone: () => void }) {
  return (
    <div className="flex items-center bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 rounded mb-4">
      <AlertTriangle className="mr-2" />
      <span className="flex-1">
        Debes añadir tu número de teléfono para enviar y recibir multas con Twint.
      </span>
      <Button
        size="sm"
        variant="outline"
        className="ml-4"
        onClick={onAddPhone}
      >
        Añadir número
      </Button>
    </div>
  );
}
