import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/supabaseClient";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (userData: any) => void;
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  user,
  onSave
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    email: user?.email || "user@example.com",
    phone: user?.phone || "+41 76 123 45 67"
  });

  // Usar avatar_url, forzar recarga con timestamp
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Mostrar selector archivo
  const handlePhotoUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Subir a storage y obtener url pública
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user?.id) {
      toast({ title: "No se pudo identificar usuario", variant: "destructive" });
      return;
    }
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    // Agrega timestamp para romper caché y sobreescribir anterior
    const timestamp = Date.now();
    const filePath = `users/${user.id}/avatar_${timestamp}.${fileExt}`;

    // Subir al bucket avatars
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Error subiendo avatar", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    // Obtener URL pública
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    // Añade un query param para forzar recarga de imagen (cache bust)
    setAvatarUrl(publicUrl + "?r=" + timestamp);

    setUploading(false);
    toast({ title: "Foto subida correctamente. ¡No olvides guardar!" });
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
      avatar_url: avatarUrl,
    };
    onSave(updatedUser);
    toast({
      title: "✅ Perfil actualizado",
      description: "Tus cambios han sido guardados correctamente.",
    });
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      email: user?.email || "user@example.com",
      phone: user?.phone || "+41 76 123 45 67"
    });
    setAvatarUrl(user?.avatar_url || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Editar Perfil
          </DialogTitle>
          <DialogDescription>
            Actualiza tu información personal y foto de perfil
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={user?.username || "Usuario"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                {(user?.username?.charAt(0) || "U").toUpperCase()}
              </AvatarFallback>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                  <Upload className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              )}
            </Avatar>
            <Button variant="outline" size="sm" onClick={handlePhotoUpload} disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Subiendo..." : "Cambiar Foto"}
            </Button>
            {/* input oculto */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              disabled={uploading}
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                value={user?.username || ""}
                disabled
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+41 76 123 45 67"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
