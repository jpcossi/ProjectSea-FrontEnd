export type User = {
  id: number;
  login: string;
  name: string;
  password: null | string;
  cpf: string;
  cep: string;
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: null | string;
  phoneNumbers: {
    telefone: string;
    tipo: string;
  }[];
  emails: {
    email: string;
  }[];
};
