export function applyCpfMask(cpf?: string) {
  if (!cpf) {
    return "";
  }
  return cpf
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
