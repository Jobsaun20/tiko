// supabase/functions/send-push/index.ts

// deno-lint-ignore-file no-explicit-any

// --- HABILITA CORS Y DESACTIVA JWT PARA TESTEO (pon verify_jwt = false en config.toml) ---

// 1) Importa el runtime HTTP de Deno
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// 2) Importa web-push desde esm.sh
import webpush from "https://esm.sh/web-push@3.5.0";

// 3) Importa el cliente de Supabase
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Cabeceras CORS (opcional)
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req: Request) => {
  // Soporte para preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  try {
    // Permitir query param y body JSON
    let notification_id: string | undefined;
    // Si viene en body
    try {
      const body = await req.json();
      notification_id = body.notification_id;
    } catch {
      // Si falla, busca en URL (?notification_id=...)
      const url = new URL(req.url);
      notification_id = url.searchParams.get("notification_id") ?? undefined;
    }
    if (!notification_id) {
      return new Response(JSON.stringify({ error: "No notification_id" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // 2) Inicializa Supabase con la service-role key
    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 3) Obtén la notificación
    const { data: notif, error: errNotif } = await supa
      .from("notifications")
      .select("user_id, title, message, link")
      .eq("id", notification_id)
      .single();
    if (errNotif || !notif) {
      return new Response(JSON.stringify({ error: errNotif?.message || "Notificación no encontrada" }), {
        status: 404,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // 4) Obtén las suscripciones push del usuario
    const { data: subs, error: errSubs } = await supa
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", notif.user_id);
    if (errSubs || !subs || subs.length === 0) {
      return new Response(JSON.stringify({ error: errSubs?.message || "No hay suscripciones" }), {
        status: 404,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // 5) Configura VAPID
    webpush.setVapidDetails(
      "mailto:tu@dominio.com",
      Deno.env.get("VITE_VAPID_PUBLIC_KEY")!,
      Deno.env.get("VITE_VAPID_PRIVATE_KEY")!
    );

    // 6) Envía la notificación a cada suscripción
    await Promise.all(subs.map(s => {
      return webpush.sendNotification(
        s.subscription as any,
        JSON.stringify({
          title: notif.title,
          body: notif.message,
          url: notif.link,
        })
      );
    }));

    // 7) Responde OK
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error en send-push:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
