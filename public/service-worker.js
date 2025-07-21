/*  /public/service-worker.js  */

const DEFAULT_VIBRATE = [120, 60, 120];   // heads‑up en Android

/* ---------- ciclo de vida ---------- */
self.addEventListener('install', (event) => self.skipWaiting());

self.addEventListener('activate', (event) =>
  event.waitUntil(clients.claim())
);

/* ---------- PUSH ---------- */
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  const title = data.title ?? 'Tienes una nueva notificación';

  const options = {
    body:   data.body   ?? '',
    icon:   data.icon   ?? '/icon-192x192.png',
    badge:  data.badge  ?? '/badge-icon.png',
    // Heads‑up en Android; ignorado por iOS
    vibrate: data.vibrate ?? DEFAULT_VIBRATE,
    // Banner se oculta solo; no requiere interacción
    requireInteraction: data.requireInteraction ?? false,
    // Permite agrupar notificaciones si se envía siempre el mismo tag
    tag:    data.tag ?? undefined,
    renotify: false,
    data: { url: data.url ?? '/' },
  };

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, options);

      /* Badge API (Chrome / Android 14+) */
      if ('setAppBadge' in self.registration) {
        try { await self.registration.setAppBadge(1); } catch (_) {}
      }
    })()
  );
});

/* ---------- CLICK sobre la notificación ---------- */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const url = event.notification.data?.url;
      if (url) {
        /* Si la URL ya está abierta, enfócala; si no, ábrela en una nueva ventana */
        const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of windowClients) {
          if (client.url.includes(new URL(url, location.origin).pathname) && 'focus' in client) {
            client.focus();
            return;
          }
        }
        await clients.openWindow(url);
      }

      if ('clearAppBadge' in self.registration) {
        try { await self.registration.clearAppBadge(); } catch (_) {}
      }
    })()
  );
});
