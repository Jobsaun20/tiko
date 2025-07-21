import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabaseClient";
import { useAuthContext } from "@/contexts/AuthContext";
import { useBadgeModal } from "@/contexts/BadgeModalContext";
import { calculateLevel } from "@/utils/gamification";

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
};

type UpdateProfileResult = {
  error: string | null;
};

// URL Edge Function para chequear badges por XP/level
const CHECK_BADGES_URL = "https://pyecpkccpfeuittnccat.supabase.co/functions/v1/check_badges";

export function useUserProfile() {
  const { user, session } = useAuthContext();
  const { showBadges } = useBadgeModal();
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

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /**
   * Actualiza el perfil y otorga badge automáticamente si se sube XP/Level
   */
  async function updateProfile(fields: Partial<UserProfile>): Promise<UpdateProfileResult> {
    if (!user) return { error: "No hay usuario logueado" };
    setLoading(true);

    // Protección extra: nunca mandes username vacío (ni sobrescribas si no cambia)
    if ('username' in fields && (!fields.username || fields.username.trim() === "")) {
      delete fields.username;
    }

    // LOG PROFESIONAL DE ENTRADA
    console.log("[updateProfile] INICIO", {
      userId: user.id,
      fields,
      profileBefore: profile,
    });

    // 1. Guarda el XP anterior (para comparar si hay level up)
    const prevXp = profile?.xp || 0;
    const prevLevel = calculateLevel(prevXp);
    const nextXp = fields.xp !== undefined ? fields.xp : prevXp;
    const nextLevel = calculateLevel(nextXp);

    // 2. Actualiza en la BD
    const { error, data } = await supabase
      .from("users")
      .update(fields)
      .eq("id", user.id);

    // LOG DE RESPUESTA SUPABASE
    console.log("[updateProfile] RESULTADO update", {
      error,
      data,
      fields,
    });

    // 3. Lógica de badge XP/NIVEL
    try {
      if (!error && user && session?.access_token && fields.xp !== undefined) {
        if (nextLevel > prevLevel) {
          const response = await fetch(CHECK_BADGES_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + session.access_token,
            },
            body: JSON.stringify({
              user_id: user.id,
              action: "level_up",
              action_data: {
                xp: nextXp,
                prev_level: prevLevel,
                level: nextLevel,
                lang: "es",
              },
            }),
          });
          const result = await response.json();
          if (result?.newlyEarned?.length > 0) {
            showBadges(result.newlyEarned, "es");
          }
          // LOG extra de badges
          console.log("[updateProfile] BADGES result", result);
        }
      }
    } catch (err) {
      console.warn("[updateProfile] ERROR al chequear badges:", err);
    }

    await fetchProfile();
    setLoading(false);

    // LOG de perfil tras actualizar y recargar
    setTimeout(() => {
      console.log("[updateProfile] PROFILE after update", { profile });
    }, 500);

    return { error: error ? error.message : null };
  }

  return { profile, setProfile, loading, error, updateProfile, fetchProfile };
}
