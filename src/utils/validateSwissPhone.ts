// src/utils/validateSwissPhone.ts
export function isValidSwissPhone(phone: string): boolean {
  // Quitar espacios y guiones
  const cleaned = phone.replace(/[\s\-]/g, "");
  // Formatos permitidos: +41XXXXXXXXX o 07XXXXXXXX
  return (
    /^(\+41)[1-9]\d{8}$/.test(cleaned) ||
    /^(07[6-9])\d{7}$/.test(cleaned)
  );
}

export function normalizeSwissPhone(phone: string): string {
  return phone.replace(/[\s\-]/g, "");
}
