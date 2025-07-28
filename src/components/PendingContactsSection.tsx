import { usePendingContactRequests } from "@/hooks/usePendingContactRequests";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import locales from "@/locales"; // para multiidioma push

// --- Enviar push localizado según idioma del receptor ---
async function sendLocalizedPush(
  userId: string,
  entryKey: string,
  _unused: string, // no se usa
  vars: Record<string, any>
) {
  const PUSH_ENDPOINT = import.meta.env.VITE_PUSH_SERVER_URL;
  try {
    const { data: userProfile } = await supabase
      .from("users")
      .select("language")
      .eq("id", userId)
      .maybeSingle();

    const lang = userProfile?.language || "es";
    const dict = locales[lang]?.notifications || locales["es"].notifications;

    // Accede correctamente al título y mensaje
    const dictEntry = dict?.[entryKey] || {};
    const title = dictEntry.title || entryKey;
    const body =
      (dictEntry.message && typeof dictEntry.message === "string"
        ? dictEntry.message.replace(/{{(.*?)}}/g, (_, key) => vars[key.trim()] ?? "")
        : entryKey);

    const { data: pushSubs } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", userId);

    const subs = (pushSubs || [])
      .map((s: any) => {
        try {
          return typeof s.subscription === "string"
            ? JSON.parse(s.subscription)
            : s.subscription;
        } catch {
          return null;
        }
      })
      .filter(
        (s: any) => s && s.endpoint && s.keys?.auth && s.keys?.p256dh
      );

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

// --- Crear notificación en base de datos ---
async function addNotification(user_id: string, type: string, data: any, link?: string) {
  await supabase.from("notifications").insert([
    {
      user_id,
      type,
      data,
      link: link || null,
      read: false,
    },
  ]);
}

// Recibe refetchContacts como prop desde la página de contactos
export function PendingContactsSection({ refetchContacts }: { refetchContacts?: () => void }) {
  const { pendingRequests, loading, fetchRequests } = usePendingContactRequests();
  const { user } = useAuthContext();
  const { profile: currentUser } = useUserProfile();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAccept = async (request: any) => {
    // 1. Aceptar la solicitud
    await supabase
      .from("contact_requests")
      .update({ status: "accepted" })
      .eq("id", request.id);

    // 2. Crear ambos contactos (bidireccional)
    await supabase.from("contacts").insert([
      {
        user_id: user.id,
        name: request.sender?.name || request.sender?.username || request.sender?.email || "Usuario",
        email: request.sender?.email || "",
        phone: request.sender?.phone || "",
        avatar: request.sender?.avatar_url || "",
        status: "active",
        user_supabase_id: request.sender?.id,
      },
      {
        user_id: request.sender?.id,
        name: currentUser?.name || currentUser?.username || currentUser?.email || "Usuario",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        avatar: currentUser?.avatar_url || "",
        status: "active",
        user_supabase_id: user.id,
      },
    ]);

    // 3. Notificaciones
    // a) Al que acepta (tú): "Has aceptado la solicitud de contacto de {name}"
    await addNotification(
      user.id,
      "contact_request_was_accepted",
      { name: request.sender?.name || request.sender?.username || "Usuario" },
      "/contacts"
    );
    // b) Al que envió: "{name} ha aceptado tu solicitud de contacto"
    await addNotification(
      request.sender?.id,
      "contact_request_accepted",
      { name: currentUser?.name || currentUser?.username || currentUser?.email || "Usuario" },
      "/contacts"
    );

    // b2) Enviar PUSH al emisor de la solicitud, usando locales.contacts.contact_request_accepted
    await sendLocalizedPush(
      request.sender?.id,
      "contact_request_accepted",    // clave del objeto (no .title ni .message)
      "",                            // ya no se usa
      { name: currentUser?.name || currentUser?.username || currentUser?.email || "Usuario" }
    );

    toast({
      title: t.pages.contacts.contactAdded,
      description: t.pages.contacts.contactAdded,
      variant: "default",
    });

    fetchRequests();
    if (refetchContacts) refetchContacts();
  };

  const handleReject = async (request: any) => {
    await supabase
      .from("contact_requests")
      .delete()
      .eq("id", request.id);

    toast({
      title: t.challengeCard.reject,
      description: t.contacts.requestRejected || "Has rechazado la solicitud de contacto.",
      variant: "destructive",
    });
    fetchRequests();
    if (refetchContacts) refetchContacts();
  };

  if (loading) return <div className="p-4">{t.contacts.loading}</div>;
  if (!pendingRequests.length) return null;

  return (
    <div className="mb-6">
      <div className="font-bold text-lg mb-2">{t.contacts.contactRequest}</div>
      {pendingRequests.map((req) => (
        <div
          key={req.id}
          className="flex items-center justify-between border-b py-2"
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {req.sender?.avatar_url ? (
              <img
                src={req.sender.avatar_url}
                className="w-8 h-8 rounded-full"
                alt={req.sender.name || req.sender.username || "Avatar"}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
                {(req.sender?.name?.[0] || req.sender?.username?.[0] || "?").toUpperCase()}
              </div>
            )}
            {/* Nombre */}
            <span>
              {req.sender?.name || req.sender?.username || req.sender?.email}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleAccept(req)}
            >
              {t.challengeCard.accept}
            </Button>
            <Button
              size="sm"
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => handleReject(req)}
            >
              {t.challengeCard.reject}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
