import { supabase } from "@/supabaseClient";
import { getSupabaseFunctionUrl } from "@/utils/getSupabaseFunctionUrl";

export async function checkAndAwardBadge(
  userId: string,
  actionKey: string,
  actionData: any = {},
  accessToken: string
) {
  // Usar función dinámica para el endpoint
  const url = getSupabaseFunctionUrl("check_badges");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      action: actionKey,
      action_data: actionData,
    }),
  });

  if (!res.ok) return null;
  const { newlyEarned } = await res.json();
  return newlyEarned || [];
}
