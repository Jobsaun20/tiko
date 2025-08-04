
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Download, Share2, ArrowLeft, Copy } from "lucide-react";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const mockUser = {
  id: "1",
  name: "Usuario Demo",
  email: "user@example.com",
  avatar: "/placeholder.svg",
  xp: 150,
  totalSent: 5,
  totalPaid: 3,
  fastPayments: 2,
  adminGroups: 1,
  totalContacts: 15,
  pendingFines: 1,
  totalReceived: 4,
  totalEarned: 75,
  badges: ['first-fine', 'early-payer']
};

export default function MyQR() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user] = useState(mockUser);
  
  const qrData = `Pic://user/${user.id}`;

  const handleDownload = () => {
    toast({
      title: t.common.success,
      description: "QR descargado correctamente"
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mi código QR de Tiko',
          text: 'Escanea este código para enviarme multas sociales',
          url: qrData
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(qrData);
      toast({
        title: t.invite.linkCopied,
        description: "Enlace copiado al portapapeles"
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrData);
    toast({
      title: t.invite.linkCopied,
      description: "Enlace copiado al portapapeles"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Header  />
      
      <div className="container mx-auto max-w-2xl px-4 py-6">
        {/* Back Button for mobile */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {t.pages.myQR.title}
          </h1>
          <p className="text-gray-600">{t.pages.myQR.description}</p>
        </div>

        {/* QR Code Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center">Mi Código QR</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 mb-6 max-w-sm mx-auto">
              <QrCode className="h-48 w-48 mx-auto text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t.pages.myQR.downloadQR}
                </Button>
                
                <Button 
                  onClick={handleShare}
                  variant="outline"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t.pages.myQR.shareQR}
                </Button>
              </div>
              
              <Button 
                onClick={handleCopyLink}
                variant="ghost"
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                {t.invite.copyLink}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Cómo usar tu código QR</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                <p>Comparte tu código QR con amigos y familiares</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                <p>Ellos pueden escanearlo para enviarte multas sociales</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                <p>Recibirás una notificación cuando te envíen una multa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
