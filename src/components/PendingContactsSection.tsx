import { usePendingContactRequests } from "@/hooks/usePendingContactRequests";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Recibe refetchContacts como prop desde la página de contactos
export function PendingContactsSection({ refetchContacts }: { refetchContacts?: () => void }) {
  const { pendingRequests, loading, fetchRequests } = usePendingContactRequests();
  const { user } = useAuthContext();
  const { profile: currentUser } = useUserProfile();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAccept = async (request: any) => {
    await supabase
      .from("contact_requests")
      .update({ status: "accepted" })
      .eq("id", request.id);

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

    toast({
      title: t.pages.contacts.contactAdded,
      description: t.pages.contacts.contactAdded,
      variant: "default",
    });
    fetchRequests();
    // Refresca contactos en la página principal
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
