import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export interface EditGroupModalProps {
  isOpen: boolean;
  group: any;
  onClose: () => void;
  onSave: (updated: any) => void;
  onAddMember: (groupId: string) => void;
  onRemoveMember: (groupId: string, userId: string) => void;
  isAdmin?: boolean;
  currentUserId?: string;
}

export function EditGroupModal({
  isOpen,
  group,
  onClose,
  onSave,
  onAddMember,
  onRemoveMember,
  isAdmin = false,
  currentUserId,
}: EditGroupModalProps) {
  const [name, setName] = useState(group?.name || "");
  const [description, setDescription] = useState(group?.description || "");
  const [avatarUrl, setAvatarUrl] = useState(group?.avatar_url || group?.avatar || "");
  const [tab, setTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setName(group?.name || "");
    setDescription(group?.description || "");
    setAvatarUrl(group?.avatar_url || group?.avatar || "");
  }, [group]);

  // Subida de imagen solo si eres admin
  const handleAvatarUpload = () => {
    if (isAdmin && fileInputRef.current) fileInputRef.current.click();
  };

  // Subida de imagen a Supabase
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !group?.id) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const filePath = `groups/${group.id}/avatar_${Date.now()}.${fileExt}`;

    // Subir al bucket avatars
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "Error subiendo imagen", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    // Obtener la URL pública
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);

    setUploading(false);
    toast({ title: "Imagen subida correctamente. ¡No olvides guardar!" });
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      ...group,
      name,
      description,
      avatar: avatarUrl,  // Usa avatar_url como estándar en tu base de datos
    });
    setSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw]">
        <DialogHeader>
          <DialogTitle>Editar grupo</DialogTitle>
          <DialogDescription>
            Gestiona la información y miembros de tu grupo.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="avatar">Imagen</TabsTrigger>
            <TabsTrigger value="members" disabled={!isAdmin}>
              Miembros
            </TabsTrigger>
          </TabsList>

          {/* GENERAL */}
          <TabsContent value="general" className="space-y-4 px-2">
            <label className="block font-semibold text-sm">Nombre del grupo</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
            <label className="block font-semibold text-sm">Descripción</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} />
          </TabsContent>

          {/* AVATAR (Imagen) */}
          <TabsContent value="avatar" className="flex flex-col items-center gap-4 px-2 py-4">
            <label className="block font-semibold text-sm w-full text-center">Imagen del grupo</label>
            <Avatar
              className={`h-16 w-16 mb-2 ${isAdmin ? "cursor-pointer hover:ring-2 ring-blue-400 transition-all" : ""}`}
              onClick={handleAvatarUpload}
              title={isAdmin ? "Haz clic para cambiar la imagen" : ""}
            >
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gray-200 text-gray-700 font-bold text-2xl">
                {name?.slice(0, 2).toUpperCase() || "GR"}
              </AvatarFallback>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                  <Upload className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              )}
            </Avatar>
            {/* Input oculto solo para admin */}
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarUpload}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Subiendo..." : "Cambiar imagen"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploading}
                />
              </>
            )}
            <div className="text-xs text-gray-400 text-center mt-2">
              {isAdmin
                ? "(Solo el admin puede cambiar la imagen. Haz clic o usa el botón para subir una nueva foto.)"
                : "Solo el admin puede cambiar la imagen del grupo."}
            </div>
          </TabsContent>

          {/* MIEMBROS */}
          <TabsContent value="members" className="space-y-4 px-2">
            <div className="flex flex-col gap-2">
              <span className="font-semibold mb-2">Agregar miembro</span>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => onAddMember(group.id)}
              >
                <UserPlus className="h-4 w-4" />
                Agregar miembro
              </Button>
            </div>
            <div className="mt-4">
              <span className="font-semibold">Miembros actuales:</span>
              <ul className="mt-2 space-y-1">
                {group?.members?.map((m: any) => (
                  <li key={m.id} className="flex items-center gap-2 text-sm">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={m.avatar} />
                      <AvatarFallback>{m.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{m.name}</span>
                    {m.role === "admin" && (
                      <span className="ml-2 text-amber-600 font-bold text-xs">Admin</span>
                    )}
                    {isAdmin && m.id !== currentUserId && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-2 text-red-500"
                        title="Eliminar del grupo"
                        onClick={() => onRemoveMember(group.id, m.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSave}
            disabled={saving || (!name.trim())}
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditGroupModal;
