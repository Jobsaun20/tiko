import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Plus,
  Trash2,
  Crown,
  Edit,
  UserMinus,
  Hourglass,
  MoreVertical,
  Gavel
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
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { useFines } from "@/hooks/useFines";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CHECK_BADGES_URL = "https://psnxdeykxselxxtvlgzb.supabase.co/functions/v1/check_badges";

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

  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [editGroupData, setEditGroupData] = useState<any>(null);
  const [openRulesGroupId, setOpenRulesGroupId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedPopover, setSelectedPopover] = useState<{ userId: string, groupId: string } | null>(null);
  const [isCreateFineModalOpen, setIsCreateFineModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [groupToDelete, setGroupToDelete] = useState<any>(null);
  const [openOptionsPopoverId, setOpenOptionsPopoverId] = useState<string | null>(null);
  const [openMembersPopoverId, setOpenMembersPopoverId] = useState<string | null>(null);
const { createFine } = useFines();

  // Modal handlers
  const handleCreateGroup = () => setIsCreateGroupModalOpen(true);

  // BADGE: CREAR GRUPO
  const handleSubmitGroup = async (groupData: any) => {
    if (!user) {
      toast({ title: "Error", description: t.groups.notIdentifiedUser, variant: "destructive" });
      return;
    }
    try {
      const newGroup = await addGroup({
        name: groupData.name,
        description: groupData.description,
      });

      setIsCreateGroupModalOpen(false);
      toast({
        title: t.pages.groups.groupCreated,
        description: `${t.groups.theGroup} "${groupData.name}" ${t.groups.createdSuccessfully}`,
      });

      if (userAuth && session?.access_token && newGroup) {
        const response = await fetch(CHECK_BADGES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.access_token,
          },
          body: JSON.stringify({
            user_id: userAuth.id,
            action: "group_create",
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

  const handleSubmitAddMember = async (selectedUserId: string) => {
    if (!selectedGroupId) return;
    try {
      await addMemberToGroup(selectedGroupId, selectedUserId, "member");
      toast({
        title: t.groups.memberAdded,
        description: t.groups.memberAddedDescription,
      });

      if (userAuth && session?.access_token) {
        const response = await fetch(CHECK_BADGES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.access_token,
          },
          body: JSON.stringify({
            user_id: userAuth.id,
            action: "add_group_member",
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

  const handleAddMember = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowAddMemberModal(true);
  };

  // -------------- MULTA: LOGICA NUEVA E IDENTICA A CONTACTS ------------------

  // Buscar el contacto a partir del miembro (igual que en contacts)
  const getContactFromMember = (member: any) =>
    contacts.find((c: any) => c.user_supabase_id === member.id);

  // Abrir modal de multa con el contacto y grupo preseleccionados
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
    // Pasa el grupo también para incluir el nombre en el insert
    setSelectedContact({ ...contact, group });
    setIsCreateFineModalOpen(true);
  };

  // Insertar la multa igual que en contacts
  const handleCreateFine = async (fineData: any) => {
  try {
    if (!selectedContact?.group?.id) {
      toast({ title: "Error", description: t.groups.groupNotFound, variant: "destructive" });
      return;
    }
    const recipientUserId = selectedContact.user_supabase_id;
    if (!recipientUserId) {
      toast({ title: "Error", description: t.groups.notDeterminedUser, variant: "destructive" });
      return;
    }
    const recipient_name = selectedContact.name || selectedContact.username || selectedContact.email || "";
    const recipient_email = selectedContact.email || "";
    const sender_name = user?.username || user?.name || user?.email || "";
    const sender_phone = user?.phone || "";

    // ⬇️ Usa el hook, NO inserción directa
    await createFine({
  reason: fineData.reason,
  amount: parseFloat(fineData.amount),
  recipient_id: recipientUserId,
  recipient_name,
  recipient_email,
  sender_name,
  sender_phone,
   group_id: selectedContact.group.id,
  type: "sent",
});


    toast({
      title: t.createFine?.created || t.groups.fineCreated,
      description:
        (t.createFine?.sentTo || t.groups.fineSent)
          .replace("{amount}", String(fineData.amount))
          .replace("{recipient}", recipient_name)
    });
  } catch (err: any) {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  }
  setIsCreateFineModalOpen(false);
  setSelectedContact(null);
};


  // --------------------------------------------------------------------------

  // Avatar de grupo
  const renderGroupAvatar = (group: any) => {
    const avatar = group.avatar || "";
    const hasImage = avatar.startsWith("http") || avatar.startsWith("data:image");
    return (
      <div className="relative h-12 w-12">
        <Avatar className="h-12 w-12 bg-[#F6F2FB] text-purple-400 rounded-xl flex items-center justify-center text-2xl border border-gray-200">
          {hasImage ? (
            <AvatarImage src={avatar} alt={group.name} />
          ) : (
            <AvatarFallback>
              <Users className="h-8 w-8" />
            </AvatarFallback>
          )}
        </Avatar>
        {group.role === "admin" && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 flex items-center justify-center shadow-md">
            <Crown className="h-4 w-4 text-white" />
          </span>
        )}
      </div>
    );
  };

  // Avatares miembros: Popover, botón Multa menos para ti
  const renderMembersAvatars = (members: any[], groupId: string, group: any) => {
    const maxToShow = 3;
    const visible = members.slice(0, maxToShow);
    const moreCount = members.length - maxToShow;

    return (
      <Popover
        open={openMembersPopoverId === groupId}
        onOpenChange={open => setOpenMembersPopoverId(open ? groupId : null)}
      >
        <PopoverTrigger asChild>
          <div className="flex items-center cursor-pointer" title={t.groups.showMembers || "Mostrar miembros"}>
            {visible.map((m) => {
              const hasAvatar = m.avatar && (m.avatar.startsWith("http") || m.avatar.startsWith("data:image"));
              return (
                <Avatar
                  key={m.id}
                  className="h-8 w-8 -ml-2 first:ml-0 border-2 border-white bg-gradient-to-r from-blue-500 to-purple-500"
                >
                  {hasAvatar ? (
                    <AvatarImage src={m.avatar} alt={m.name} />
                  ) : (
                    <AvatarFallback className="bg-[#52aeb9] text-white font-bold">
                      {(m.name || m.username || "").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              );
            })}
            {moreCount > 0 && (
              <span className="ml-2 text-xs font-medium text-gray-600">+{moreCount}</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-3 rounded-xl shadow-lg">
          <div className="font-bold mb-2 text-sm text-gray-700">{t.groups.members || "Miembros del grupo"}</div>
          <ul className="space-y-2">
            {members.map(member => (
              <li key={member.id} className="flex items-center gap-3">
                <Avatar className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500">
                  <AvatarImage src={member.avatar} alt={member.username || "Avatar"} />
                  <AvatarFallback className="bg-[#52AEB9] text-white font-semibold">
                    {(member.username?.[0] || member.name?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="truncate font-medium text-gray-800 flex-1">
                  {member.username || member.name}
                </span>
                {member.id !== user?.id && (
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow px-2 max-w-[92px] min-w-[80px]"
                    onClick={() => {
                      setOpenMembersPopoverId(null);
                      handleSendFine(member, group);
                    }}
                  >
                    {t.pages.contacts?.fine || t.paymentModal?.fine || "Multa"}
                  </Button>
                )}
                {member.id === user?.id && (
                  <span className="text-[11px] text-gray-400 ml-1">({t.paymentModal?.you})</span>
                )}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="w-full max-w-[340px] mx-auto px-2 py-4">
        {/* Título, descripción y crear grupo */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Users className="h-7 w-7 sm:h-8 sm:w-8" />
            {t.pages.groups.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">{t.pages.groups.description}</p>
          <div className="mt-3">
            <Button
              onClick={handleCreateGroup}
              className="w-full max-w-[320px] mx-auto flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-[#72bfc4] to-[#57b8c9] shadow-md gap-4"
              style={{ minHeight: 48 }}
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#7fcad1]/60">
                <Plus className="w-6 h-6 text-white" />
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="font-bold text-white text-base">
                  {t.pages.groups.createGroup}
                </span>
              </span>
            </Button>
          </div>
        </div>
        {/* Lista de grupos */}
        <div className="flex flex-col gap-6 w-full">
          {loading ? (
            <div className="text-center text-gray-400 py-8">{t.contacts.loading}</div>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <Card
                key={group.id}
                className="rounded-2xl border border-gray-100 shadow-sm bg-white p-0 relative"
              >
                {/* Botón reglas arriba derecha */}
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute right-4 top-4 z-10"
                  onClick={() => setOpenRulesGroupId(group.id)}
                >
                  <Hourglass className="h-5 w-5 text-gray-500" />
                </Button>

                <CardContent className="flex flex-col gap-2 pt-7 pb-4 pl-6 pr-6">
                  <div className="flex gap-4 items-center mb-1">
                    {renderGroupAvatar(group)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="font-bold text-base truncate text-gray-900">{group.name}</span>
                      </div>
                      <div className="text-gray-600 text-sm truncate">{group.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {/* --- AVATARES CON POPOVER Y MULTA --- */}
                    {renderMembersAvatars(group.members, group.id, group)}
                    <span className="ml-3 text-xs text-gray-500">{group.members.length} {t.groups.members}</span>
                  </div>
                  {/* Botón opciones abajo derecha */}
                  <Popover
                    open={openOptionsPopoverId === group.id}
                    onOpenChange={open => setOpenOptionsPopoverId(open ? group.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="ghost" className="absolute right-4 bottom-4 z-10">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-40 p-2">
                      <div className="flex flex-col gap-2">
                        {group.role === "admin" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full flex items-center gap-2"
                              onClick={() => {
                                setOpenOptionsPopoverId(null);
                                handleEditGroup(group);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              {t.groups.edit}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full flex items-center gap-2"
                              onClick={() => {
                                setOpenOptionsPopoverId(null);
                                setGroupToDelete(group);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              {t.groups.delete}
                            </Button>
                          </>
                        )}
                        {group.role !== "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center gap-2"
                            onClick={() => {
                              setOpenOptionsPopoverId(null);
                              handleLeaveGroup(group.id);
                            }}
                          >
                            <UserMinus className="h-4 w-4" />
                            {t.groups.leave}
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
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
                    className="bg-gradient-to-r from-[#72bfc4] to-[#57b8c9] shadow-md"
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
      {/* MODALES igual que siempre */}
      <AlertDialog open={!!groupToDelete} onOpenChange={open => !open && setGroupToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t.groups.confirmDeleteTitle || "¿Eliminar grupo?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.groups.confirmDeleteDescription ||
                `¿Estás seguro de que deseas eliminar el grupo? Esta acción no se puede deshacer.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGroupToDelete(null)}>
              {t.common.cancel || "Cancelar"}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white"
              onClick={async () => {
                await handleDeleteGroup(groupToDelete.id);
                setGroupToDelete(null);
              }}
            >
              {t.common.delete || "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSubmit={handleSubmitGroup}
      />
      <AddGroupMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSubmit={handleSubmitAddMember}
        contacts={contacts}
      />
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
      {openRulesGroupId && (
        <GroupRulesModal
          isOpen={!!openRulesGroupId}
          onClose={() => setOpenRulesGroupId(null)}
          group={groups.find(g => g.id === openRulesGroupId)!}
        />
      )}
      <CreateFineModal
        isOpen={isCreateFineModalOpen}
        onClose={() => {
          setIsCreateFineModalOpen(false);
          setSelectedContact(null);
        }}
        preselectedContact={selectedContact}
        contacts={contacts}
        currentUser={user}
        currentUserUsername={user?.username ?? user?.name ?? ""}
        onSubmit={handleCreateFine}
      />
    </div>
  );
}
