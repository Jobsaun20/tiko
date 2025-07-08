import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

export interface GroupMember {
  id: string;
  name: string;
  role: "admin" | "member";
  avatar?: string;
}
export interface Group {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  members: GroupMember[];
  role: "admin" | "member";
  totalFines: number;
  pendingFines: number;
}

// NUEVO tipo solo con name y description
type NewGroupInput = {
  name: string;
  description?: string;
};

export function useGroups() {
  const { user } = useAuthContext();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase
      .from("groups")
      .select("*")
      .contains("members", [{ id: user.id }])
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setGroups(data || []);
        setLoading(false);
      });
  }, [user]);

  // <<<--- SOLO name y description, el resto lo añade el hook
  async function addGroup(group: NewGroupInput) {
    if (!user) throw new Error("Usuario no autenticado");
    const userName = user.user_metadata?.name || user.email;
    const userAvatar = user.user_metadata?.avatar_url || "";

    const newGroup = {
      ...group,
      user_id: user.id,
      members: [
        {
          id: user.id,
          name: userName,
          role: "admin",
          avatar: userAvatar,
        },
      ],
      role: "admin",
      totalFines: 0,
      pendingFines: 0,
    };
    const { data, error } = await supabase.from("groups").insert([newGroup]).select().maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("No se pudo crear el grupo.");
    setGroups((prev) => [...prev, data]);
    return data;
  }

  async function deleteGroup(groupId: string) {
    const { error } = await supabase.from("groups").delete().eq("id", groupId);
    if (error) throw new Error(error.message);
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }

  async function leaveGroup(groupId: string) {
    if (!user) throw new Error("Usuario no autenticado");
    const { data, error } = await supabase.from("groups").select("*").eq("id", groupId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error("No se encontró el grupo");
    const newMembers = (data.members || []).filter((m: any) => m.id !== user.id);
    if (newMembers.length === 0) {
      await deleteGroup(groupId);
    } else {
      await supabase.from("groups").update({ members: newMembers }).eq("id", groupId);
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    }
  }

  return { groups, loading, error, addGroup, deleteGroup, leaveGroup };
}
