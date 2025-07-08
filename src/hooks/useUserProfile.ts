import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

export function useUserProfile() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Función para recargar el perfil (puedes llamarla tras cualquier update si quieres refrescar al instante)
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
      // Si no hay perfil, crea uno por defecto (opcional: crea también en la BD)
      const defaultProfile = {
        id: user.id,
        email: user.email,
        name: "",
        avatar_url: "",
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

  // 2. Recarga el perfil cuando cambia el usuario (login/logout)
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 3. Función para actualizar el perfil y recargar (importante: mergea con estado actual)
  async function updateProfile(fields: any) {
    if (!user) return;
    setLoading(true);

    // Sumar XP si viene en fields.xp (opcional: mergear badges, etc.)
    let updatedFields = { ...fields };

    // Update DB
    const { error } = await supabase
      .from("users")
      .update(updatedFields)
      .eq("id", user.id);

    if (error) setError(error.message);

    // Refresca siempre el perfil tras update
    await fetchProfile();
    setLoading(false);
  }

  return { profile, setProfile, loading, error, updateProfile, fetchProfile };
}
