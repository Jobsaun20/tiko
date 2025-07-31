import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Smartphone, Copy, CheckCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Fine } from "@/types/Fine";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fine: Fine;
  onPayment: () => void;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  fine,
  onPayment,
}: PaymentModalProps) => {
  const [isPaid, setIsPaid] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    setIsPaid(false);
  }, [fine, isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t.paymentModal.copied,
      description: t.paymentModal.copyNumber,
    });
  };

  const markAsPaid = () => {
    setIsPaid(true);
    setTimeout(() => {
      onPayment();
      setIsPaid(false);
    }, 1500);
  };

  const openTwintApp = () => {
    if (fine.sender_phone) {
      const twintUrl = `twint://sendmoney?phone=${fine.sender_phone.replace(/\D/g, "")}&amount=${fine.amount}`;
      window.location.href = twintUrl;
      setTimeout(() => {
        window.open("https://www.twint.ch/en/", "_blank");
      }, 1000);
    }
  };

  const isAlreadyPaid = fine.status === "paid";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[320px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" style={{ color: "#52AEB9" }} />
            {t.paymentModal.title} - {fine.amount} CHF
          </DialogTitle>
          <DialogDescription>
            {t.paymentModal.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Fine Details */}
          <Card className="max-w-[320px] shadow-lg rounded-2xl bg-red-50 border-red-200 mx-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-800">{t.paymentModal.fine}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.paymentModal.reason}:</span>
                <span className="text-sm font-medium">{fine.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.paymentModal.sender}:</span>
                <span className="text-sm font-medium">{fine.sender_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t.paymentModal.amount}:</span>
                <span className="text-lg font-bold text-red-600">{fine.amount} CHF</span>
              </div>
            </CardContent>
          </Card>

          {/* Opciones de pago */}
          <Card className="max-w-[320px] shadow-lg rounded-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4" style={{ color: "#52AEB9" }} />
                {t.paymentModal.scanQR}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fine.sender_phone ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">{t.paymentModal.useNumber}</p>
                  <div className="flex items-center justify-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm">{fine.sender_phone}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-[#52AEB9] text-[#52AEB9] hover:bg-[#e5f8fa]"
                      onClick={() => copyToClipboard(fine.sender_phone!)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {/* <Button
                    type="button"
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#52AEB9] to-[#52AEB9] text-white rounded-full"
                    onClick={openTwintApp}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t.paymentModal.scanQR}
                  </Button> */}
                </div>
              ) : (
                <div className="flex items-center justify-center text-orange-600 gap-2 py-2">
                  <span>{t.paymentModal.noTwintNumber ?? "No hay número TWINT disponible."}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {(isPaid || isAlreadyPaid) && (
            <div className="flex items-center justify-center py-4 text-[#52AEB9]">
              <CheckCircle className="h-6 w-6 mr-2" style={{ color: "#52AEB9" }} />
              <span className="font-medium">{t.paymentModal.paid}</span>
            </div>
          )}
        </div>

<DialogFooter className="pt-4 flex flex-col gap-3">
          
          <Button 
            onClick={markAsPaid}
            disabled={isPaid || !fine.sender_phone || isAlreadyPaid}
            className={ `rounded-full bg-[#52AEB9] hover:bg-[#4cb0be] text-white font-bold transition-colors`}
          >
            {isPaid
              ? t.paymentModal.processing
              : isAlreadyPaid
                ? t.paymentModal.paid
                : t.paymentModal.markAsPaid}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-full border-[#52AEB9] text-[#52AEB9] hover:bg-[#e5f8fa]"
          >
            {t.paymentModal.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
