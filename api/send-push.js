import webpush from 'web-push';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // Configura VAPID
  webpush.setVapidDetails(
    'mailto:tucorreo@dominio.com', // tu email real aquí
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  try {
    // Parseo seguro del body
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    let { subs, notif } = body;

    // Permite un array de subs o una sola subscripción
    if (!subs) {
      return res.status(400).json({ error: "No subscriptions provided" });
    }
    if (!Array.isArray(subs)) subs = [subs];

    // Validación de cada subscripción
    subs = subs.filter(
      s => s && typeof s === "object" && !!s.endpoint && s.keys && s.keys.p256dh && s.keys.auth
    );
    if (subs.length === 0) {
      return res.status(400).json({ error: "No valid subscriptions provided" });
    }

    // Log útil para depuración
    console.log("🔔 Enviando push a", subs.length, "subscripciones");
    console.log("🔔 Notificación:", notif);

    // Enviar notificación a cada suscripción
    await Promise.all(
      subs.map(sub =>
        webpush.sendNotification(sub, JSON.stringify(notif))
          .catch(err => {
            console.error("Error enviando push:", err.message);
            return null;
          })
      )
    );

    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error("ERROR EN PUSH:", error);
    return res.status(500).json({ error: error.message || error.toString() });
  }
}
