import { useState, useEffect } from "react";
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
import { UserPlus, Trash2 } from "lucide-react";

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
  const [avatarUrl, setAvatarUrl] = useState(group?.avatar || "");
  const [tab, setTab] = useState("general");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(group?.name || "");
    setDescription(group?.description || "");
    setAvatarUrl(group?.avatar || "");
  }, [group]);

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      ...group,
      name,
      description,
      avatar: avatarUrl,
    });
    setSaving(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
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
            <Avatar className="h-16 w-16 mb-2">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gray-200 text-gray-700 font-bold text-2xl">
                {name?.slice(0, 2).toUpperCase() || "GR"}
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="block w-full max-w-xs mx-auto text-sm file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            <div className="text-xs text-gray-400 text-center mt-2">
              (Función demo: implementa subida a Supabase Storage si quieres guardar la imagen)
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
