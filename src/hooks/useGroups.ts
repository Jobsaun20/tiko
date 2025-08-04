import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { useLanguage } from "@/contexts/LanguageContext";
import locales from "@/locales"; // Si necesitas notificaciones localizadas
// URL del Edge Function de badges
const CHECK_BADGES_URL = "https://psnxdeykxselxxtvlgzb.supabase.co/functions/v1/check_badges";

// Tipos para miembros y grupos
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
  avatar?: string;
}

type NewGroupInput = {
  name: string;
  description?: string;
  avatar?: string;
};

export function useGroups() {
  const { user, session } = useAuthContext();
  const { showBadges } = useBadgeModal();
  const { language } = useLanguage();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- Cargar todos los grupos y sus miembros ----------
  async function fetchGroups() {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    // 1. Tus membresías
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

    // 2. IDs de todos los grupos
    const groupIds = memberships.map((m: any) => m.group_id);
    if (groupIds.length === 0) {
      setGroups([]);
      setLoading(false);
      return;
    }

    // 3. Todas las membresías de esos grupos
    const { data: allMemberships, error: err2 } = await supabase
      .from("memberships")
      .select("group_id, role, user_id")
      .in("group_id", groupIds);

    if (err2 || !allMemberships) {
      setError(err2?.message ?? "Error cargando miembros");
      setGroups([]);
      setLoading(false);
      return;
    }

    // 4. IDs únicos de usuarios
    const uniqueUserIds = Array.from(new Set(allMemberships.map((m: any) => m.user_id)));

    // 5. Datos de usuarios
    const { data: users, error: err3 } = await supabase
      .from("users")
      .select("id, username, name, email, avatar_url")
      .in("id", uniqueUserIds);

    if (err3 || !users) {
      setError(err3?.message ?? "Error cargando usuarios");
      setGroups([]);
      setLoading(false);
      return;
    }

    // 6. Relacionar membresías con usuario
    const membersByGroup: Record<string, GroupMember[]> = {};
    allMemberships.forEach((m: any) => {
      if (!membersByGroup[m.group_id]) membersByGroup[m.group_id] = [];
      const userData = users.find((u: any) => u.id === m.user_id);
      membersByGroup[m.group_id].push({
        id: userData?.id || m.user_id || "",
        name:
          (userData?.name?.trim() ||
            userData?.username?.trim() ||
            userData?.email?.trim() ||
            "Miembro"),
        role: m.role,
        avatar: userData?.avatar_url || "",
        email: userData?.email || "",
      });
    });

    // 7. Montar resultado final
    const result: Group[] = memberships.map((m: any) => ({
      id: m.group_id,
      name: m.groups?.name,
      description: m.groups?.description,
      admin_id: m.groups?.admin_id,
      avatar: m.groups?.avatar || "",
      members: membersByGroup[m.group_id] || [],
      role: m.role,
      totalFines: m.groups?.totalfines || 0,
      pendingFines: m.groups?.pendingfines || 0,
    }));

    setGroups(result);
    setLoading(false);
  }

  // Fetch al montar o cambiar usuario
  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, [user]);

  // ---------- Crear grupo ----------
  async function addGroup(group: NewGroupInput) {
    if (!user) throw new Error("Usuario no autenticado");

    const { data: groupData, error: err1 } = await supabase
      .from("groups")
      .insert([{ name: group.name, description: group.description, admin_id: user.id, avatar: group.avatar }])
      .select()
      .maybeSingle();

    if (err1 || !groupData) throw new Error(err1?.message || "Error creando grupo");

    // Buscar datos del usuario
    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("username, name, email, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !dbUser) throw new Error("No se pudo obtener datos del usuario actual");

    const userName = dbUser.name?.trim() || dbUser.username?.trim() || dbUser.email?.trim() || "Admin";
    const userAvatar = dbUser.avatar_url || "";
    const userEmail = dbUser.email || "";

    // Insertar membresía como admin
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

    // BADGES - Check y mostrar
    if (user && session?.access_token && groupData) {
      try {
        const resp = await fetch(CHECK_BADGES_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session.access_token,
          },
          body: JSON.stringify({
            user_id: user.id,
            action: "create_group",
            action_data: { lang: language || "es" },
          }),
        });
        const result = await resp.json();
        if (result?.newlyEarned?.length) {
          showBadges(result.newlyEarned, language);
        }
      } catch (err) {
        console.error("Error check_badges:", err);
      }
    }

    await fetchGroups();
    return groupData;
  }

  // ---------- Editar grupo ----------
  async function editGroup(
    groupId: string,
    changes: { name?: string; description?: string; avatar_url?: string }
  ) {
    // Cambia 'avatar_url' a 'avatar' para el update (según el nombre del campo en la base de datos)
    const updatePayload: any = {};

    if (changes.name !== undefined) updatePayload.name = changes.name;
    if (changes.description !== undefined) updatePayload.description = changes.description;
    // Admite avatar_url o avatar para máxima compatibilidad
    if (changes.avatar_url !== undefined) updatePayload.avatar = changes.avatar_url;
    if ((changes as any).avatar !== undefined) updatePayload.avatar = (changes as any).avatar;

    const { error } = await supabase
      .from("groups")
      .update(updatePayload)
      .eq("id", groupId);

    if (error) throw new Error(error.message);

    await fetchGroups();
  }

  // ---------- Eliminar grupo ----------
  async function deleteGroup(groupId: string) {
    const { error } = await supabase.from("groups").delete().eq("id", groupId);
    if (error) throw new Error(error.message);
    await fetchGroups();
  }

  // ---------- Abandonar grupo ----------
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

  // ---------- Añadir miembro ----------
  async function addMemberToGroup(
    groupId: string,
    newUserId: string,
    role: "member" | "admin" = "member"
  ) {
    // Comprobar si ya es miembro
    const { data: existing, error: fetchError } = await supabase
      .from("memberships")
      .select("*")
      .eq("group_id", groupId)
      .eq("user_id", newUserId)
      .maybeSingle();
    if (fetchError) throw new Error(fetchError.message);
    if (existing) throw new Error("El usuario ya es miembro de este grupo.");

    // Datos del usuario
    const { data: targetUser, error: userError } = await supabase
      .from("users")
      .select("username, name, email, avatar_url")
      .eq("id", newUserId)
      .maybeSingle();
    if (userError || !targetUser) throw new Error("No se pudo obtener el usuario a agregar.");

    const memberName = targetUser.name?.trim() || targetUser.username?.trim() || targetUser.email?.trim() || "Miembro";

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

  // ---------- Eliminar miembro de grupo ----------
  async function removeMemberFromGroup(groupId: string, userId: string) {
    const { error } = await supabase
      .from("memberships")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    await fetchGroups();
  }

  // ---------- Exporta funciones y datos ----------
  return {
    groups,
    loading,
    error,
    addGroup,
    editGroup,
    deleteGroup,
    leaveGroup,
    addMemberToGroup,
    removeMemberFromGroup,
  };
}
