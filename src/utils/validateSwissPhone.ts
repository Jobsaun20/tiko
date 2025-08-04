// src/utils/validateSwissPhone.ts

export function isValidSwissPhone(phone: string): boolean {
  // Quitar espacios y guiones
  const cleaned = phone.replace(/[\s\-]/g, "");

  // España: +34XXXXXXXXX o 6XXXXXXXX o 7XXXXXXXX (solo móviles)
  return (
   
    // España
    /^(\+34)[67]\d{8}$/.test(cleaned) ||
    /^[67]\d{8}$/.test(cleaned)
  );
}

export function normalizeSwissPhone(phone: string): string {
  return phone.replace(/[\s\-]/g, "");
}
