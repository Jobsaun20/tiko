// src/hooks/useSendContactRequest.ts
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile"; // <-- IMPORTANTE
import locales from "@/locales";

const PUSH_ENDPOINT = import.meta.env.VITE_PUSH_SERVER_URL;

// --- FUNCION AUXILIAR PARA CREAR NOTIFICACION ---
async function addNotification(user_id: string, type: string, data: any, link?: string) {
  try {
    // ✅ Elimina valores `undefined` automáticamente
    const cleanData = JSON.parse(JSON.stringify(data));

    const { error } = await supabase.from("notifications").insert([
      {
        user_id,
        type,
        data: cleanData, // ← limpio y seguro
        link: link || null,
        read: false,
      },
    ]);

    if (error) {
      console.error("❌ Error insertando notificación:", error);
    }
  } catch (err) {
    console.error("❌ Error preparando notificación:", err);
  }
}


// --- Función para traducir textos con variables ---
function templateReplace(str: string, vars: Record<string, any>) {
  if (!str || typeof str !== "string") return "";
  // Reemplaza tanto {{var}} como {var}
  return str
    .replace(/{{(.*?)}}/g, (_, key) => vars[key.trim()] ?? "")
    .replace(/{(.*?)}/g, (_, key) => vars[key.trim()] ?? "");
}

// --- Enviar push localizado según idioma del receptor ---
async function sendLocalizedPush(
  userId: string,
  titleKey: string,
  bodyKey: string,
  vars: Record<string, any>
) {
  try {
    const { data: userProfile } = await supabase
      .from("users")
      .select("language")
      .eq("id", userId)
      .maybeSingle();

    const lang = userProfile?.language || "es";
    const dict = locales[lang]?.contacts || locales["es"].contacts;

    const title = dict?.[titleKey] || titleKey;
    const body = templateReplace(dict?.[bodyKey], vars) || templateReplace(bodyKey, vars);

    const { data: pushSubs } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", userId);

    const subs = (pushSubs || [])
      .map((s: any) => {
        try {
          return typeof s.subscription === "string" ? JSON.parse(s.subscription) : s.subscription;
        } catch {
          return null;
        }
      })
      .filter((s: any) => s && s.endpoint && s.keys?.auth && s.keys?.p256dh);

    for (const subscription of subs) {
      await fetch(PUSH_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subs: subscription,
          notif: {
            title,
            body,
            url: "/contacts", // Redirección al abrir
          },
        }),
      });
    }
  } catch (err) {
    console.error("Error en sendLocalizedPush:", err);
  }
}

export function useSendContactRequest() {
  const { user } = useAuthContext();
  const { profile } = useUserProfile(); // <-- Aquí obtenemos el perfil completo

  const sendContactRequest = async (recipient_id: string) => {
    if (!user) return { success: false, error: "Usuario no autenticado" };

    // Chequea si ya existe una solicitud
    const { data: existing } = await supabase
      .from("contact_requests")
      .select("id")
      .or(
        `and(sender_id.eq.${user.id},recipient_id.eq.${recipient_id}),and(sender_id.eq.${recipient_id},recipient_id.eq.${user.id})`
      )
      .neq("status", "rejected");

    if (existing?.length) {
      return { success: false, error: "Ya existe una solicitud pendiente o aceptada" };
    }

    // Crea la solicitud
    const { error } = await supabase.from("contact_requests").insert({
      sender_id: user.id,
      recipient_id,
      status: "pending",
    });

    if (error) return { success: false, error: error.message };

    // Obtén los nombres de usuario (si los necesitas mostrar)
    const senderName =
      profile?.name?.trim() ||
      profile?.username?.trim() ||
      user.email?.split("@")[0] ||
      "Usuario";

    // --- OBTÉN NOMBRE DEL DESTINATARIO para mostrarlo en tu notificación (opcional) ---
    let recipientName = "Usuario";
    try {
      const { data: recipientProfile } = await supabase
        .from("users")
        .select("name, username, email")
        .eq("id", recipient_id)
        .maybeSingle();
      recipientName =
        recipientProfile?.name?.trim() ||
        recipientProfile?.username?.trim() ||
        recipientProfile?.email?.split("@")[0] ||
        "Usuario";
    } catch {}

    // --- PUSH para el destinatario ---
    await sendLocalizedPush(
      recipient_id,
      "newContactRequestTitle", // claves definidas en locales.contacts
      "newContactRequestBody",
      { name: senderName }
    );

    // --- Notificación en sistema para el destinatario ---
    await addNotification(
      recipient_id,
      "contact_request_received", // Notificación de recibido
      { name: senderName },
      "/contacts"
    );

    // --- Notificación en sistema para el REMITENTE (quien la envía) ---
    await addNotification(
      user.id,
      "contact_request_sent", // Notificación de enviado
      { name: recipientName },
      "/contacts"
    );

    return { success: true };
  };

  return { sendContactRequest };
}
