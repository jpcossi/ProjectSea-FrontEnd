import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import { api } from "../../services/api";
import { User } from "../../@types/user.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { toast } from "react-toastify";
import { Input } from "../../components/ui/Input.tsx";
import { applyPhoneMask } from "../../utils/applyPhoneMask.ts";
import { applyCpfMask } from "../../utils/applyCpfMask.ts";
import { applyCepMask } from "../../utils/applyCepMask.ts";
import { removeMask } from "../../utils/removeMask.ts";
import { validateCep } from "../../utils/validateCep.ts";
import { validateName } from "../../utils/validateName.ts";
import { validateCpf } from "../../utils/validateCpf.ts";

interface IUserResponse {
  data: User;
}

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function EditAdmin() {
  const [user, setUser] = useState<User>();

  const [login, setLogin] = useState("");
  const [loginError, setLoginError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const [cpf, setCpf] = useState("");
  const [cpfError, setCpfError] = useState("");

  const [cep, setCep] = useState("");
  const [cepError, setCepError] = useState("");

  const [logradouro, setLogradouro] = useState("");
  const [logradouroError, setLogradouroError] = useState("");

  const [bairro, setBairro] = useState("");
  const [bairroError, setBairroError] = useState("");

  const [cidade, setCidade] = useState("");
  const [cidadeError, setCidadeError] = useState("");

  const [uf, setUf] = useState("");
  const [ufError, setUfError] = useState("");

  const [complemento, setComplemento] = useState("");

  const [phones, setPhones] = useState([{ tipo: "", telefone: "" }]);
  const [phoneError, setPhoneError] = useState("");

  const [emails, setEmails] = useState([{ email: "" }]);
  const [emailError, setEmailError] = useState("");

  const params = useParams();

  const navigate = useNavigate();

  const handleRemovePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handleAddPhone = () => {
    setPhones([...phones, { tipo: "", telefone: "" }]);
  };

  const handleAddEmail = () => {
    setEmails([...emails, { email: "" }]);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  function handlePhoneChange(index: number, field: string, value: string) {
    const updatedPhones = phones.map((phone, i) =>
      i === index ? { ...phone, [field]: value } : phone
    );
    setPhones(updatedPhones);
  }

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = emails.map((email, i) =>
      i === index ? { email: value } : email
    );
    setEmails(updatedEmails);
  };

  async function handleDeleteUser() {
    await api.delete(`/admin/user/${params.id}/delete`);
    toast.error("Usuario deletado com sucesso!");
    navigate("/");
  }

  const fetchAddress = async (cep: string): Promise<void> => {
    try {
      const response = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      const data = response.data;
      if (data.erro) {
        toast.error("CEP não encontrado!");
        return;
      }
      setLogradouro(data.logradouro);
      setBairro(data.bairro);
      setCidade(data.localidade);
      setUf(data.uf);
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
    }
  };

  const handleCepBlur = () => {
    const unmaskedCep = removeMask(cep);
    if (unmaskedCep == "") {
      return;
    }
    if (unmaskedCep.length === 8) {
      fetchAddress(unmaskedCep);
    } else {
      //toast.error("CEP inválido! Insira um CEP com 8 dígitos.");
    }
  };

  async function handleUpdateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const unmaskedCpf = removeMask(cpf);
    const unmaskedCep = removeMask(cep);

    const cepValidated = validateCep(cep);
    const nameValidated = validateName(name);
    const cpfValidated = validateCpf(name);

    console.log(event);

    if (password == "") {
      setPasswordError("Preencha o campo senha!");
    }

    if (login == "") {
      setLoginError("Preencha o campo login!");
    }

    if (logradouro == "") {
      setLogradouroError("Preencha o campo login!");
    }

    if (cpf == "") {
      setCpfError("Preencha o campo cpf!");
    }

    if (bairro == "") {
      setBairroError("Preencha o campo Bairro!");
    }

    if (cidade == "") {
      setCidadeError("Preencha o campo Cidade!");
    }

    if (uf == "") {
      setUfError("Preencha o campo Uf!");
    }

    if (phones.some((p) => !p.telefone)) {
      setPhoneError("Preencha o campo telefone!");
    }

    if (emails.some((e) => !e.email)) {
      setEmailError("Preencha o campo email!");
    }

    if (cepValidated?.error) {
      setCepError(cepValidated.message);
    }

    if (nameValidated?.error) {
      setNameError(nameValidated.message);
    }

    if (cpfValidated?.error) {
      setCpfError(cpfValidated.message);
    }

    const user = {
      login,
      name,
      password,
      cpf: unmaskedCpf,
      cep: unmaskedCep,
      logradouro,
      bairro,
      cidade,
      uf,
      complemento,
      phoneNumbers: phones,
      emails,
    };
    try {
      await api.put(`/admin/user/${params.id}/update`, user);
      navigate("/");
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const response: IUserResponse = await api.get(`/user/${params.id}`);
        setUser(response.data);
        setPhones(response.data.phoneNumbers);
        setEmails(response.data.emails);
      } catch (error) {
        console.log("error: ", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="max-w-[800px] mx-auto py-8">
      <header className="flex justify-between py-5">
        <h1>Ola Admin, pode editar o cliente {user?.name}</h1>
        <Link to="/">
          <Button className="" title="Voltar">
            Voltar
          </Button>
        </Link>
      </header>
      <main>
        <div>
          <form
            className="flex flex-col gap-8"
            onSubmit={handleUpdateUser}
            action=""
          >
            <Card className=" flex flex-col justify-center gap-2 py-10 px-12">
              <div className="flex justify-start py-2 gap-3 items-center">
                <label htmlFor="login">Usuário:</label>
                <Input
                  id="login"
                  type="text"
                  placeholder={user?.login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-6 items-center">
                <label htmlFor="senha">Senha:</label>
                <Input
                  id="senha"
                  type="text"
                  placeholder={user?.password ?? "senha"}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-6 items-center">
                <label htmlFor="name">Nome:</label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  placeholder={user?.name}
                  error={nameError}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-10 items-center">
                <label htmlFor="cpf">CPF:</label>
                <Input
                  id="cpf"
                  type="text"
                  error={cpfError}
                  placeholder={user?.cpf}
                  value={applyCpfMask(cpf)}
                  onChange={(e) => setCpf(applyCpfMask(e.target.value))}
                />
              </div>
            </Card>
            <Card className=" flex flex-col justify-center gap-2 py-10 px-12">
              <div className="flex justify-start py-2 gap-16 items-center">
                <label htmlFor="cep">CEP:</label>
                <Input
                  value={cep}
                  id="cep"
                  type="text"
                  placeholder={user?.cep}
                  error={cepError}
                  onChange={(e) => setCep(applyCepMask(e.target.value))}
                  onBlur={handleCepBlur}
                />
              </div>
              <div className="flex justify-start py-2 gap-2 items-center">
                <label htmlFor="logradouro">Logradouro:</label>
                <Input
                  id="logradouro"
                  type="text"
                  placeholder={user?.logradouro}
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-12 items-center">
                <label htmlFor="bairro">Bairro:</label>
                <Input
                  id="bairro"
                  type="text"
                  placeholder={user?.bairro}
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-10 items-center">
                <label htmlFor="cidade">Cidade:</label>
                <Input
                  id="cidade"
                  type="text"
                  placeholder={user?.cidade}
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-[70px] items-center">
                <label htmlFor="uf">UF:</label>
                <Input
                  id="uf"
                  type="text"
                  placeholder={user?.uf}
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-3 items-center">
                <label htmlFor="Complemento">Complemento:</label>
                <Input
                  id="Complemto"
                  type="text"
                  placeholder={user?.complemento ?? "Opcional"}
                  onChange={(e) => setComplemento(e.target.value)}
                />
              </div>
            </Card>
            <Card className=" flex flex-col gap-2 py-7 px-12">
              <div className="flex flex-col justify-start py-2 gap-3 items-center">
                <div className="flex flex-col gap-2 py-5 px-12">
                  {phones.map((phone, index) => (
                    <div
                      className="flex flex-row gap-6 items-center"
                      key={index}
                    >
                      <label htmlFor="phone">Telefone:</label>
                      <label htmlFor={`tipo-${index}`}>
                        <Select
                          onValueChange={(e) =>
                            handlePhoneChange(index, "tipo", e)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Tipos de telefone</SelectLabel>
                              <SelectItem value="Celular">Celular</SelectItem>
                              <SelectItem value="Residencial">
                                Residencial
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </label>

                      <Input
                        type="text"
                        placeholder="Telefone"
                        value={applyPhoneMask(phone.telefone, phone.tipo)}
                        onChange={(e) =>
                          handlePhoneChange(
                            index,
                            "telefone",
                            applyPhoneMask(e.target.value, phone.tipo)
                          )
                        }
                      />

                      <Button
                        onClick={() => handleRemovePhone(index)}
                        type="button"
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mr-8">
                  <Button onClick={handleAddPhone} type="button">
                    Adicionar Telefone
                  </Button>
                </div>
              </div>
            </Card>
            <Card className=" flex flex-col justify-center gap-2 py-10 px-12">
              <div className="flex flex-col gap-2 py-5 px-12">
                {emails.map((email, index) => (
                  <div className="flex flex-row gap-4 items-center" key={index}>
                    <label htmlFor="email">Email:</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email.email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    <Button
                      onClick={() => handleRemoveEmail(index)}
                      type="button"
                    >
                      Remover
                    </Button>
                  </div>
                ))}

                <div className="flex justify-center mt-12 items-center gap-4">
                  <Button onClick={handleAddEmail} type="button">
                    Adicionar Email
                  </Button>
                </div>
              </div>
            </Card>
            <section className="">
              <div className="flex items-center gap-4 justify-center">
                <Button
                  title="Excluir Usuario"
                  type="button"
                  onClick={handleDeleteUser}
                >
                  Excluir
                </Button>
                <Button title="Salvar Alterações" type="submit">
                  Salvar
                </Button>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}
