import { getSupabaseFunctionUrl } from "@/utils/getSupabaseFunctionUrl";
import { Badge } from "@/types/badge"; // Usa siempre el tipo centralizado

export async function checkAndAwardBadge(
  userId: string,
  actionKey: string,
  actionData: any = {},
  accessToken: string,
  lang: string = "es" // idioma por defecto
): Promise<Badge[] | null> {
  const url = getSupabaseFunctionUrl("check_badges");

  // Añade lang al action_data
  const body = {
    user_id: userId,
    action: actionKey,
    action_data: { ...actionData, lang }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("[checkAndAwardBadge] Error en la respuesta:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data?.newlyEarned || [];
}
