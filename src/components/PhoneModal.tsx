// src/components/PhoneModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidSwissPhone, normalizeSwissPhone } from "@/utils/validateSwissPhone";
import { useLanguage } from "@/contexts/LanguageContext"; // <-- Importa el hook

export default function PhoneModal({ isOpen, onClose, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phone: string) => Promise<void>;
}) {
  const { t } = useLanguage(); // <-- Hook para traducciones
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!isValidSwissPhone(phone)) {
      setError(t.modal.errorPhone || "Introduce un número suizo válido (+41 o 07X).");
      return;
    }
    await onSave(normalizeSwissPhone(phone));
    setPhone("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t.modal.addTelephoneNumber || "Introduce tu número de teléfono suizo"}
          </DialogTitle>
        </DialogHeader>
        <Input
          placeholder={t.modal.placeholderPhone || "Ej: +41791234567 o 079 123 45 67"}
          value={phone}
          onChange={e => setPhone(e.target.value)}
          autoFocus
        />
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t.challenges.cancel || "Cancelar"}
          </Button>
          <Button onClick={handleSave}>
            {t.pages.contacts.save || "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
