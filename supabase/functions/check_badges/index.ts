// index.ts - Supabase Edge Function para verificar y otorgar badges
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "jsr:@std/server";
import { createClient } from "@supabase/supabase-js";

// ---------------------- CORS HEADERS ------------------------
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*", // Cambia "*" por tu dominio en producción si lo deseas.
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req: Request) => {
  // --- SOPORTE CORS: Responder a preflight/OPTIONS ---
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }

  // 1. Recoge los datos de la acción enviada por el frontend
  const { user_id, action, action_data } = await req.json();

  // 2. Inicializa el cliente de Supabase (usando las env vars del entorno Edge)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  // 3. Carga todos los badges
  const { data: allBadges, error: errorBadges } = await supabase.from("badges").select("*");
  if (errorBadges) {
    return new Response(JSON.stringify({ error: errorBadges.message }), { status: 500, headers: CORS_HEADERS });
  }

  // 4. Carga los badges que el usuario YA TIENE
  const { data: userBadges, error: errorUserBadges } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", user_id);
  if (errorUserBadges) {
    return new Response(JSON.stringify({ error: errorUserBadges.message }), { status: 500, headers: CORS_HEADERS });
  }
  const ownedBadgeIds = userBadges?.map(b => b.badge_id) || [];

  // 5. Prepara el array de logros recién ganados
  let newlyEarned = [];

  // 6. Lógica para cada badge (personaliza aquí para lógica avanzada)
  for (const badge of allBadges || []) {
    if (ownedBadgeIds.includes(badge.id)) continue; // Ya tiene el badge
    let unlock = false;

    // ---- Ejemplo de lógica personalizada para algunos badges ----
    switch (badge.key) {
      case "first_qr_payment":
        if (action === "pay_qr") {
          // Otorga solo si es el primer pago por QR
          const { count } = await supabase
            .from("payments")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user_id)
            .eq("type", "qr");
          if ((count ?? 0) === 1) unlock = true;
        }
        break;

      case "pay_qr_10_times":
        if (action === "pay_qr") {
          const { count } = await supabase
            .from("payments")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user_id)
            .eq("type", "qr");
          if ((count ?? 0) >= 10) unlock = true;
        }
        break;

      case "multi_group_member":
        if (action === "join_group") {
          const { count } = await supabase
            .from("memberships")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user_id);
          if ((count ?? 0) >= 3) unlock = true;
        }
        break;

      // ---- Por defecto: si la acción coincide con el key del badge ----
      default:
        if (action === badge.key) unlock = true;
    }

    // Si cumple la condición, otorga el badge
    if (unlock) {
      await supabase.from("user_badges").insert({
        user_id,
        badge_id: badge.id,
        achieved_at: new Date().toISOString(),
      });
      newlyEarned.push(badge);
    }
  }

  // 7. Devuelve los logros desbloqueados
  return new Response(
    JSON.stringify({ success: true, newlyEarned }),
    { headers: CORS_HEADERS }
  );
});
