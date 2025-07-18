/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event: PushEvent) => {
  const data = event.data?.json() || {};

  const title: string = data?.title || "Tienes una nueva notificación";
  const options: NotificationOptions = {
    body: data?.body || "",
    icon: "/icon-192x192.png",
    badge: "/badge-icon.png",
    data: { url: data?.url || "/" },
  };

  event.waitUntil(
    (async () => {
      // Mostrar la notificación
      await self.registration.showNotification(title, options);

      // MARCAR BADGE (si está disponible)
      if ("setAppBadge" in self.registration) {
        try {
          // @ts-ignore: setAppBadge no está aún en todos los tipos
          await self.registration.setAppBadge(1);
        } catch {}
      }
    })()
  );
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const url = event.notification?.data?.url;
      if (url) {
        await self.clients.openWindow(url);
      }

      // LIMPIAR BADGE
      if ("clearAppBadge" in self.registration) {
        try {
          // @ts-ignore: clearAppBadge no está aún en todos los tipos
          await self.registration.clearAppBadge();
        } catch {}
      }
    })()
  );
});
