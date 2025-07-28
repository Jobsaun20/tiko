import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Contact {
  id: string;
  name: string;
  email: string;
}

interface CreateFineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (fine: any) => void;
  preselectedContact?: Contact | null;
  contacts: Contact[];
  currentUser: {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
}
  currentUserUsername: string; // <- obligatorio
}

export const CreateFineModal = ({
  isOpen,
  onClose,
  onSubmit,
  preselectedContact,
  contacts,
  currentUser,
  currentUserUsername,
}: CreateFineModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    reason: "",
    amount: "",
    recipient_id: preselectedContact?.id || "",
    recipient_email: preselectedContact?.email || "",
  });

  // Autocompletado de búsqueda y lista
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      recipient_id: preselectedContact?.id || "",
      recipient_email: preselectedContact?.email || "",
    }));
    setSearch(preselectedContact?.name || preselectedContact?.email || "");
  }, [preselectedContact]);

  // Filtrado robusto: nombre + email (aunque alguno esté vacío)
  const filteredContacts = contacts.filter(contact => {
    const name = (contact.name || "").toLowerCase().trim();
    const email = (contact.email || "").toLowerCase().trim();
    const term = (search || "").toLowerCase().trim();
    return name.includes(term) || email.includes(term);
  });

  // Selección de contacto desde lista
  const handleSelectContact = (contact: Contact) => {
    setFormData(prev => ({
      ...prev,
      recipient_id: contact.id,
      recipient_email: contact.email,
    }));
    setSearch(contact.name || contact.email);
    setShowList(false);
  };

  // Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reason || !formData.amount) {
      toast({
        title: t.common.error,
        description: t.createFine.errors.complete,
        variant: "destructive",
      });
      return;
    }

    if (!formData.recipient_id) {
      toast({
        title: t.common.error,
        description: t.createFine.errors.selectRecipient,
        variant: "destructive",
      });
      return;
    }

    // Validar que el recipient existe
    const recipient = contacts.find(c => c.id === formData.recipient_id);
    if (!recipient) {
      toast({
        title: t.common.error,
        description: "Contacto no encontrado",
        variant: "destructive",
      });
      return;
    }

    // Validar que no se envía a sí mismo
    if (recipient.id === currentUser.id) {
      toast({
        title: t.common.error,
        description: "No puedes enviarte una multa a ti mismo.",
        variant: "destructive",
      });
      return;
    }

    // Preparar y enviar datos
    const fineData = {
      reason: formData.reason,
      amount: parseFloat(formData.amount),
      recipient_id: recipient.id,
      recipient_name: recipient.name || recipient.email,
      recipient_email: recipient.email,
      sender_name: currentUserUsername,
    };

    onSubmit(fineData);

    toast({
      title: t.createFine.created,
      description: t.createFine.sentTo
        .replace("{amount}", formData.amount)
        .replace("{recipient}", recipient.name || recipient.email),
    });

    setFormData({
      reason: "",
      amount: "",
      recipient_id: preselectedContact?.id || "",
      recipient_email: preselectedContact?.email || "",
    });
    setSearch("");
    setShowList(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {t.createFine.title}
          </DialogTitle>
          <DialogDescription>{t.createFine.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">{t.createFine.reason} *</Label>
            <Textarea
              id="reason"
              placeholder={t.createFine.reasonPlaceholder}
              value={formData.reason}
              onChange={e =>
                setFormData(prev => ({ ...prev, reason: e.target.value }))
              }
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">{t.createFine.amount} *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder={t.createFine.amountPlaceholder}
              value={formData.amount}
              onChange={e =>
                setFormData(prev => ({ ...prev, amount: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient_id">{t.createFine.selectContact} *</Label>
            {/* Autocompletado de contacto */}
            <div className="relative">
              <Input
                id="recipient_id"
                type="text"
                autoComplete="off"
                disabled={!!preselectedContact}
                placeholder="Buscar contacto por nombre o email"
                value={
                  !!preselectedContact
                    ? preselectedContact.name || preselectedContact.email
                    : search
                }
                onChange={e => {
                  setSearch(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    recipient_id: "",
                    recipient_email: "",
                  }));
                  setShowList(true);
                }}
                onFocus={() => setShowList(true)}
              />
              {/* Lista desplegable */}
              {showList && !preselectedContact && search.length > 0 && (
                <div className="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-48 overflow-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="p-3 text-gray-400 text-sm text-center">
                      No se encontraron contactos
                    </div>
                  ) : (
                    filteredContacts.map(contact => (
                      <div
                        key={contact.id}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleSelectContact(contact)}
                      >
                        <div className="font-medium">{contact.name || contact.email}</div>
                        {/* <div className="text-xs text-gray-500">{contact.email}</div> */}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t.createFine.cancel}
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
            >
              {t.createFine.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
