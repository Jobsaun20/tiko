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

const VAPID_KEY_STORAGE = "vapid_key_used_for_push";

export function usePushNotifications() {
  const { user } = useAuthContext();
  const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  useEffect(() => {
    if (!user || !VAPID_PUBLIC_KEY) {
      console.warn("⛔ No user or VAPID key");
      return;
    }

    (async () => {
       // PASO 1: Limpieza automática SIEMPRE (no solo si ha cambiado la VAPID)
    console.log("Comprobando si hay suscripción push previa...");
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const reg = await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (sub) {
        console.log("Encontrada suscripción previa:", sub);
        await sub.unsubscribe();
        console.log("🧹 Subscripción vieja borrada por cambio de VAPID.");
      } else {
        console.log("No hay subscripción previa");
      }
    }
      // Elimina SIEMPRE la suscripción previa (fuerza limpieza)
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          console.log("🧹 Subscripción anterior eliminada (forzado).");
        }
      }

      // Guarda la VAPID usada para futura referencia (opcional)
      localStorage.setItem(VAPID_KEY_STORAGE, VAPID_PUBLIC_KEY);

      // Registrar el Service Worker y crear subscripción nueva
      if ("serviceWorker" in navigator && "PushManager" in window) {
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

          // ¡Siempre será null, porque acabas de borrar la anterior!
          if (!sub) {
            sub = await sw.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            console.log("🟢 Nueva suscripción creada con VAPID:", VAPID_PUBLIC_KEY, sub);
          }

          // Guarda la suscripción en Supabase
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
          console.error("❌ Error al registrar notificaciones:", err);
        }
      } else {
        console.warn("⚠️ El navegador no soporta Push API o Service Workers");
      }
    })();

  }, [user, VAPID_PUBLIC_KEY]);
}
