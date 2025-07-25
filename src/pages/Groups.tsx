import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  ArrowLeft,
  Trash2,
  Crown,
  Edit,
  UserMinus,
  Hourglass,
} from "lucide-react";
import { Header } from "@/components/Header";
import { CreateGroupModal } from "@/components/CreateGroupModal";
import { AddGroupMemberModal } from "@/components/AddGroupMemberModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useContacts } from "@/hooks/useContacts";
import { EditGroupModal } from "@/contexts/EditGroupModal";
import { GroupRulesModal } from "@/components/GroupRulesModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreateFineModal } from "@/components/CreateFineModal";

// BADGES
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { checkAndAwardBadge } from "@/utils/checkAndAwardBadge";
import { useAuthContext } from "@/contexts/AuthContext";

// Fallback por si no hay avatar (URL o base64)
const DEFAULT_GROUP_AVATAR = "https://ui-avatars.com/api/?background=6552F5&color=fff&name=GR";

// URL de tu edge function badges (usa la misma que en Contacts)
const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";


export default function Groups() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { showBadges } = useBadgeModal();
  const { user: userAuth, session } = useAuthContext();
  const {
    groups,
    loading,
    addGroup,
    deleteGroup,
    leaveGroup,
    editGroup,
    removeMemberFromGroup,
    addMemberToGroup,
  } = useGroups();
  const { profile: user } = useUserProfile();
  const { contacts } = useContacts();

  // Modales y popovers
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [editGroupData, setEditGroupData] = useState<any>(null);
  const [openRulesGroupId, setOpenRulesGroupId] = useState<string | null>(null);

  // Para agregar miembro desde edición
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Popover y multa
  const [selectedPopover, setSelectedPopover] = useState<{ userId: string, groupId: string } | null>(null);
  const [isCreateFineModalOpen, setIsCreateFineModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  // Modal handlers
  const handleCreateGroup = () => setIsCreateGroupModalOpen(true);

  // BADGE: CREAR GRUPO
  const handleSubmitGroup = async (groupData: any) => {
  if (!user) {
    toast({ title: "Error", description: t.groups.notIdentifiedUser, variant: "destructive" });
    return;
  }
  try {
    // 1. Crear grupo
    const newGroup = await addGroup({
      name: groupData.name,
      description: groupData.description,
    });

    setIsCreateGroupModalOpen(false);
    toast({
      title: t.pages.groups.groupCreated,
      description: `${t.groups.theGroup} "${groupData.name}" ${t.groups.createdSuccessfully}`,
    });

    // --- Chequear insignias Edge Function ---
    if (userAuth && session?.access_token && newGroup) {
      const response = await fetch(CHECK_BADGES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session.access_token,
        },
        body: JSON.stringify({
          user_id: userAuth.id,
          action: "group_create", // tu key de badge para crear grupo
          action_data: {
            group_id: newGroup.id,
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
};
  const handleLeaveGroup = async (groupId: string) => {
    try {
      await leaveGroup(groupId);
      toast({
        title: t.pages.groups.leftGroup,
        description: t.groups.letTheGroup,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await deleteGroup(groupId);
      toast({
        title: t.pages.groups.groupDeleted,
        description: t.groups.groupDeleted,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleEditGroup = (group: any) => setEditGroupData(group);

  const handleSaveEditGroup = async (changes: any) => {
    if (!editGroupData) return;
    try {
      await editGroup(editGroupData.id, changes);
      toast({
        title: t.groups.updatedGroup,
        description: t.groups.savedCorrectly,
      });
      setEditGroupData(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleRemoveMember = async (groupId: string, userId: string) => {
    try {
      await removeMemberFromGroup(groupId, userId);
      toast({
        title: t.groups.deletedMember,
        description: t.groups.deletedMemberDescription,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // BADGE: AGREGAR MIEMBRO
  const handleSubmitAddMember = async (selectedUserId: string) => {
  if (!selectedGroupId) return;
  try {
    const result = await addMemberToGroup(selectedGroupId, selectedUserId, "member");
    toast({
      title: t.groups.memberAdded,
      description: t.groups.memberAddedDescription,
    });

    // Chequear badge por añadir miembro
    if (userAuth && session?.access_token) {
      const response = await fetch(CHECK_BADGES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session.access_token,
        },
        body: JSON.stringify({
          user_id: userAuth.id,
          action: "add_group_member", // tu key de badge para añadir miembro
          action_data: {
            group_id: selectedGroupId,
            new_member_id: selectedUserId,
            lang: language || "es",
          },
        }),
      });
      const resultBadge = await response.json();
      if (resultBadge?.newlyEarned?.length > 0) {
        showBadges(resultBadge.newlyEarned, language);
      }
    }

  } catch (err: any) {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  }
  setShowAddMemberModal(false);
  setSelectedGroupId(null);
};

  // Agregar miembro desde edición
  const handleAddMember = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowAddMemberModal(true);
  };

  // Encuentra el contacto real (user_supabase_id debe coincidir con el id del miembro)
  const getContactFromMember = (member: any) =>
    contacts.find((c: any) => c.user_supabase_id === member.id);

  // Popover handlers usando userId+groupId
  const handleOpenSendFinePopover = (member: any, group: any) =>
    setSelectedPopover({ userId: member.id, groupId: group.id });
  const handleCloseSendFinePopover = () => setSelectedPopover(null);

  // Abre el modal de multa
  const handleSendFine = (member: any, group: any) => {
    const contact = getContactFromMember(member);
    if (!contact) {
      toast({
        title: "Error",
        description: t.groups.contactNotFounError,
        variant: "destructive",
      });
      return;
    }
    setSelectedContact({ ...contact, group }); // Incluimos el grupo para el onSubmit
    setIsCreateFineModalOpen(true);
  };

  // CREAR LA MULTA REALMENTE EN SUPABASE (asegúrate recipient_id es el user_supabase_id)
  const handleCreateFine = async (fine: any) => {
    if (!selectedContact?.group?.id) {
      toast({ title: "Error", description: t.groups.groupNotFound, variant: "destructive" });
      return;
    }
    // recipient_id debe ser siempre el user_supabase_id
    const recipientUserId = selectedContact.user_supabase_id;
    if (!recipientUserId) {
      toast({ title: "Error", description: t.groups.notDeterminedUser, variant: "destructive" });
      return;
    }
    // --- OJO: Aquí agregamos el número de teléfono del emisor
    const senderPhone = user?.phone || "";
    const { error } = await supabase.from("fines").insert([
      {
        ...fine,
        group_id: selectedContact.group.id,
        sender_id: user?.id,
        sender_phone: senderPhone,   // <<--- ESTA LÍNEA AGREGA EL TELÉFONO DEL EMISOR
        created_at: new Date(),
        recipient_id: recipientUserId,
      },
    ]);
    if (error) {
      toast({ title: "Error", description: t.groups.createFineError + error.message, variant: "destructive" });
    } else {
      toast({ title: t.groups.fineCreated, description: t.groups.fineSent });
    }
    setIsCreateFineModalOpen(false);
    setSelectedContact(null);
  };

  // FUNCION PARA RENDERIZAR AVATAR DE GRUPO (Base64 o URL o fallback)
  const renderGroupAvatar = (group: any) => {
  const avatar = group.avatar || "";
  const hasImage =
    avatar.startsWith("http") || avatar.startsWith("data:image");

  return (
    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
      {hasImage && (
        <AvatarImage
          src={avatar}
          alt={group.name}
        />
      )}
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold">
        {group.name?.charAt(0)?.toUpperCase() || "G"}
      </AvatarFallback>
    </Avatar>
  );
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="w-full px-2 sm:px-4 py-4 max-w-3xl mx-auto">
        {/* Back Button for mobile */}
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
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Users className="h-7 w-7 sm:h-8 sm:w-8" />
            {t.pages.groups.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">{t.pages.groups.description}</p>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            onClick={handleCreateGroup}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.pages.groups.createGroup}
          </Button>
        </div>
        {/* Groups List */}
        <div className="flex flex-col gap-6 w-full">
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t.contacts.loading}</div>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow w-full max-w-full">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3 w-full">
                      {/* Aquí se muestra el avatar real */}
                      {renderGroupAvatar(group)}
                      <div className="min-w-0">
                        <CardTitle className="flex items-center gap-2 truncate">
                          {group.name}
                          {group.role === "admin" && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <Badge variant={group.role === "admin" ? "default" : "secondary"}>
                        {group.role === "admin"
                          ? t.pages.groups.admin
                          : t.pages.groups.member}
                      </Badge>
                      <div className="flex gap-2">
                        {group.role === "admin" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditGroup(group)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteGroup(group.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => setOpenRulesGroupId(group.id)}
                        >
                          <Hourglass className="h-4 w-4" />
                          {t.groups.rules}
                        </Button>
                        {group.role !== "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLeaveGroup(group.id)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-3 text-sm sm:text-base">
                      {t.groups.members} ({group.members.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {group.members.map((member: any) => (
                        <Popover
                          key={member.id + group.id}
                          open={
                            selectedPopover?.userId === member.id &&
                            selectedPopover?.groupId === group.id
                          }
                          onOpenChange={(open) =>
                            open
                              ? handleOpenSendFinePopover(member, group)
                              : handleCloseSendFinePopover()
                          }
                        >
                          <PopoverTrigger asChild>
                            <div
                              className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1 max-w-[90vw] cursor-pointer transition-all hover:shadow-md"
                              tabIndex={0}
                              role="button"
                              onClick={() => handleOpenSendFinePopover(member, group)}
                            >
                              <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                  {member.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs sm:text-sm truncate">{member.name}</span>
                              {member.role === "admin" && (
                                <Crown className="h-3 w-3 text-yellow-500" />
                              )}
                            </div>
                          </PopoverTrigger>
                          <PopoverContent align="center" side="top" className="w-40 p-2">
                            <Button
                              className="w-full"
                              size="sm"
                              onClick={() => {
                                handleSendFine(member, group);
                                handleCloseSendFinePopover();
                              }}
                            >
                              {t.groups.sendFine}
                            </Button>
                          </PopoverContent>
                        </Popover>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {t.pages.groups.noGroups}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t.groups.createGroupToStart}
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    onClick={handleCreateGroup}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.pages.groups.createGroup}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de creación de grupo */}
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSubmit={handleSubmitGroup}
      />

      {/* Modal para agregar miembro desde edición */}
      <AddGroupMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSubmit={handleSubmitAddMember}
        contacts={contacts}
      />

      {/* Modal de edición de grupo */}
      {editGroupData && (
        <EditGroupModal
          isOpen={!!editGroupData}
          group={editGroupData}
          onClose={() => setEditGroupData(null)}
          onSave={handleSaveEditGroup}
          isAdmin={editGroupData.role === "admin"}
          onAddMember={() => handleAddMember(editGroupData.id)}
          onRemoveMember={handleRemoveMember}
          currentUserId={user?.id}
        />
      )}

      {/* Modal de reglas de grupo */}
      {openRulesGroupId && (
        <GroupRulesModal
          isOpen={!!openRulesGroupId}
          onClose={() => setOpenRulesGroupId(null)}
          group={groups.find(g => g.id === openRulesGroupId)!}
        />
      )}

      {/* Modal de enviar multa */}
      <CreateFineModal
        isOpen={isCreateFineModalOpen}
        onClose={() => {
          setIsCreateFineModalOpen(false);
          setSelectedContact(null);
        }}
        preselectedContact={selectedContact}
        contacts={contacts}
        currentUser={{
          id: user?.id ?? "",
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
        }}
        currentUserUsername={user?.name ?? ""}
        onSubmit={handleCreateFine}
      />
    </div>
  );
}
