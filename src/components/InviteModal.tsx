
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
import { Copy, Share2, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal = ({ isOpen, onClose }: InviteModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
  const inviteLink = "https://Pic.app/invite/abc123";
  const shareText = t.invite.shareText;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: t.invite.linkCopied,
      description: "El enlace ha sido copiado al portapapeles"
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Únete a DESWG',
          text: shareText,
          url: inviteLink
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSendEmail = () => {
    if (!email) {
      toast({
        title: t.common.error,
        description: "Por favor ingresa un email",
        variant: "destructive"
      });
      return;
    }

    // Simulate sending email
    toast({
      title: t.common.success,
      description: `Invitación enviada a ${email}`
    });
    
    setEmail("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.invite.title}</DialogTitle>
          <DialogDescription>
            {t.invite.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Share Link */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enlace de invitación</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="bg-gray-50"
                />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleShare} variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                {t.common.share}
              </Button>
              <Button onClick={handleCopyLink} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                {t.invite.copyLink}
              </Button>
            </div>
          </div>

          {/* Send by Email */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Enviar por email</Label>
              <Input
                id="email"
                type="email"
                placeholder="amigo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button onClick={handleSendEmail} className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              {t.invite.sendInvite}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t.common.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
