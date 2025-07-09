import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  ArrowLeft,
  Settings,
  UserMinus,
  Trash2,
  Crown,
  UserPlus
} from "lucide-react";
import { Header } from "@/components/Header";
import { CreateGroupModal } from "@/components/CreateGroupModal";
import { AddGroupMemberModal } from "@/components/AddGroupMemberModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useGroups } from "@/hooks/useGroups";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useContacts } from "@/hooks/useContacts";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Groups() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    groups,
    loading,
    error,
    addGroup,
    deleteGroup,
    leaveGroup,
    addMemberToGroup,
  } = useGroups();
  const { profile: user } = useUserProfile();
  const { contacts } = useContacts();

  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Dialog de confirmación de borrado
  const [confirmDelete, setConfirmDelete] = useState<null | string>(null);

  // Handler para agregar miembro a un grupo
  const handleAddMember = (groupId: string) => {
    setSelectedGroupId(groupId);
    setShowAddMemberModal(true);
  };

  // Handler para el modal de agregar miembro
  const handleSubmitAddMember = async (selectedUserId: string) => {
    if (!selectedGroupId) return;
    try {
      await addMemberToGroup(selectedGroupId, selectedUserId, "member");
      toast({
        title: "Integrante agregado",
        description: "El nuevo miembro ha sido añadido correctamente.",
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setShowAddMemberModal(false);
    setSelectedGroupId(null);
  };

  const handleCreateGroup = () => setIsCreateGroupModalOpen(true);

  const handleSubmitGroup = async (groupData: any) => {
    if (!user) {
      toast({ title: "Error", description: "Usuario no identificado.", variant: "destructive" });
      return;
    }
    try {
      await addGroup({
        name: groupData.name,
        description: groupData.description,
      });
      setIsCreateGroupModalOpen(false);
      toast({
        title: t.pages.groups.groupCreated,
        description: `El grupo "${groupData.name}" ha sido creado exitosamente`,
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleJoinGroup = () => {
    toast({
      title: "Función próximamente",
      description: "La función de unirse a grupos estará disponible pronto.",
    });
  };

  const handleGroupSettings = (groupId: string) => {
    toast({
      title: "Función próximamente",
      description: "La configuración de grupos estará disponible pronto.",
    });
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      await leaveGroup(groupId);
      toast({
        title: t.pages.groups.leftGroup,
        description: "Has abandonado el grupo correctamente.",
      });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // 1. Lanza confirmación (solo admin puede ver botón y lanzar esto)
  const launchDeleteConfirm = (groupId: string) => {
    setConfirmDelete(groupId);
  };

  // 2. Ejecuta el borrado tras confirmación
  const handleDeleteGroup = async () => {
    if (!confirmDelete) return;
    try {
      await deleteGroup(confirmDelete);
      toast({
        title: t.pages.groups.groupDeleted,
        description: "El grupo ha sido eliminado correctamente.",
      });
      setConfirmDelete(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  // Filtra contactos que NO están en el grupo actual
  const getAvailableContacts = (groupMembers: any[]) => {
    return contacts.filter(
      (c) => !groupMembers.some((m: any) => m.id === c.id)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-6">
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
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Users className="h-8 w-8" />
            {t.pages.groups.title}
          </h1>
          <p className="text-gray-600">{t.pages.groups.description}</p>
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
          <Button variant="outline" onClick={handleJoinGroup}>
            <Users className="h-4 w-4 mr-2" />
            {t.pages.groups.joinGroup}
          </Button>
        </div>
        {/* Groups List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-gray-400 py-8">Cargando...</div>
          ) : groups.length > 0 ? (
            groups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {group.name}
                          {group.role === "admin" && (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={group.role === "admin" ? "default" : "secondary"}>
                        {group.role === "admin"
                          ? t.pages.groups.admin
                          : t.pages.groups.member}
                      </Badge>
                      {group.role === "admin" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGroupSettings(group.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => launchDeleteConfirm(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
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
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {group.members.length}
                      </div>
                      <div className="text-sm text-gray-600">{t.pages.groups.members}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {group.totalFines}
                      </div>
                      <div className="text-sm text-gray-600">Total multas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {group.pendingFines}
                      </div>
                      <div className="text-sm text-gray-600">Pendientes</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Miembros:</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {group.members.slice(0, 5).map((member: any) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                              {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.name}</span>
                          {member.role === "admin" && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      ))}
                      {group.members.length > 5 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded-full px-3 py-1">
                          <span className="text-sm text-gray-600">
                            +{group.members.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* SOLO ADMIN puede agregar miembros */}
                    {group.role === "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleAddMember(group.id)}
                      >
                        <UserPlus className="h-4 w-4" />
                        Agregar miembro
                      </Button>
                    )}
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
                  Crea un grupo o únete a uno existente para empezar
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    onClick={handleCreateGroup}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.pages.groups.createGroup}
                  </Button>
                  <Button variant="outline" onClick={handleJoinGroup}>
                    <Users className="h-4 w-4 mr-2" />
                    {t.pages.groups.joinGroup}
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
      {/* Modal para agregar miembro */}
      <AddGroupMemberModal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        onSubmit={handleSubmitAddMember}
        contacts={
          selectedGroupId
            ? getAvailableContacts(
                groups.find((g) => g.id === selectedGroupId)?.members || []
              )
            : []
        }
      />
      {/* Dialog de confirmación de borrado */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro que deseas eliminar este grupo?</DialogTitle>
          </DialogHeader>
          <p className="mb-4 text-gray-700">
            Esta acción es irreversible. Solo los administradores pueden eliminar un grupo.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGroup}
            >
              Eliminar Grupo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
