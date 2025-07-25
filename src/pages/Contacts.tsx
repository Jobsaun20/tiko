import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useContacts } from "@/hooks/useContacts";
import { useFines } from "@/hooks/useFines";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, ArrowLeft, Mail, Phone, Trash2, X } from "lucide-react";
import { Header } from "@/components/Header";
import { CreateFineModal } from "@/components/CreateFineModal";
import { CreateChallengeModal } from "@/components/CreateChallengeModal";
import { AddContactModal } from "@/components/AddContactModal";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";
import { useBadgeModal } from "@/contexts/BadgeModalContext";

// URL de tu edge function badges
const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";

// Buscar el user_id a partir del email
async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (error || !data) return null;
  return data.id;
}

export default function Contacts() {
  const { user, session } = useAuthContext();
  const { profile: currentUser } = useUserProfile();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts();
  const { createFine } = useFines();
  const { showBadges } = useBadgeModal();

  // Estados para fines y retos
  const [isCreateFineModalOpen, setIsCreateFineModalOpen] = useState(false);
  const [isCreateChallengeModalOpen, setIsCreateChallengeModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [preselectedParticipant, setPreselectedParticipant] = useState<any>(null);

  // Contactos
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);

  // Barra de búsqueda
  const [search, setSearch] = useState("");

  // --- AVATARS ---
  const [avatarsMap, setAvatarsMap] = useState<{ [userId: string]: { avatar_url: string; name: string } }>({});

  // FILTRADO de contactos
  const filteredContacts = contacts.filter(contact => {
    const term = search.toLowerCase().trim();
    const name = (contact.name || "").toLowerCase();
    const email = (contact.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  // Cargar avatares de todos los contactos filtrados
  useEffect(() => {
    if (!filteredContacts.length) {
      setAvatarsMap({});
      return;
    }
    const userIds = filteredContacts
      .filter(c => c.user_supabase_id)
      .map(c => c.user_supabase_id);
    if (!userIds.length) {
      setAvatarsMap({});
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, avatar_url")
        .in("id", userIds);
      if (!error && data) {
        const map: { [userId: string]: { avatar_url: string; name: string } } = {};
        data.forEach(u => {
          map[u.id] = { avatar_url: u.avatar_url || "", name: u.name || "" };
        });
        setAvatarsMap(map);
      }
    })();
  }, [filteredContacts.map(c => c.user_supabase_id).join(",")]);

  // Modal multar
  const handleFineContact = (contact: any) => {
    setSelectedContact(contact);
    setIsCreateFineModalOpen(true);
  };

  // Modal retar
  const handleChallengeContact = (contact: any) => {
    setPreselectedParticipant({ user_supabase_id: contact.user_supabase_id, ...contact });
    setIsCreateChallengeModalOpen(true);
  };

  // Crear multa
  const handleCreateFine = async (fineData: any) => {
    try {
      const recipient = contacts.find(c => c.id === (fineData.recipient_id || fineData.recipient_Id));
      if (!recipient) throw new Error("Contacto destinatario inválido");
      const recipientId = await getUserIdByEmail(recipient.email);
      if (!recipientId) {
        toast({
          title: t.contacts.error,
          description: t.contacts.errorDescription,
          variant: "destructive",
        });
        return;
      }
      await createFine({
        reason: fineData.reason,
        amount: parseFloat(fineData.amount),
        recipient_id: recipientId,
        recipient_name: recipient.name,
        recipient_email: recipient.email,
        sender_name: currentUser?.username || currentUser?.email,
        sender_phone: currentUser?.phone ?? "",
        type: "sent",
      });
      toast({
        title: t.createFine.created,
        description: t.createFine.sentTo
          .replace("{amount}", String(fineData.amount))
          .replace("{recipient}", recipient.name),
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setIsCreateFineModalOpen(false);
    setSelectedContact(null);
  };

  // Agregar contacto
  const handleAddContact = () => {
    setEditingContact(null);
    setIsAddContactModalOpen(true);
  };

  // Eliminar contacto
  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      toast({
        title: t.pages.contacts.contactDeleted,
        description: t.contacts.deletedContactConfirmed,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => setSearch("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Botón volver para móviles */}
        <div className="md:hidden mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Button>
        </div>

        {/* Título y descripción */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8" />
            {t.pages.contacts.title}
          </h1>
          <p className="text-gray-600">{t.pages.contacts.description}</p>
        </div>

        {/* Barra de búsqueda y botón agregar */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            onClick={handleAddContact}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {t.pages.contacts.addContact}
          </Button>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={t.contacts.contactSearchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={clearSearch}
                tabIndex={-1}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Lista de contactos filtrada */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t.contacts.loading}</div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => {
const avatarData = avatarsMap[contact.user_supabase_id] as { avatar_url?: string; name?: string } || {};
              const avatar_url = avatarData.avatar_url || undefined;
              const name = avatarData.name || contact.name || "";
              return (
                <Card key={contact.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={avatar_url}
                            alt={name}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{name}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span>{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                          </div>
                          <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                            {t.contacts.statusActive}
                          </Badge>
                        </div>
                      </div>
                      {/* Acciones: borrar a la izquierda, multa y retar a la derecha */}
                      <div className="flex flex-row justify-between items-stretch w-full sm:w-auto sm:ml-4">
                        {/* Botón borrar alineado a la izquierda */}
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteContact(contact.id)}
                            title={t.pages.contacts.deleteContact}
                            className="w-8 h-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {/* Espacio entre borrar y acciones */}
                        <div className="flex-1"></div>
                        {/* Botones Multa y Retar a la derecha, uno encima de otro */}
                        <div className="flex flex-col gap-2 items-end justify-end w-full max-w-[160px]">
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                            onClick={() => handleFineContact(contact)}
                          >
                            {t.pages.contacts.fine}
                          </Button>
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            onClick={() => handleChallengeContact(contact)}
                          >
                            {t.contacts.challenge}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {t.pages.contacts.noContacts}
                </h3>
                <Button
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={handleAddContact}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t.pages.contacts.addContact}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {/* Modales igual que antes... */}
      <CreateFineModal
        isOpen={isCreateFineModalOpen}
        onClose={() => {
          setIsCreateFineModalOpen(false);
          setSelectedContact(null);
        }}
        onSubmit={handleCreateFine}
        preselectedContact={selectedContact}
        contacts={contacts}
        currentUser={currentUser}
        currentUserUsername={currentUser?.username ?? ""}
      />
      <CreateChallengeModal
        isOpen={isCreateChallengeModalOpen}
        onClose={() => {
          setIsCreateChallengeModalOpen(false);
          setPreselectedParticipant(null);
        }}
        currentUserId={user.id}
        preselectedParticipant={preselectedParticipant}
      />
      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => {
          setIsAddContactModalOpen(false);
          setEditingContact(null);
        }}
        onSubmit={async contactData => {
          try {
            // Añade el contacto
            const nuevoContacto = await addContact({ ...contactData, status: "active" });
            toast({
              title: t.pages.contacts.contactAdded,
              description: t.contacts.addedContactConfirmed,
            });

            // --- Chequear insignias Edge Function ---
            if (user && session?.access_token && nuevoContacto) {
              const response = await fetch(CHECK_BADGES_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + session.access_token,
                },
                body: JSON.stringify({
                  user_id: user.id,
                  action: "add_contact",
                  action_data: {
                    contact_id: nuevoContacto.id,
                    lang: language || "es",
                  },
                }),
              });
              const result = await response.json();
              if (result?.newlyEarned?.length > 0) {
                showBadges(result.newlyEarned, language);
              }
            }
          } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
          }
        }}
        editingContact={editingContact}
      />
    </div>
  );
}
