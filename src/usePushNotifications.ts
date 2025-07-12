import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext"; // Ajusta si tu contexto de usuario está en otro sitio
import { supabase } from "@/supabaseClient"; // Ajusta si lo importas distinto

// Función para transformar la clave VAPID a Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const { user } = useAuthContext();
  const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  useEffect(() => {
    if (!user) return; // Espera a que haya usuario logueado

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((reg) => console.log("Service Worker registrado:", reg.scope))
        .catch((err) => console.error("Error registrando SW:", err));

      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          (async () => {
            const reg = await navigator.serviceWorker.ready;
            let sub = await reg.pushManager.getSubscription();
            if (!sub) {
              sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
              });
            }
            // Guarda la suscripción en Supabase
            await supabase
              .from("push_subscriptions")
              .upsert({ user_id: user.id, subscription: sub.toJSON() });
          })();
        } else {
          console.warn("Permiso de notificaciones denegado");
        }
      });
    }
  }, [user]);
}
