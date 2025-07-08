
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
import { Users, Upload, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: any) => void;
}

export const CreateGroupModal = ({ isOpen, onClose, onSubmit }: CreateGroupModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    paymentMode: "direct",
    twintQR: ""
  });

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

    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      paymentMode: "direct",
      twintQR: ""
    });
    
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
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Crear Nuevo Grupo
          </DialogTitle>
          <DialogDescription>
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
