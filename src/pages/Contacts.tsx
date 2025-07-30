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
import { PendingContactsSection } from "@/components/PendingContactsSection";

// MODAL
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";

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
  const { contacts, loading, deleteContact } = useContacts();
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
  const [avatarsMap, setAvatarsMap] = useState<{ [userId: string]: { avatar_url: string; name: string; username?: string } }>({});

  // MODAL CONFIRMAR ELIMINACIÓN
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<any>(null);

  // FILTRADO de contactos
const filteredContacts = contacts
  .filter(contact => {
    const term = search.toLowerCase().trim();
    const username = (contact.name || "").toLowerCase();
    const name = (contact.name || "").toLowerCase();
    const email = (contact.email || "").toLowerCase();
    return username.includes(term) || name.includes(term) || email.includes(term);
  })
  .filter((contact, idx, arr) => 
    arr.findIndex(c => c.user_supabase_id === contact.user_supabase_id) === idx
  );

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
        .select("id, name, username, avatar_url")
        .in("id", userIds);
      if (!error && data) {
        const map: { [userId: string]: { avatar_url: string; name: string; username?: string } } = {};
        data.forEach(u => {
          map[u.id] = { 
            avatar_url: u.avatar_url || "",
            name: u.name || "",
            username: u.username || ""
          };
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
        recipient_name: recipient.name || recipient.name || recipient.email,
        recipient_email: recipient.email,
        sender_name: currentUser?.username || currentUser?.email,
        sender_phone: currentUser?.phone ?? "",
        type: "sent",
      });
      toast({
        title: t.createFine.created,
        description: t.createFine.sentTo
          .replace("{amount}", String(fineData.amount))
          .replace("{recipient}", recipient.name || recipient.name),
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

  // -------- ELIMINAR contacto con confirmación --------
  // Botón papelera → abre modal
  const openDeleteContactModal = (contact: any) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  // Si confirma, borra y cierra modal
  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;
    try {
      const contacto = contacts.find(c => c.id === contactToDelete.id);
      if (!contacto) throw new Error("Contacto no encontrado");

      await deleteContact(contactToDelete.id);

      await supabase
        .from("contact_requests")
        .delete()
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${contacto.user_supabase_id}),and(sender_id.eq.${contacto.user_supabase_id},recipient_id.eq.${user.id})`
        )
        .eq("status", "accepted");

      toast({
        title: t.pages.contacts.contactDeleted,
        description: t.contacts.deletedContactConfirmed,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const clearSearch = () => setSearch("");

  return (
<div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Botón volver para móviles */}
        <div className="md:hidden mb-4">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Button> */}
        </div>

        {/* Título y descripción */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8" />
            {t.pages.contacts.title}
          </h1>
          <p className="text-gray-600">{t.pages.contacts.description}</p>
        </div>

        {/* Barra de búsqueda y botón agregar */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
  onClick={handleAddContact}
  className="w-full max-w-[320px] mx-auto flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-[#72bfc4] to-[#57b8c9] shadow-md gap-4 mb-4"
  style={{ minHeight: 48 }}
>
  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7fcad1]/60">
    <UserPlus className="w-6 h-6 text-white" />
  </span>
  <span className="flex flex-col items-start leading-tight">
    <span className="font-bold text-white text-base">
      {t.pages.contacts.addContact}
    </span>
    
  </span>
</Button>
  <div className="relative max-w-[320px] w-full mx-auto">
            <input
  type="text"
  className="border border-gray-200 bg-white rounded-full px-5 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#72bfc4] shadow-sm text-gray-700 placeholder-gray-400"
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

        {/* NUEVO: Sección de solicitudes pendientes */}
        <PendingContactsSection />

        {/* Lista de contactos filtrada */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t.contacts.loading}</div>
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => {
              const avatarData = avatarsMap[contact.user_supabase_id] as { avatar_url?: string; name?: string; username?: string } || {};
              const avatar_url = avatarData.avatar_url || undefined;
              const nameToShow = avatarData.username || contact.name || avatarData.name || contact.email || "";
              return (
<Card key={contact.id} className="rounded-2xl border border-gray-100 shadow-lg bg-white p-0 min-h-[88px] max-w-[320px] w-full mx-auto">
  <CardContent className="p-6">
    {/* Layout en dos filas */}
    <div className="flex flex-col gap-2">
      {/* Fila 1: avatar, nombre y estado */}
      <div className="flex items-center gap-4 min-w-0">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar_url} alt={nameToShow} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            {nameToShow?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-semibold text-lg truncate">{nameToShow}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {t.contacts.statusActive}
            </Badge>
          </div>
        </div>
      </div>
      {/* Fila 2: acciones abajo */}
      <div className="flex flex-row mt-1 w-full">
        {/* Botón borrar a la izquierda */}
        <div className="flex flex-col justify-end items-start flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDeleteContactModal(contact)}
            title={t.pages.contacts.deleteContact}
            className="w-8 h-8 text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        {/* Botones de acción a la derecha */}
        <div className="flex flex-col gap-2 items-end" style={{ minWidth: 120 }}>
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow w-full"
            onClick={() => handleFineContact(contact)}
            style={{ minHeight: 36 }}
          >
            {t.pages.contacts.fine}
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-[#915ec3] to-[#b07cd6] text-white font-semibold shadow w-full"
            onClick={() => handleChallengeContact(contact)}
            style={{ minHeight: 36 }}
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
      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.contacts.confirmDeleteTitle || "¿Eliminar contacto?"}</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-gray-700">
            {t.contacts.confirmDeleteDescription
              ? t.contacts.confirmDeleteDescription || ""
              : `¿Seguro que quieres eliminar el contacto? Esta acción es irreversible.`}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              {t.common.cancel || "Cancelar"}
            </Button>
            <Button variant="destructive" onClick={confirmDeleteContact}>
              {t.pages.contacts.deleteContact || "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        onSubmit={() => {}}
        editingContact={editingContact}
      />
    </div>
  );
}
