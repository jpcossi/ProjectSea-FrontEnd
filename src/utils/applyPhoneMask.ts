export function applyPhoneMask(phone: string, type: string) {
  if (type === "Celular") {
    return phone
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      .slice(0, 15);
  } else if (type === "Residencial") {
    return phone
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
      .slice(0, 14);
  }
  return phone;
}
