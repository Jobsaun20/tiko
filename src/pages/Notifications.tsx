import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowLeft, Check, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";

function renderNotificationText(template: string, data: Record<string, any>) {
  if (!template) return "";
  return template.replace(/{{(\w+)}}/g, (_, key) => data?.[key] ?? "");
}

export default function Notifications() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { unreadCount, notifications, loading, markAllAsRead, markAsRead, deleteAll } = useNotifications();

  // --- Plantillas traducidas (debe ir aquí dentro) ---
  const notificationTemplates: Record<string, { title: string; icon: string; message: string }> = {
    fine_received: {
      title: t.notifications.fine_received.title,
      icon: "💸",
      message: t.notifications.fine_received.message,
    },
    challenge_created: {
      title: t.notifications.challenge_created.title,
      icon: "🏆",
      message: t.notifications.challenge_created.message,
    },
    challenge_invited: {
      title: t.notifications.challenge_invited.title,
      icon: "🎯",
      message: t.notifications.challenge_invited.message,
    },
    payment_received: {
      title: t.notifications.payment_received.title,
      icon: "💰",
      message: t.notifications.payment_received.message,
    },
    group_invite: {
      title: t.notifications.group_invite.title,
      icon: "👥",
      message: t.notifications.group_invite.message,
    },
    group_rule_proposed: {
      title: t.notifications.group_rule_proposed.title,
      icon: "⏳",
      message: t.notifications.group_rule_proposed.message,
    },
    group_rule_deletion_proposed: {
      title: t.notifications.group_rule_deletion_proposed.title,
      icon: "❓",
      message: t.notifications.group_rule_deletion_proposed.message,
    },
    group_rule_deleted: {
      title: t.notifications.group_rule_deleted.title,
      icon: "🗑️",
      message: t.notifications.group_rule_deleted.message,
    },

    // NUEVAS: Solicitudes y aceptación de contactos
    contact_request_sent: {
      title: t.notifications.contact_request_sent?.title || "Solicitud enviada",
      icon: "🤝",
      message: t.notifications.contact_request_sent?.message || "Has enviado una solicitud de contacto a {{name}}.",
    },
    contact_request_received: {
      title: t.notifications.contact_request_received?.title || "Solicitud recibida",
      icon: "🤝",
      message: t.notifications.contact_request_received?.message || "{{name}} te ha enviado una solicitud de contacto.",
    },
    contact_request_accepted: {
      title: t.notifications.contact_request_accepted?.title || "Solicitud aceptada",
      icon: "✅",
      message: t.notifications.contact_request_accepted?.message || "{{name}} ha aceptado tu solicitud de contacto.",
    },
    contact_request_was_accepted: {
      title: t.notifications.contact_request_was_accepted?.title || "Solicitud aceptada",
      icon: "✅",
      message: t.notifications.contact_request_was_accepted?.message || "Has aceptado la solicitud de contacto de {{name}}.",
    },
  };

  // Elimina el badge visual de notificaciones al montar
  useEffect(() => {
    if ("clearAppBadge" in navigator) navigator.clearAppBadge();
  }, []);

  // Formatea la fecha relativa
  const formatTime = (ts: string) => {
    const date = new Date(ts),
      diffMs = Date.now() - date.getTime(),
      diffH = Math.floor(diffMs / 3_600_000),
      diffD = Math.floor(diffH / 24);
    if (diffH < 1) return t.notifications.lessThanOneHour || "Hace menos de 1 hora";
    if (diffH < 24) return (t.notifications.hoursAgo || "Hace {{hours}} horas").replace("{{hours}}", diffH.toString());
    return (t.notifications.daysAgo || "Hace {{days}} días").replace("{{days}}", diffD.toString());
  };

  // --- Eliminar duplicados por mensaje, muestra solo la última ---
  const visibleNotifications = useMemo(() => {
    // Solo notificaciones reconocidas
    const filtered = notifications.filter((n) => !!notificationTemplates[n.type]);
    // Elimina duplicados: por mensaje + data (o solo id si no hay data)
    const seen = new Set();
    const deduped = [];
    for (let i = filtered.length - 1; i >= 0; i--) {
      const n = filtered[i];
      const tpl = notificationTemplates[n.type];
      const key =
        tpl.message && n.data
          ? tpl.title + "|" + renderNotificationText(tpl.message, n.data)
          : n.id;
      if (!seen.has(key)) {
        deduped.unshift(n);
        seen.add(key);
      }
    }
    return deduped;
  }, [notifications, t]); // Ojo, depende de t también (por si cambias idioma)

  // Cálculo para el badge solo con no leídas y no duplicadas
  const unreadCountVisible = useMemo(
    () => visibleNotifications.filter((n) => !n.read).length,
    [visibleNotifications]
  );

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast({
      title: t.notifications.notificationsMarked,
      description: t.notifications.notificationsMarkedDescription,
    });
    if ("clearAppBadge" in navigator) navigator.clearAppBadge();
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(t.notifications.confirmDeleteAll)) return;
    await deleteAll();
    toast({
      title: t.notifications.notificationsDeleted,
      description: t.notifications.notificationsDeletedDescription,
    });
    if ("clearAppBadge" in navigator) navigator.clearAppBadge();
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) await markAsRead(notification.id);
    if (notification.link) navigate(notification.link);
    if ("clearAppBadge" in navigator) navigator.clearAppBadge();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Header />
<div className="w-full max-w-[340px] mx-auto px-2 py-4">
        {/* Botón volver para móvil */}
        <div className="md:hidden mb-4"></div>
        {/* <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t?.common?.back || "Atrás"}
          </Button>
        </div>
 */}
        {/* Cabecera */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              
              <Bell className="h-8 w-8 text-black" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                {t.notifications.title}
                {unreadCountVisible > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCountVisible}
                  </Badge>
                )}
              </h1>
              
            </div>
            <p className="text-gray-600">
            {t.notifications.description}
          </p>
            {/* Botones de acciones */}
            <div className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto justify-end">
              {unreadCountVisible > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 text-sm w-full sm:w-auto"
                >
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t.notifications.markAllRead}
                  </span>
                  <span className="sm:hidden">{t.notifications.markReadMobile}</span>
                </Button>
              )}
              {visibleNotifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteAll}
                  className="w-8 h-8 text-red-500 sm:w-10 sm:h-10 flex items-center justify-center"
                  title={t.notifications.deleteAll}
                  
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-4">
          {loading ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {t?.common?.loading || t.notifications.loading}
                </h3>
              </CardContent>
            </Card>
          ) : visibleNotifications.length > 0 ? (
            visibleNotifications.map((n) => {
              const tpl = notificationTemplates[n.type];
              const message = tpl
                ? renderNotificationText(tpl.message, n.data)
                : "";
              return (
                <Card
  key={n.id}
  className={`max-w-[320px] w-full mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer ${
    !n.read ? "border-l-4 border-l-[#52AEB9] bg-[#E6F6F9]" : ""
  }`}
  onClick={() => handleNotificationClick(n)}
>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
<div className="w-12 h-12 bg-gradient-to-r from-[#52AEB9] to-[#57b8c9] rounded-full flex items-center justify-center text-white text-xl">
 
 
                          {tpl.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800">
                            {tpl.title}
                          </h4>
                          {!n.read && (
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
<p
  className="text-gray-600 text-sm mb-2 break-words line-clamp-4 max-w-full"
  title={message}
>
  {message}
</p>                        <span className="text-xs text-gray-500">
                          {formatTime(n.created_at)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {t.notifications.noNotifications}
                </h3>
                <p className="text-gray-600">
                  {t.notifications.emptyMessage}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
