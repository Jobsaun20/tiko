// public/service-worker.js

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  const title = data?.title || "Tienes una nueva notificación";
  const options = {
    body: data?.body || "",
    icon: "/icon-192x192.png",
    badge: "/badge-icon.png", // Puedes poner el mismo icon si no tienes uno específico
    data: { url: data?.url || "/" },
  };

  event.waitUntil(
    (async () => {
      // Mostrar la notificación
      await self.registration.showNotification(title, options);

      // MARCAR BADGE (puntito rojo) en el icono si el navegador lo soporta
      if ("setAppBadge" in self.registration) {
        // Si quieres poner el número real de no leídas, cámbialo por el número adecuado.
        // Aquí ponemos simplemente un badge (puntito)
        self.registration.setAppBadge(1).catch(() => {});
      }
    })()
  );
});

// Limpiar el badge cuando el usuario hace click en la notificación (opcional)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      // Abrir la URL de la notificación
      if (event.notification.data?.url) {
        await clients.openWindow(event.notification.data.url);
      }
      // LIMPIAR BADGE (si quieres que se borre al abrir la notificación)
      if ("clearAppBadge" in self.registration) {
        self.registration.clearAppBadge().catch(() => {});
      }
    })()
  );
});
