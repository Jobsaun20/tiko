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
  };
  currentUserUsername: string;
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

  const filteredContacts = contacts.filter(contact => {
    const name = (contact.name || "").toLowerCase().trim();
    const email = (contact.email || "").toLowerCase().trim();
    const term = (search || "").toLowerCase().trim();
    return name.includes(term) || email.includes(term);
  });

  const handleSelectContact = (contact: Contact) => {
    setFormData(prev => ({
      ...prev,
      recipient_id: contact.id,
      recipient_email: contact.email,
    }));
    setSearch(contact.name || contact.email);
    setShowList(false);
  };

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

    const recipient = contacts.find(c => c.id === formData.recipient_id);
    if (!recipient) {
      toast({
        title: t.common.error,
        description: "Contacto no encontrado",
        variant: "destructive",
      });
      return;
    }

    if (recipient.id === currentUser.id) {
      toast({
        title: t.common.error,
        description: "No puedes enviarte una multa a ti mismo.",
        variant: "destructive",
      });
      return;
    }

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
      <DialogContent className="w-full max-w-[320px] shadow-lg rounded-2xl px-4 py-6 max-h-[90vh] overflow-y-auto !min-h-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl text-[#52AEB9]">
            <AlertTriangle className="h-5 w-5 text-[#ffbc2a]" />
            {t.createFine.title}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {t.createFine.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="reason">{t.createFine.reason} *</Label>
            <Textarea
              id="reason"
              placeholder={t.createFine.reasonPlaceholder}
              value={formData.reason}
              onChange={e =>
                setFormData(prev => ({ ...prev, reason: e.target.value }))
              }
              className="min-h-[80px] rounded-2xl"
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
              className="rounded-2xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient_id">{t.createFine.selectContact} *</Label>
            <div className="relative">
              <Input
                id="recipient_id"
                type="text"
                autoComplete="off"
                disabled={!!preselectedContact}
                placeholder={t.createFine.selectContactPlaceholder || "Buscar contacto por nombre o email"}
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
                className="rounded-2xl"
              />
              {showList && !preselectedContact && search.length > 0 && (
                <div className="absolute z-10 left-0 right-0 bg-white border border-gray-100 rounded-2xl shadow mt-1 max-h-48 overflow-auto">
                  {filteredContacts.length === 0 ? (
                    <div className="p-3 text-gray-400 text-sm text-center">
                      {t.modal.noContactsFound || "No se encontraron contactos"}
                    </div>
                  ) : (
                    filteredContacts.map(contact => (
                      <div
                        key={contact.id}
                        className="cursor-pointer px-4 py-2 rounded-xl hover:bg-[#e5f8fa] transition"
                        onClick={() => handleSelectContact(contact)}
                      >
                        <div className="font-medium text-[#52AEB9]">{contact.name || contact.email}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-3 pt-4">
  <Button
              type="submit"
              className="rounded-full bg-[#52AEB9] hover:bg-[#42a0b0] text-white font-bold w-full transition-colors"
            >
              {t.createFine.create}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full border-[#52AEB9] text-[#52AEB9] w-full hover:bg-[#e5f8fa] transition"
            >
              {t.createFine.cancel}
            </Button>
          
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
