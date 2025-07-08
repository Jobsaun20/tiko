import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Fine } from "@/types/Fine";

interface FineCardProps {
  fine: Fine;
  onPay?: () => void;
  showPayButton?: boolean;
  userId?: string; // ID del usuario actual para lógica contextual
}

export const FineCard = ({
  fine,
  onPay,
  showPayButton = false,
  userId,
}: FineCardProps) => {
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = () => {
    if (userId) {
      if (fine.sender_id === userId) return "border-l-blue-500";
      if (fine.recipient_id === userId) return "border-l-purple-500";
    }
    return "border-l-gray-500";
  };

  // Lógica de nombre a mostrar: "Para X" si tú eres el que envía, "De X" si eres el que recibe
  const isSent = userId && fine.sender_id === userId;
  const displayUser = isSent
    ? `${t.fines.to} ${fine.recipient_name}`
    : `${t.fines.from} ${fine.sender_name}`;

  // Inicial del nombre para el avatar
  const avatarInitial = isSent
    ? fine.recipient_name?.charAt(0)?.toUpperCase() || "U"
    : fine.sender_name?.charAt(0)?.toUpperCase() || "U";

  // Mostrar teléfono solo si eres receptor y existe sender_phone
  const showSenderPhone = !isSent && !!fine.sender_phone;

  return (
    <Card className={`border-l-4 ${getTypeColor()} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-800 truncate">
                  {displayUser}
                </h4>
                <Badge variant="secondary" className={getStatusColor(fine.status)}>
                  {fine.status === "paid" ? t.fines.paid : t.fines.pending}
                </Badge>
              </div>
              {/* Teléfono del emisor SOLO si eres el receptor y existe */}
              {/* {showSenderPhone && (
                <div className="flex items-center gap-1 mb-1 text-xs text-gray-700">
                  <span className="font-semibold">{t.fines.phone}:</span>
                  <span>{fine.sender_phone}</span>
                </div>
              )} */}
              <p className="text-gray-600 text-sm mb-2">{fine.reason}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{formatDate(fine.date)}</span>
                <span className="font-bold text-lg text-purple-700">
                  {fine.amount} {t.common.currency}
                </span>
              </div>
            </div>
          </div>
          {showPayButton && (
            <Button
              onClick={onPay}
              size="sm"
              className="ml-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              {t.fines.pay}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
