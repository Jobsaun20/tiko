import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Fine } from "@/types/Fine";
import { ScrollText, Clock, Send } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";

interface FineCardProps {
  fine: Fine;
  onPay?: () => void;
  showPayButton?: boolean;
  userId?: string;
}

export const FineCard = ({
  fine,
  onPay,
  showPayButton = false,
  userId,
}: FineCardProps) => {
  const { t } = useLanguage();
  const { groups } = useGroups();

  // Grupo
  const group = groups?.find((g) => g.id === fine.group_id);
  const displayGroup = group?.name || "";

  // Datos visuales
  const isSent = userId && fine.sender_id === userId;
  const displayUser = isSent ? fine.recipient_name : fine.sender_name;
  const avatarInitial = displayUser?.charAt(0)?.toUpperCase() || "U";
  const avatarUrl = isSent ? fine.recipient_avatar_url : fine.sender_avatar_url;
  const reason = fine.reason;

  // Formato importe y fecha
  const amount = `${fine.amount?.toFixed(2)} ${t.common.currency}`;
  const date = fine.date;
  const dateLabel = t.fines.created;

  // Estado (Ausstehend/Pagada)
  const getStatusBadge = () => {
    if (fine.status === "pending") {
      return (
        <span className="flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-lg px-2 py-[1px] text-[11px] font-medium">
          <Clock className="w-3 h-3" />
          {t.fines.pending}
        </span>
      );
    }
    if (fine.status === "paid") {
      return (
        <span className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-100 rounded-lg px-2 py-[2px] text-xs font-medium">
          <Clock className="w-4 h-4" />
          {t.fines.paid}
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg px-2 py-[2px] text-xs font-medium">
        <Clock className="w-4 h-4" />
        {fine.status}
      </span>
    );
  };

  // Enviada / Recibida en gris debajo del precio
  const getTypeBadge = () => {
    if (!userId) return null;
    if (fine.sender_id === userId)
      return (
        <span className="bg-gray-100 text-gray-600 px-2 py-[2px] text-xs rounded-full font-semibold mt-1 inline-block">
          {t.fines.sent}
        </span>
      );
    if (fine.recipient_id === userId)
      return (
        <span className="bg-gray-100 text-gray-600 px-2 py-[2px] text-xs rounded-full font-semibold mt-1 inline-block">
          {t.fines.received}
        </span>
      );
    return null;
  };

  return (
    <Card className="w-full max-w-[320px] mx-auto rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow border border-gray-100">
  <CardContent className="flex gap-3 px-4 py-3">
    {/* ICONO MULTA */}
    <div className="flex flex-col items-center pt-1">
      <span
        className={
          `inline-flex items-center justify-center rounded-xl w-11 h-11 mt-1 ` +
          (isSent ? "bg-blue-50" : "bg-pink-50")
        }
      >
        {isSent ? (
          <Send className="w-7 h-7" style={{ color: "#52AEB9" }} />
        ) : (
          <ScrollText className="w-7 h-7 text-red-400" />
        )}
      </span>
    </div>

    {/* INFO PRINCIPAL */}
    <div className="flex-1 min-w-0 flex flex-col">
      {/* TEXTO PRINCIPAL ARRIBA (máx 4 líneas) */}
      <span
        className="text-[15px] sm:text-base font-semibold text-gray-800 mb-2 break-words line-clamp-4 leading-snug"
        style={{ display: "block", maxWidth: "100%" }}
        title={reason}
      >
        {reason}       
      </span>
      <div className="mt-1">
        {getTypeBadge()}
      </div>
      

      {/* BLOQUE PENALTY DEBAJO DEL TEXTO */}
    <div className="flex flex-col items-end w-full">
  <div
    className="flex flex-wrap items-baseline gap-1 justify-end w-full break-words max-w-full"
    style={{ wordBreak: "break-word" }}
  >
    <span className="text-xs text-gray-500 font-semibold">{t.groupRulesModal.amountLabel}:</span>
    <span
      className="text-3xl font-extrabold text-purple-700 leading-none ml-2"
      style={{ wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "normal" }}
    >
      {/* Número y € juntos, sin espacio */}
      {fine.amount + "€"}
    </span>
  </div>
</div>



      {/* INFO: usuario, grupo, estado, fecha, badge y botón */}
      <div className="flex flex-row items-center justify-between w-full mt-2">
        {/* IZQUIERDA: avatar, nombre, grupo, estado, fecha */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Avatar className="h-7 w-7 text-xs">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={displayUser} />}
              <AvatarFallback className="bg-[#52AEB9] text-white font-semibold">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-gray-700">{displayUser}</span>
            {displayGroup && (
              <>
                <span className="mx-1 text-xs text-gray-400 font-normal">·</span>
                <span className="text-xs text-gray-400 font-normal">{displayGroup}</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-start">
            {getStatusBadge()}
            <span className="text-[11px] text-gray-400 mt-0.5">
              {dateLabel}: {date && new Date(date).toLocaleDateString()}
            </span>
            
          </div>
        </div>
        {/* BOTÓN PAGAR */}
        {showPayButton && fine.status === "pending" && (
          <Button
            onClick={onPay}
            size="sm"
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow ml-2"
          >
            {t.fines.pay}
          </Button>
        )}
      </div>
    </div>
  </CardContent>
</Card>


  );
};
