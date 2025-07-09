import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

// La interfaz ahora incluye el user_supabase_id (si es usuario registrado)
interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  user_supabase_id?: string | null; // Nuevo: solo estos pueden añadirse
}

interface AddGroupMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: string) => void;
  contacts: Contact[];
}

export function AddGroupMemberModal({
  isOpen,
  onClose,
  onSubmit,
  contacts
}: AddGroupMemberModalProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Solo contactos con user_supabase_id válido y búsqueda
  const filtered =
    search.trim().length === 0
      ? []
      : contacts.filter(
          (c) =>
            !!c.user_supabase_id && // Solo registrados
            (
              c.name.toLowerCase().includes(search.toLowerCase()) ||
              c.email.toLowerCase().includes(search.toLowerCase())
            )
        );

  const handleConfirm = () => {
    if (selectedId) {
      // Busca el contacto y usa su user_supabase_id
      const contact = contacts.find(c => c.id === selectedId);
      if (contact && contact.user_supabase_id) {
        onSubmit(contact.user_supabase_id); // Pasa el id de supabase real
        setSearch("");
        setSelectedId(null);
      }
    }
  };

  const handleClose = () => {
    setSearch("");
    setSelectedId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Agregar miembro al grupo
          </DialogTitle>
          <DialogDescription>
            Busca un contacto registrado y selecciónalo para añadirlo al grupo.
          </DialogDescription>
        </DialogHeader>
        <div className="my-3">
          <Input
            placeholder="Buscar contacto"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
        </div>
        {search.trim().length === 0 ? (
          <div className="text-gray-400 text-sm text-center p-4">Empieza a escribir para buscar un contacto registrado.</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-400 text-sm text-center p-4">No hay coincidencias.</div>
        ) : (
          <div className="max-h-60 overflow-y-auto divide-y">
            {filtered.map((contact) => (
              <button
                key={contact.id}
                className={`flex w-full items-center gap-3 px-2 py-2 hover:bg-purple-50 rounded transition text-left ${
                  selectedId === contact.id ? "bg-purple-100" : ""
                }`}
                type="button"
                onClick={() => setSelectedId(contact.id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                    {contact.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-xs text-gray-500">{contact.email}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        <DialogFooter className="mt-2 gap-2">
          <Button variant="outline" type="button" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={!selectedId}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            onClick={handleConfirm}
          >
            Añadir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
