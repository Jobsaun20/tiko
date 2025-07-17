// src/utils/checkAndAwardBadge.ts

import { getSupabaseFunctionUrl } from "@/utils/getSupabaseFunctionUrl";
import { Badge } from "@/types/badge"; // Usa siempre el tipo centralizado

/**
 * Llama a la función Edge check_badges para evaluar y otorgar insignias según la acción del usuario.
 *
 * @param userId      El ID del usuario (string)
 * @param actionKey   La clave de la acción realizada (ej: "pay_fine", "send_fine", etc)
 * @param actionData  Datos adicionales relevantes a la acción (opcional, objeto)
 * @param accessToken Token de acceso actual del usuario (string)
 * @param lang        Idioma preferido para las traducciones de las insignias (ej: "es", "en", "de", "fr", "it")
 * @returns           Array de nuevas insignias ganadas (Badge[]), o null si hay error
 */
export async function checkAndAwardBadge(
  userId: string,
  actionKey: string,
  actionData: any = {},
  accessToken: string,
  lang: string = "en" // Idioma por defecto (ajusta según tu público)
): Promise<Badge[] | null> {
  const url = getSupabaseFunctionUrl("check_badges");

  // Añade lang al action_data (el Edge Function lo usará para la traducción)
  const body = {
    user_id: userId,
    action: actionKey,
    action_data: { ...actionData, lang }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[checkAndAwardBadge] Error en la respuesta:", res.status, errText);
      return null;
    }

    const data = await res.json();
    // Devuelve las insignias recién ganadas o array vacío
    return data?.newlyEarned || [];
  } catch (err) {
    console.error("[checkAndAwardBadge] Error en fetch:", err);
    return null;
  }
}
