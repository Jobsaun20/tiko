import React, { useState, useEffect, useRef } from "react";
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
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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

  const handleAvatarUpload = () => {
    if (isAdmin && fileInputRef.current) fileInputRef.current.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !group?.id) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `groups/${group.id}/avatar_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({
        title: t.common.error,
        description: uploadError.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(data.publicUrl);

    setUploading(false);
    toast({ title: t.modal.uploadSuccess || "Imagen subida correctamente. ¡No olvides guardar!" });
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[320px] w-full shadow-lg rounded-2xl px-4 py-6">
        <DialogHeader>
          <DialogTitle className="text-[#52AEB9]">{t.modal.editGroup}</DialogTitle>
          <DialogDescription>
            {t.modal.editGroupDescription}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-3 mb-5 rounded-2xl overflow-hidden border border-gray-200">
            <TabsTrigger value="general" className="rounded-none">{t.modal.generalTab}</TabsTrigger>
            <TabsTrigger value="avatar" className="rounded-none">{t.modal.avatarTab}</TabsTrigger>
            <TabsTrigger value="members" className="rounded-none" disabled={!isAdmin}>
              {t.modal.membersTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 px-1">
            <label className="block font-semibold text-sm">
              {t.modal.groupName}
            </label>
            <Input value={name} onChange={e => setName(e.target.value)} className="rounded-2xl" />
            <label className="block font-semibold text-sm">
              {t.modal.description}
            </label>
            <Input value={description} onChange={e => setDescription(e.target.value)} className="rounded-2xl" />
          </TabsContent>

          <TabsContent
            value="avatar"
            className="flex flex-col items-center gap-4 px-2 py-4"
          >
            <label className="block font-semibold text-sm w-full text-center">
              {t.modal.avatarLabel}
            </label>
            <Avatar
              className={`h-16 w-16 mb-2 shadow ${isAdmin ? "cursor-pointer hover:ring-2 ring-[#52AEB9] transition-all" : ""}`}
              onClick={handleAvatarUpload}
              title={isAdmin ? t.modal.changeAvatarTitle : ""}
            >
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-2xl">
                {name?.slice(0, 2).toUpperCase() || "GR"}
              </AvatarFallback>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                  <Upload className="w-8 h-8 text-[#52AEB9] animate-spin" />
                </div>
              )}
            </Avatar>
            {isAdmin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarUpload}
                  disabled={uploading}
                  className="rounded-full border-[#52AEB9] text-[#52AEB9] font-semibold hover:bg-[#e5f8fa] transition"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? t.modal.uploading : t.modal.changeAvatar}
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
                ? t.modal.avatarHelpAdmin
                : t.modal.avatarHelpUser}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4 px-2">
            <div className="flex flex-col gap-2">
              <span className="font-semibold mb-2">
                {t.modal.addMember}
              </span>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-[#52AEB9] text-[#52AEB9] font-semibold hover:bg-[#e5f8fa] transition"
                onClick={() => onAddMember(group.id)}
              >
                <UserPlus className="h-4 w-4" />
                {t.modal.addMember}
              </Button>
            </div>
            <div className="mt-4">
              <span className="font-semibold">
                {t.modal.currentMembers}
              </span>
              <ul className="mt-2 space-y-1">
                {group?.members?.map((m: any) => (
                  <li key={m.id} className="flex items-center gap-2 text-sm py-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={m.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold">
                        {m.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{m.name}</span>
                    {m.role === "admin" && (
                      <span className="ml-2 text-amber-600 font-bold text-xs">
                        {t.modal.adminLabel}
                      </span>
                    )}
                    {isAdmin && m.id !== currentUserId && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-2 text-[#52AEB9] hover:bg-[#e5f8fa] rounded-full"
                        title={t.modal.removeMemberTitle}
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

        <DialogFooter className="flex flex-col gap-3 pt-4">
        
          <Button
            onClick={handleSave}
            disabled={saving || (!name.trim())}
            className="w-full py-2 font-bold rounded-full bg-[#52AEB9] hover:bg-[#42a0b0] text-white shadow transition"
          >
            {t.modal.saveChanges}
          </Button>

            <Button
            variant="outline"
            onClick={onClose}
            className="w-full py-2 rounded-full border-[#52AEB9] text-[#52AEB9] font-semibold hover:bg-[#e5f8fa] transition"
          >
            {t.modal.cancel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditGroupModal;
