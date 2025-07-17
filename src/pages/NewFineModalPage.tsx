import { useState } from "react";
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
import { Users, UserPlus, Mail, Phone, Trash2, X } from "lucide-react";

import { CreateFineModal } from "@/components/CreateFineModal";
import { AddContactModal } from "@/components/AddContactModal";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient";

// ... getUserIdByEmail igual que tienes ...

async function getUserIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (error || !data) return null;
  return data.id;
}

export default function ContactsModalPage() {
  const { user } = useAuthContext();
  const { profile: currentUser } = useUserProfile();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts();
  const { createFine } = useFines();

  const [isCreateFineModalOpen, setIsCreateFineModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [search, setSearch] = useState("");

  // FILTRADO de contactos en tiempo real
  const filteredContacts = contacts.filter(contact => {
    const term = search.toLowerCase().trim();
    const name = (contact.name || "").toLowerCase();
    const email = (contact.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  // Abrir modal para multar a contacto
  const handleFineContact = (contact: any) => {
    setSelectedContact(contact);
    setIsCreateFineModalOpen(true);
  };

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

  const handleAddContact = () => {
    setEditingContact(null);
    setIsAddContactModalOpen(true);
  };

  // Elimina el contacto seleccionado
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

  // Limpia el campo de búsqueda
  const clearSearch = () => setSearch("");

  // Handler para cerrar modal
  const handleCloseModal = () => navigate(-1);

  return (
  // Overlay oscuro de fondo
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    {/* Modal principal */}
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-2 sm:mx-0 sm:max-w-lg p-0 flex flex-col">
      {/* Botón cerrar */}
      <button
        onClick={handleCloseModal}
        className="absolute top-3 right-3 p-2 text-gray-400 hover:text-gray-700"
        aria-label={t.common.close}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Barra búsqueda y botón agregar */}
      <div className="flex flex-col gap-2 px-4 pt-6 pb-2 sm:px-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 sm:h-7 sm:w-7" />
            
            {t.contacts.titleFineModalPage}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
            placeholder={t.contacts.contactSearchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
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
      <div className="px-2 sm:px-6 pb-4 sm:pb-6 max-h-[70vh] overflow-y-auto space-y-3 sm:space-y-4">
        {loading ? (
          <div className="text-center text-gray-400 py-8">{t.contacts.loading}</div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {contact.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{contact.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                      onClick={() => handleFineContact(contact)}
                    >
                      {t.pages.contacts.fine}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-10">
            <CardContent>
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
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

    {/* Modales */}
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
    <AddContactModal
      isOpen={isAddContactModalOpen}
      onClose={() => {
        setIsAddContactModalOpen(false);
        setEditingContact(null);
      }}
      onSubmit={async contactData => {
        try {
          await addContact({ ...contactData, status: "active", avatar: "/placeholder.svg" });
          toast({
            title: t.pages.contacts.contactAdded,
            description: t.contacts.addedContactConfirmed,
          });
        } catch (err: any) {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      }}
      editingContact={editingContact}
    />
  </div>
  );
}
