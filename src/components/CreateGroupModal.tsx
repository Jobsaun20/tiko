import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Upload, QrCode, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContacts } from "@/hooks/useContacts"; // <-- Asegúrate de tener el hook de contactos

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: any) => void;
}

export const CreateGroupModal = ({ isOpen, onClose, onSubmit }: CreateGroupModalProps) => {
  const { toast } = useToast();
  const { contacts = [] } = useContacts(); // <-- Toma los contactos del usuario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    paymentMode: "direct",
    twintQR: ""
  });

  // --- CONTACTOS SELECCIONADOS Y BUSCADOR ---
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);

  // Filtra contactos según búsqueda y que no estén ya seleccionados
  const filteredContacts = contacts.filter(
    (c) =>
      (c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())) &&
      !selectedContacts.find((sc) => sc.id === c.id)
  );

  const handleAddContact = (contact: any) => {
    setSelectedContacts([...selectedContacts, contact]);
    setSearch("");
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter((c) => c.id !== contactId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del grupo es obligatorio",
        variant: "destructive"
      });
      return;
    }

    if (formData.paymentMode === "admin" && !formData.twintQR.trim()) {
      toast({
        title: "Error", 
        description: "Debes proporcionar el QR TWINT del grupo para el modo 'Pago al Admin'",
        variant: "destructive"
      });
      return;
    }

    // ENVÍA también los IDs/emails de los contactos seleccionados
    onSubmit({ ...formData, members: selectedContacts });
    setFormData({
      name: "",
      description: "",
      paymentMode: "direct",
      twintQR: ""
    });
    setSelectedContacts([]);

    toast({
      title: "¡Grupo creado!",
      description: `El grupo "${formData.name}" ha sido creado exitosamente`
    });
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      paymentMode: "direct",
      twintQR: ""
    });
    setSelectedContacts([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" w-full max-w-[95vw] sm:max-w-[500px] px-2 sm:px-8 py-4 rounded-lg max-h-[90vh] overflow-y-auto !min-h-0">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Users className="h-5 w-5" />
          Crear Nuevo Grupo
        </DialogTitle>
        <DialogDescription className="text-xs sm:text-sm">
          Configura tu grupo para gestionar multas sociales entre miembros
        </DialogDescription>
      </DialogHeader> 
      
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                {formData.name.charAt(0).toUpperCase() || 'G'}
              </AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Subir Avatar
            </Button>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Grupo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Compañeros de Piso"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe brevemente el propósito del grupo"
                rows={3}
              />
            </div>
          </div>

          {/* --- Nuevo Selector de Miembros --- */}          
          <div className="space-y-2">
            <Label>Miembros del grupo</Label>
            <Input
              placeholder="Buscar contacto por nombre o email"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="mb-2"
            />
            {search.trim() && filteredContacts.length > 0 && (
              <div className="max-h-32 overflow-auto border rounded p-2 bg-white shadow">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 cursor-pointer rounded"
                    onClick={() => handleAddContact(contact)}
                  >
                    <span>{contact.name || contact.email}</span>
                    <span className="text-xs text-gray-400">{contact.email}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Chips de seleccionados */}
            {selectedContacts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedContacts.map((contact) => (
                  <span
                    key={contact.id}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                  >
                    {contact.name || contact.email}
                    <button
                      type="button"
                      className="ml-1"
                      onClick={() => handleRemoveContact(contact.id)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Payment Mode */}
          <div className="space-y-4">
            <Label>Modo de Pago</Label>
            <RadioGroup
              value={formData.paymentMode}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMode: value }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="direct" id="direct" />
                <Label htmlFor="direct">Pago Directo</Label>
                <p className="text-sm text-gray-600 ml-2">
                  Cada miembro paga directamente al emisor de la multa
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Pago al Administrador</Label>
                <p className="text-sm text-gray-600 ml-2">
                  Todos los pagos se centralizan en el administrador del grupo
                </p>
              </div>
            </RadioGroup>
          </div>

          {/* TWINT QR (if admin mode) */}
          {formData.paymentMode === "admin" && (
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-blue-600" />
                <Label>Configuración TWINT del Grupo</Label>
              </div>
              <div className="text-center p-4 border-2 border-dashed border-blue-300 rounded-lg">
                <QrCode className="h-12 w-12 mx-auto text-blue-400 mb-2" />
                <p className="text-sm text-blue-700 mb-2">
                  Sube el código QR TWINT del grupo
                </p>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir QR TWINT
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="twintQR">O ingresa el enlace TWINT</Label>
                <Input
                  id="twintQR"
                  value={formData.twintQR}
                  onChange={(e) => setFormData(prev => ({ ...prev, twintQR: e.target.value }))}
                  placeholder="twint://pay?amount=..."
                />
              </div>
              <p className="text-xs text-blue-600">
                Al activar este modo, todas las multas del grupo mostrarán este QR para el pago
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Crear Grupo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
