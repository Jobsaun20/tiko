import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

// Tipado de notificación (puedes expandir según tus tipos)
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title?: string | null;
  message?: string | null;
  link?: string | null;
  data?: any;
  read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { user } = useAuthContext();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar notificaciones y contador
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
      setNotifications((data as Notification[]) || []);
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
