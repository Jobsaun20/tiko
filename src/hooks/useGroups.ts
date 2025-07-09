import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

export interface GroupMember {
  id: string;
  name: string;
  role: "admin" | "member";
  avatar?: string;
  email?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  admin_id: string;
  members: GroupMember[];
  role: "admin" | "member";
  totalFines: number;
  pendingFines: number;
}

type NewGroupInput = {
  name: string;
  description?: string;
};

export function useGroups() {
  const { user } = useAuthContext();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga los grupos y todos los miembros de cada grupo
  async function fetchGroups() {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    // 1. Busca los grupos donde el usuario actual es miembro
    const { data: memberships, error: err1 } = await supabase
      .from("memberships")
      .select("*, groups(*)")
      .eq("user_id", user.id);

    if (err1 || !memberships) {
      setError(err1?.message ?? "Error cargando membresías");
      setGroups([]);
      setLoading(false);
      return;
    }

    // 2. Saca los group_ids
    const groupIds = memberships.map((m: any) => m.group_id);
    if (groupIds.length === 0) {
      setGroups([]);
      setLoading(false);
      return;
    }

    // 3. Trae TODOS los miembros de cada grupo donde el usuario es miembro
    const { data: allMembers, error: err2 } = await supabase
      .from("memberships")
      .select("group_id, role, user_id, name, avatar, email")
      .in("group_id", groupIds);

    if (err2) {
      setError(err2.message);
      setGroups([]);
      setLoading(false);
      return;
    }

    // 4. Agrupa miembros por grupo
    const membersByGroup: Record<string, GroupMember[]> = {};
    allMembers?.forEach((m: any) => {
      if (!membersByGroup[m.group_id]) membersByGroup[m.group_id] = [];
      membersByGroup[m.group_id].push({
        id: m.user_id,
        name: m.name || "",
        role: m.role,
        avatar: m.avatar || "",
        email: m.email || "",
      });
    });

    // 5. Monta la estructura final con TODOS los miembros
    const result: Group[] = memberships.map((m: any) => ({
      id: m.group_id,
      name: m.groups?.name,
      description: m.groups?.description,
      admin_id: m.groups?.admin_id,
      members: membersByGroup[m.group_id] || [],
      role: m.role, // el rol de este usuario en este grupo
      totalFines: m.groups?.totalfines || 0,
      pendingFines: m.groups?.pendingfines || 0,
    }));

    setGroups(result);
    setLoading(false);
  }

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, [user]);

  async function addGroup(group: NewGroupInput) {
    if (!user) throw new Error("Usuario no autenticado");

    const { data: groupData, error: err1 } = await supabase
      .from("groups")
      .insert([{ name: group.name, description: group.description, admin_id: user.id }])
      .select()
      .maybeSingle();

    if (err1 || !groupData) throw new Error(err1?.message || "Error creando grupo");

    // Saca los datos reales del usuario (tabla users) para rellenar en memberships
    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("username, name, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !dbUser) throw new Error("No se pudo obtener datos del usuario actual");

    const userName = dbUser.username || dbUser.name || dbUser.email || "";
    const userAvatar = dbUser.avatar_url || "";
    const userEmail = dbUser.email || "";

    const { error: err2 } = await supabase
      .from("memberships")
      .insert([{
        group_id: groupData.id,
        user_id: user.id,
        role: "admin",
        name: userName,
        avatar: userAvatar,
        email: userEmail,
      }]);

    if (err2) throw new Error(err2.message);

    await fetchGroups();
    return groupData;
  }

  async function deleteGroup(groupId: string) {
    // Borra el grupo (ON DELETE CASCADE borra membresías)
    const { error } = await supabase.from("groups").delete().eq("id", groupId);

    if (error) {
      console.error("Error al eliminar grupo:", error.message);
      throw new Error(error.message);
    }

    await fetchGroups();
  }

  async function leaveGroup(groupId: string) {
    if (!user) throw new Error("Usuario no autenticado");
    const { error } = await supabase
      .from("memberships")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
    await fetchGroups();
  }

  /**
   * Añade un usuario registrado al grupo (copia sus datos en la membresía)
   * Debe recibir como newUserId el user.id real de supabase del usuario invitado
   */
  async function addMemberToGroup(
    groupId: string,
    newUserId: string,
    role: "member" | "admin" = "member"
  ) {
    // Verifica si ya es miembro
    const { data: existing, error: fetchError } = await supabase
      .from("memberships")
      .select("*")
      .eq("group_id", groupId)
      .eq("user_id", newUserId)
      .maybeSingle();

    if (fetchError) throw new Error(fetchError.message);
    if (existing) throw new Error("El usuario ya es miembro de este grupo.");

    // Busca los datos del usuario
    const { data: targetUser, error: userError } = await supabase
      .from("users")
      .select("username, name, email, avatar_url")
      .eq("id", newUserId)
      .maybeSingle();

    if (userError || !targetUser) throw new Error("No se pudo obtener el usuario a agregar.");

    const memberName = targetUser.username || targetUser.name || targetUser.email || "";

    const { error } = await supabase
      .from("memberships")
      .insert([{
        group_id: groupId,
        user_id: newUserId,
        role,
        name: memberName,
        avatar: targetUser.avatar_url || "",
        email: targetUser.email || "",
      }]);
    if (error) throw new Error(error.message);

    await fetchGroups();
  }

  return { groups, loading, error, addGroup, deleteGroup, leaveGroup, addMemberToGroup };
}
