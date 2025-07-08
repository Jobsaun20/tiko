// src/utils/getSupabaseFunctionUrl.ts

export function getSupabaseFunctionUrl(functionName: string): string {
  // Si estamos en local (localhost:3000 o :5173 o :8080 etc)
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  ) {
    // Cambia el puerto si tu supabase local está en otro
    return `http://localhost:8080/functions/v1/${functionName}`;
  }
  // En producción o preview
  return `https://pyecpkccpfeuittnccat.supabase.co/functions/v1/${functionName}`;
}
