// src/types/badge.ts

export interface Badge {
  id: string;
  key?: string; // opcional, si lo usas para lógica interna
  icon: string; // emoji o url del icono
  name: Record<string, string>; // ejemplo: { es: "Nombre", en: "Name", de: "Name" }
  description: Record<string, string>; // ejemplo: { es: "Desc.", en: "Desc.", de: "Desc." }
  xp_reward?: number; // experiencia otorgada al desbloquear
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'; // opcional
}
