// public/service-worker.js

self.addEventListener("install", (event) => {
  // Forzar activación inmediata al instalar
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Tomar control de todas las páginas abiertas
  event.waitUntil(clients.claim());
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  const title = data?.title || "Tienes una nueva notificación";
  const options = {
    body: data?.body || "",
    icon: "/icon-192x192.png",
    badge: "/badge-icon.png", // Puedes poner el mismo icono si no tienes uno específico
    data: { url: data?.url || "/" },
  };

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, options);

      if ("setAppBadge" in self.registration) {
        self.registration.setAppBadge(1).catch(() => {});
      }
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      if (event.notification.data?.url) {
        await clients.openWindow(event.notification.data.url);
      }

      if ("clearAppBadge" in self.registration) {
        self.registration.clearAppBadge().catch(() => {});
      }
    })()
  );
});
