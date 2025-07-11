import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowLeft, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";

// Utilidad para reemplazar los {{placeholders}} en la traducción
function renderNotificationText(template: string, data: Record<string, any>) {
  if (!template) return "";
  return template.replace(/{{(\w+)}}/g, (_, key) => data?.[key] ?? "");
}

export default function Notifications() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    unreadCount,
    notifications,
    loading,
    markAllAsRead,
    markAsRead,
  } = useNotifications();

  // Formatear fecha relativa
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return t?.pages?.notifications?.lessThanHour || "Less than 1 hour ago";
    } else if (diffHours < 24) {
      return (t?.pages?.notifications?.hoursAgo || "{hours} hours ago").replace("{hours}", diffHours.toString());
    } else {
      return (t?.pages?.notifications?.daysAgo || "{days} days ago").replace("{days}", diffDays.toString());
    }
  };

  // Icono por tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "fine_received":
        return "💸";
      case "payment_received":
        return "💰";
      case "group_invite":
        return "👥";
      case "group_rule_proposed":
        return "⏳";
      default:
        return "🔔";
    }
  };

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast({
      title: t?.pages?.notifications?.marked || "Notifications marked",
      description: t?.pages?.notifications?.allRead || "All notifications have been marked as read",
    });
  };

  // Marcar una notificación como leída y navegar si tiene link
  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Botón atrás para mobile */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t?.common?.back || "Back"}
          </Button>
        </div>

        {/* Header de notificaciones adaptativo */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                {t?.pages?.notifications?.title || "Notifications"}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </h1>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0"
              >
                <Check className="h-4 w-4" />
                {t?.pages?.notifications?.markAllRead || "Mark all as read"}
              </Button>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            {t?.pages?.notifications?.description || "Your recent notifications"}
          </p>
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-4">
          {loading ? (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {t?.common?.loading || "Loading notifications..."}
                </h3>
              </CardContent>
            </Card>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => {
              // Traducción dinámica del mensaje
              let template =
                t?.pages?.notifications?.[notification.type] || "";

              // Fallbacks para tipos concretos
              if (!template && notification.type === "group_rule_proposed") {
                template = "{{rule_description}}";
              }
              if (!template && notification.type === "fine_received") {
                template = "{{sender_name}} sent you a fine of {{amount}} CHF for \"{{reason}}\"";
              }

              const message = renderNotificationText(template, notification.data);

              // Título traducible para tipos conocidos
              let notifTitle = "";
              if (notification.type === "group_rule_proposed") {
                notifTitle = t?.pages?.notifications?.newRuleProposed || "";
              } else if (notification.type === "fine_received") {
                notifTitle = t?.pages?.notifications?.fine_received_title || "";
              }

              return (
                <Card
                  key={notification.id}
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    !notification.read
                      ? "border-l-4 border-l-purple-500 bg-purple-50"
                      : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800">
                            {notifTitle}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.created_at)}
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
                  {t?.pages?.notifications?.noNotifications ||
                    "You don't have notifications yet"}
                </h3>
                <p className="text-gray-600">
                  {t?.pages?.notifications?.emptyMessage ||
                    "When you have notifications, they will appear here."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
