import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";




// Sugerencias de usuario para autocompletar
interface UserSuggestion {
  id: string;
  username: string;
  email: string;
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactData: any) => void;
  editingContact?: any; // Opcional, para edición
}

export const AddContactModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingContact = null,
}: AddContactModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

    

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
        email: editingContact.email,
      });
    } else {
      setQuery("");
      setSelectedUser(null);
    }
  }, [editingContact, isOpen]);

  // Busca usuarios en Supabase por username o email
  const searchUsers = async (q: string) => {
    setLoading(true);
    const { data, error } = await supabase
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
    setQuery(`${user.username} (${user.email})`);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast({
        title: t.common.error,
        description: "Debes seleccionar un usuario existente.",
        variant: "destructive",
      });
      return;
    }
    onSubmit({
      user_id: selectedUser.id,
      name: selectedUser.username,
      email: selectedUser.email,
    });
    setQuery("");
    setSelectedUser(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingContact ? t.pages.contacts.editContact : t.pages.contacts.addContact}</DialogTitle>
          <DialogDescription>
            Busca por nombre de usuario o email y selecciona un usuario real
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 relative">
            <Input
              id="search"
              value={query}
              onChange={handleInputChange}
              placeholder="Nombre de usuario o email"
              autoComplete="off"
              disabled={!!editingContact}
            />
            {loading && <div className="text-xs text-gray-400 pl-1">Buscando...</div>}
            {!selectedUser && suggestions.length > 0 && (
              <div className="bg-white border rounded-md shadow p-1 max-h-48 overflow-y-auto z-50 absolute w-full">
                {suggestions.map((user) => (
                  <div
                    key={user.id}
                    className="cursor-pointer px-2 py-1 hover:bg-purple-50"
                    onClick={() => handleSelect(user)}
                  >
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-gray-600">{user.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
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
