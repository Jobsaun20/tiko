import { useState, useRef, useEffect } from "react";
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
  // INCLUYE USERNAME SIEMPRE EN EL FORM DATA
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "user@example.com",
    phone: user?.phone || "+41 76 123 45 67"
  });

  // Actualiza formData si cambian los datos del usuario
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "user@example.com",
      phone: user?.phone || "+41 76 123 45 67"
    });
  }, [user]);

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
    const timestamp = Date.now();
    const filePath = `users/${user.id}/avatar_${timestamp}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Error subiendo avatar", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    setAvatarUrl(publicUrl + "?r=" + timestamp);

    setUploading(false);
    toast({ title: "Foto subida correctamente. ¡No olvides guardar!" });
  };

  const handleSave = () => {
    // Siempre mandamos username
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
      username: user?.username || "",
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
              <AvatarImage src={avatarUrl} alt={formData.username || "Usuario"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                {(formData.username?.charAt(0) || "U").toUpperCase()}
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
                value={formData.username}
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
