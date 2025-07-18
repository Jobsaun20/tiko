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

  useEffect(() => {
    setIsPaid(false);
  }, [fine, isOpen]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Número TWINT copiado al portapapeles",
    });
  };

  const markAsPaid = () => {
    setIsPaid(true);
    setTimeout(() => {
      onPayment();
      setIsPaid(false);
    }, 1500);
  };

  // --- NUEVO: Función para abrir la app de TWINT con el número ---
  const openTwintApp = () => {
    if (fine.sender_phone) {
      // El intento más compatible: abrir la app TWINT (Android/iOS)
      // Si no funciona, abrir la web genérica de Twint
      const twintUrl = `twint://sendmoney?phone=${fine.sender_phone.replace(/\D/g, "")}&amount=${fine.amount}`;
      // Intenta abrir el deep link de TWINT
      window.location.href = twintUrl;

      // Fallback opcional: después de 1s, abre la web oficial de Twint (el usuario debe copiar el número)
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
            Pagar Multa - {fine.amount} CHF
          </DialogTitle>
          <DialogDescription>
            Paga tu multa usando TWINT escaneando el código QR o usando el número
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Fine Details */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-800">Detalles de la multa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Motivo:</span>
                <span className="text-sm font-medium">{fine.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Emisor:</span>
                <span className="text-sm font-medium">{fine.sender_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monto:</span>
                <span className="text-lg font-bold text-red-600">{fine.amount} CHF</span>
              </div>
            </CardContent>
          </Card>

          {/* Opciones de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Opciones de pago TWINT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fine.sender_phone ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Número TWINT:</p>
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
                  {/* --- NUEVO: Botón Abrir TWINT --- */}
                  <Button
                    type="button"
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    onClick={openTwintApp}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir TWINT
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center text-orange-600 gap-2 py-2">
                  <span>No hay número TWINT disponible.</span>
                </div>
              )}
            </CardContent>
          </Card>

          {(isPaid || isAlreadyPaid) && (
            <div className="flex items-center justify-center py-4 text-green-600">
              <CheckCircle className="h-6 w-6 mr-2" />
              <span className="font-medium">¡Pago confirmado!</span>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={markAsPaid}
            disabled={isPaid || !fine.sender_phone || isAlreadyPaid}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            {isPaid ? "Procesando..." : isAlreadyPaid ? "Pagada" : "Marcar como Pagada"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
