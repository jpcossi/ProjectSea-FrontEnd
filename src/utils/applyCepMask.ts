export function applyCepMask(cep?: string) {
  if (!cep) {
    return "";
  }
  return cep
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{3})/, "$1-$2");
}
