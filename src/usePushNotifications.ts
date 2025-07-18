import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";

// Transforma la clave VAPID a Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotifications() {
  const { user } = useAuthContext();
  const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  useEffect(() => {
    if (!user) return;

    if (!VAPID_PUBLIC_KEY) {
      console.error("❌ VAPID_PUBLIC_KEY no está definida en .env");
      return;
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      (async () => {
        try {
          const reg = await navigator.serviceWorker.register("/service-worker.js", {
            type: "module",
            updateViaCache: "none",
          });
          console.log("✅ Service Worker registrado:", reg.scope);

          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            console.warn("⚠️ Permiso de notificaciones denegado");
            return;
          }

          const sw = await navigator.serviceWorker.ready;
          let sub = await sw.pushManager.getSubscription();

          if (!sub) {
            sub = await sw.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            console.log("🔔 Nueva suscripción generada");
          } else {
            console.log("🔁 Ya existía suscripción previa");
          }

          const { error } = await supabase
            .from("push_subscriptions")
            .upsert({
              user_id: user.id,
              subscription: sub.toJSON(),
            });

          if (error) {
            console.error("❌ Error guardando suscripción en Supabase:", error.message);
          } else {
            console.log("✅ Suscripción guardada en Supabase");
          }
        } catch (err) {
          console.error("❌ Error durante el registro de notificaciones:", err);
        }
      })();
    } else {
      console.warn("⚠️ El navegador no soporta Push API o Service Workers");
    }
  }, [user]);
}
