// src/components/CreateGroupModal.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContacts } from "@/hooks/useContacts";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: any) => void;
}

export const CreateGroupModal = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateGroupModalProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const m = t.createGroupModal;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    paymentMode: "direct",
  });

  // ... lógica de búsqueda y selección de contactos ...

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: m.errorNoName,
        variant: "destructive",
      });
      return;
    }

    onSubmit({ ...formData, members: [] /* o los que vinieran */ });
    const savedName = formData.name;
    setFormData({
      name: "",
      description: "",
      paymentMode: "direct",
    });

    toast({
      title: m.toastSuccess,
      description: m.toastSuccessDesc.replace("{groupName}", savedName),
    });
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      paymentMode: "direct",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[320px] shadow-lg rounded-2xl px-4 py-6 max-h-[90vh] overflow-y-auto !min-h-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Users className="h-5 w-5 text-[#52AEB9]" />
            {m.createGroup}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {m.createGroupDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-to-r from-[#52AEB9] to-[#72bfc4] text-white text-xl">
                {formData.name.charAt(0).toUpperCase() || "G"}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full border-[#52AEB9] text-[#52AEB9] flex items-center gap-2 hover:bg-[#e5f8fa] transition"
            >
              <Upload className="h-4 w-4 mr-1 text-[#52AEB9]" />
              {m.uploadAvatar}
            </Button>
          </div>

          {/* Nombre */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {m.groupName} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder={m.groupNamePlaceholder}
                required
                className="rounded-2xl"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">
                {m.groupDescription}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder={m.groupDescriptionPlaceholder}
                rows={3}
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="rounded-full bg-[#52AEB9] hover:bg-[#42a0b0] text-white font-bold w-full transition-colors"
            >
              {m.createGroupButton}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-full border-[#52AEB9] text-[#52AEB9] w-full hover:bg-[#e5f8fa] transition"
            >
              {m.cancel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
