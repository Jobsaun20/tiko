import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";

export function useUserProfile() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Buscar el perfil, usando maybeSingle para evitar errores 406
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
        setProfile(null);
      } else if (!data) {
        // No hay perfil (usuario nuevo): crea un objeto por defecto
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

        // Si quieres crear el perfil en la base de datos al vuelo:
        // await supabase.from("users").insert([defaultProfile]);
      } else {
        setProfile(data);
        setError(null);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  // Permite actualizar el perfil (incluye suma de XP si se desea)
  async function updateProfile(fields: any) {
    if (!user) return;
    setLoading(true);

    // Si los campos incluyen suma de XP, calcula el nuevo XP
    let updatedFields = { ...fields };
    if (fields.xp !== undefined && profile && typeof fields.xp === "number") {
      updatedFields.xp = fields.xp;
    }

    const { error } = await supabase
      .from("users")
      .update(updatedFields)
      .eq("id", user.id);

    if (error) setError(error.message);

    // Vuelve a buscar el perfil actualizado, usando maybeSingle
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(data || null);
    setLoading(false);
  }

  // Devuelve también setProfile por si quieres feedback instantáneo en el cliente
  return { profile, setProfile, loading, error, updateProfile };
}
