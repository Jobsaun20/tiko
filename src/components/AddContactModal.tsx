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
import { BookUser } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext"; // Ya deberías tenerlo


interface UserSuggestion {
  id: string;
  username: string;
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactData: any) => void;
  editingContact?: any;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingContact = null,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { sendContactRequest } = useSendContactRequest();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (editingContact) {
      setQuery(editingContact.username || "");
      setSelectedUser({
        id: editingContact.user_id || editingContact.id,
        username: editingContact.username,
      });
    } else {
      setQuery("");
      setSelectedUser(null);
    }
  }, [editingContact, isOpen]);

  const searchUsers = async (q: string) => {
    setLoading(true);
     if (!user?.id) return;

    const { data } = await supabase
      .from("users")
      .select("id,username,email")
      .or(`username.ilike.%${q}%,email.ilike.%${q}%`)
      .neq("id", user.id) // <-- FILTRA TU PROPIO USUARIO
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

    if (editingContact) {
      onSubmit({
        user_id: selectedUser.id,
        name: selectedUser.username,
      });
      setQuery("");
      setSelectedUser(null);
      onClose();
      return;
    }

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
      <DialogContent className="w-full max-w-[320px] shadow-lg rounded-2xl px-4 py-6 max-h-[90vh] overflow-y-auto !min-h-0">
        <DialogHeader>
                 
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl text-black">
            <BookUser className="h-5 w-5 text-[#52AEB9]" />   
            {editingContact
              ? t.pages.contacts.editContact
              : t.pages.contacts.addContact}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {t.modal.searchContactToAdd}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 relative">
            <Input
              id="search"
              value={query}
              onChange={handleInputChange}
              placeholder={t.modal.searchNameOrEmail}
              autoComplete="off"
              disabled={!!editingContact}
              className="rounded-2xl"
            />
            {loading && (
              <div className="text-xs text-gray-400 pl-1">
                {t.modal.searching}
              </div>
            )}
            {!selectedUser && suggestions.length > 0 && (
              <div className="bg-white border rounded-2xl shadow p-1 max-h-48 overflow-y-auto z-50 absolute w-full">
                {suggestions.map((user) => (
                  <div
                    key={user.id}
                    className="cursor-pointer px-2 py-1 rounded-lg hover:bg-[#e5f8fa] transition"
                    onClick={() => handleSelect(user)}
                  >
                    <div className="font-medium text-black]">{user.username}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-3 pt-4">
            
            <Button
              type="submit"
              disabled={!selectedUser && !editingContact}
              className="rounded-full bg-[#52AEB9] hover:bg-[#42a0b0] text-white font-bold w-full transition-colors"
            >
              {t.invite.sendAskToContact}
            </Button>

            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="rounded-full border-[#52AEB9] text-[#52AEB9] w-full hover:bg-[#e5f8fa] transition"
            >
              {t.common.cancel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
