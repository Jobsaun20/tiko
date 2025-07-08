import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

// Definición del tipo UserProfile
export type UserProfile = {
  id: string;
  email?: string;
  name?: string;
  username?: string;
  avatar_url?: string;
  phone?: string;
  level?: number;
  xp?: number;
  badges?: any[];
  groups?: any[];
  achievements?: any[];
  fines?: any[];
  totalSent?: number;
  totalReceived?: number;
  totalPaid?: number;
  totalEarned?: number;
  contacts?: any[];
  // Agrega aquí otros campos personalizados si los necesitas
};

type UpdateProfileResult = {
  error: string | null;
};

export function useUserProfile() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Recargar el perfil del usuario desde la BD
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setProfile(null);
    } else if (!data) {
      // Si no hay perfil, crea uno por defecto en el frontend (opcional: crea también en la BD)
      const defaultProfile: UserProfile = {
        id: user.id,
        email: user.email,
        name: "",
        username: "",
        avatar_url: "",
        phone: "",
        level: 1,
        xp: 0,
        badges: [],
        groups: [],
        achievements: [],
        fines: [],
        totalSent: 0,
        totalReceived: 0,
        totalPaid: 0,
        totalEarned: 0,
      };
      setProfile(defaultProfile);
      setError(null);
      // Si quieres crear en la BD: await supabase.from("users").insert([defaultProfile]);
    } else {
      setProfile(data);
      setError(null);
    }
    setLoading(false);
  }, [user]);

  // Recargar el perfil cada vez que cambia el usuario (login/logout)
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Actualizar el perfil y refrescar datos desde la BD
  async function updateProfile(fields: Partial<UserProfile>): Promise<UpdateProfileResult> {
    if (!user) return { error: "No hay usuario logueado" };
    setLoading(true);

    // Actualiza la base de datos
    const { error } = await supabase
      .from("users")
      .update(fields)
      .eq("id", user.id);

    // Refresca siempre el perfil tras update
    await fetchProfile();
    setLoading(false);

    // Devuelve el resultado como objeto con error o null
    return { error: error ? error.message : null };
  }

  return { profile, setProfile, loading, error, updateProfile, fetchProfile };
}
