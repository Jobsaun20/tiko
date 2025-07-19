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
import { useLanguage } from "@/contexts/LanguageContext"; // <--- usa tu contexto de idioma

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
  const { t } = useLanguage(); // <--- obtiene el objeto de idioma actual

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-green-500" />
            {t.paymentModal.title} - {fine.amount} CHF
          </DialogTitle>
          <DialogDescription>
            {t.paymentModal.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Fine Details */}
          <Card className="bg-red-50 border-red-200">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
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
                      onClick={() => copyToClipboard(fine.sender_phone!)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {/* <Button
                    type="button"
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
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
            <div className="flex items-center justify-center py-4 text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span className="font-medium">{t.paymentModal.paid}</span>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            {t.paymentModal.close}
          </Button>
          <Button
            onClick={markAsPaid}
            disabled={isPaid || !fine.sender_phone || isAlreadyPaid}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            {isPaid
              ? t.paymentModal.processing
              : isAlreadyPaid
                ? t.paymentModal.paid
                : t.paymentModal.markAsPaid}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
