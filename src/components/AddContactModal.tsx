// src/components/AddContactModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient";
import { useSendContactRequest } from "@/hooks/useSendContactRequest"; // <-- IMPORTANTE

// Sugerencias de usuario para autocompletar
interface UserSuggestion {
  id: string;
  username: string;
  /* email: string; */
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactData: any) => void;
  editingContact?: any; // Opcional, para edición
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingContact = null,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { sendContactRequest } = useSendContactRequest(); // <-- Hook de invitación

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  // Si estás editando, precarga el usuario (opcional)
  useEffect(() => {
    if (editingContact) {
      setQuery(editingContact.username || "");
      setSelectedUser({
        id: editingContact.user_id || editingContact.id,
        username: editingContact.username,
       /*  email: editingContact.email, */
      });
    } else {
      setQuery("");
      setSelectedUser(null);
    }
  }, [editingContact, isOpen]);

  // Busca usuarios en Supabase por username o email
  const searchUsers = async (q: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("id,username,email")
      .or(`username.ilike.%${q}%,email.ilike.%${q}%`)
      .limit(10);
    setSuggestions(data || []);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    setSelectedUser(null);
    if (q.length >= 2) searchUsers(q);
    else setSuggestions([]);
  };

  const handleSelect = (user: UserSuggestion) => {
    setSelectedUser(user);
    setQuery(`${user.username}`);
    setSuggestions([]);
  };

  // Aquí el flujo importante: edición vs nuevo contacto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast({
        title: t.common.error,
        description: t.modal.errorSelectUser || "Debes seleccionar un usuario existente.",
        variant: "destructive",
      });
      return;
    }

    // Si es edición, mantén el flujo anterior
    if (editingContact) {
      onSubmit({
        user_id: selectedUser.id,
        name: selectedUser.username,
       /*  email: selectedUser.email, */
      });
      setQuery("");
      setSelectedUser(null);
      onClose();
      return;
    }

    // NUEVO: Envía la solicitud de contacto
    const result = await sendContactRequest(selectedUser.id);

    if (result.success) {
      toast({
        title: t.contacts.contactRequestSentTitle || "Solicitud enviada",
        description: t.contacts.contactRequestSent || "La solicitud de contacto ha sido enviada.",
        variant: "default",
      });
      setQuery("");
      setSelectedUser(null);
      onClose();
    } else {
      toast({
        title: t.common.error,
        description: result.error || t.contacts.contactRequestFailed || "No se pudo enviar la solicitud.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingContact
              ? t.pages.contacts.editContact
              : t.pages.contacts.addContact}
          </DialogTitle>
          <DialogDescription>
            {t.modal.searchContactToAdd}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 relative">
            <Input
              id="search"
              value={query}
              onChange={handleInputChange}
              placeholder={t.modal.searchNameOrEmail}
              autoComplete="off"
              disabled={!!editingContact}
            />
            {loading && (
              <div className="text-xs text-gray-400 pl-1">
                {t.modal.searching}
              </div>
            )}
            {!selectedUser && suggestions.length > 0 && (
              <div className="bg-white border rounded-md shadow p-1 max-h-48 overflow-y-auto z-50 absolute w-full">
                {suggestions.map((user) => (
                  <div
                    key={user.id}
                    className="cursor-pointer px-2 py-1 hover:bg-purple-50"
                    onClick={() => handleSelect(user)}
                  >
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-gray-600"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={!selectedUser && !editingContact}>
              {t.common.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
