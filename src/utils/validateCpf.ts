export const validateCpf = (cpf: string) => {
  if (!cpf || cpf.length !== 11) {
    return {
      message: "Cpf inválido! Seu Cpf deve ter 11 dígitos.",
      error: true,
    };
  }

  return { error: false, message: "" };
};
