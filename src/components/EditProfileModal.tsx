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
import { useLanguage } from "@/contexts/LanguageContext";

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
    username: user?.username || "",
    email: user?.email || "user@example.com",
    phone: user?.phone || "+41 76 123 45 67"
  });

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
  const { t } = useLanguage();
  const m = t.profile;
  const handlePhotoUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Subida de avatar
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
      toast({ title: "Error", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;
    setAvatarUrl(publicUrl + "?r=" + timestamp);

    setUploading(false);
    toast({ title: m.updated });
  };

  // Siempre manda todos los campos editables
  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...formData,
      avatar_url: avatarUrl || undefined, // Si no hay avatar, no lo manda
    };
    onSave(updatedUser);
    toast({
      title: "✅" + m.updated,
      description: m.updateDescription,
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
      <DialogContent className="max-w-[320px] rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {m.editProfile}
          </DialogTitle>
          <DialogDescription>
            {m.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Foto de perfil */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={formData.username || "Usuario"} />
              <AvatarFallback className="bg-gradient-to-r from-[#72bfc4] to-[#57b8c9] text-white text-2xl">
                {(formData.username?.charAt(0) || "U").toUpperCase()}
              </AvatarFallback>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                  <Upload className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              )}
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePhotoUpload}
              disabled={uploading}
              className="rounded-full px-6"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Subiendo..." : m.changePhoto}
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              disabled={uploading}
            />
          </div>

          {/* Campos del formulario */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{m.userName}</Label>
              <Input
                id="username"
                value={formData.username}
                disabled
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t.fines.phone}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+41 76 123 45 67"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="pt-6 flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-full px-6"
          >
            {t.createGroupModal.cancel}
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-full px-6"
            style={{ background: "#52AEB9", color: "white" }}
          >
            {t.profile.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
