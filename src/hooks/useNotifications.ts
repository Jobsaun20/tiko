import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

/**
 * useNotifications
 * - unreadCount: número de notificaciones no leídas.
 * - notifications: array con todas las notificaciones del usuario.
 * - loading: booleano de carga.
 * - markAllAsRead: función para marcar todas como leídas.
 * - markAsRead: función para marcar una como leída.
 */
export function useNotifications() {
  const { user } = useAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carga notificaciones y contador
  const fetchNotifications = async () => {
    if (!user) {
      setUnreadCount(0);
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Cargar todas las notificaciones ordenadas (más nuevas primero)
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setNotifications(data || []);
      setUnreadCount((data || []).filter((n: any) => !n.read).length);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    if (!user) return;

    // Realtime: Recarga si hay cambios en la tabla
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        fetchNotifications
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, [user?.id]);

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    fetchNotifications();
  };

  // Marcar una notificación como leída
  const markAsRead = async (id: string) => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
    fetchNotifications();
  };

  return {
    unreadCount,
    notifications,
    loading,
    markAllAsRead,
    markAsRead,
    fetchNotifications,
    setNotifications,
  };
}
