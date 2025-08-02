import { useState } from "react";
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
import { Copy, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal = ({ isOpen, onClose }: InviteModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const inviteLink = "https://deswg.vercel.app/welcome";
  const shareText = t.invite.shareText;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: t.invite.linkCopied,
      description: t.invite.linkCopiedDescription
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.invite.shareTextShort,
          text: shareText,
          url: inviteLink
        });
      } catch (err) {
        // usuario canceló o error
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[320px] rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle>{t.invite.title}</DialogTitle>
          <DialogDescription>
            {t.invite.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>{t.invite.invitationLink}</Label>
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="bg-gray-50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="rounded-full"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleShare}
            variant="default"
            className="w-full rounded-full"
            style={{ background: "#52AEB9", color: "white" }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            {t.common.share}
          </Button>
        </div>
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};
