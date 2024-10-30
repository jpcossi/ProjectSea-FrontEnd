export const validateCep = (cep: string) => {
  if (!cep ||cep.length !== 8) {
    return {
      message: "CEP inválido! Insira um CEP com 8 dígitos.",
      error: true,
    };
  }

  return { error: false, message: "" };
};
