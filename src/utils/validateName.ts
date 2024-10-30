export const validateName = (name: string) => {
  if (!name || name.length !== 8 && !/^[a-zA-ZÀ-ÿ0-9 ]+$/.test(name || "")) {
    return {
      message: "Nome inválido! Inclua apenas letras, números e espaços.",
      error: true,
    };
  }

  return { error: false, message: "" };
};
