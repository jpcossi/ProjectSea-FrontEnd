/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../services/api";
import { User } from "../../@types/user.ts";
import { Button } from "../../components/ui/button.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { toast } from "react-toastify";
import { Input } from "../../components/ui/Input.tsx";
import { applyCpfMask } from "../../utils/applyCpfMask.ts";
import { applyCepMask } from "../../utils/applyCepMask.ts";
import { removeMask } from "../../utils/removeMask.ts";
import { validateCep } from "../../utils/validateCep.ts";
import { validateName } from "../../utils/validateName.ts";
import { validateCpf } from "../../utils/validateCpf.ts";
import { getUserById } from "../../services/getUserById.ts";
import { PhoneField } from "./PhoneField.tsx";
import { EmailField } from "./EmailField.tsx";

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

  const unmaskedCpf = useMemo(() => {
    return removeMask(cpf);
  }, [cpf]);
  const unmaskedCep = useMemo(() => {
    return removeMask(cep);
  }, [cep]);

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
    const cepValidated = validateCep(unmaskedCep);

    if (!cepValidated) {
      setCepError("CEP inválido! Insira um CEP com 8 dígitos.");
      return;
    }

    fetchAddress(unmaskedCep);
  };

  const validateFields = () => {
    const nameValidated = validateName(name);
    const cepValidated = validateCep(unmaskedCep);
    const cpfValidated = validateCpf(unmaskedCpf);

    if (password == "") {
      setPasswordError("Preencha o campo senha!");
      return 0;
    }

    if (login == "") {
      setLoginError("Preencha o campo login!");
      return 0;
    }

    if (logradouro == "") {
      setLogradouroError("Preencha o campo login!");
      return 0;
    }

    if (bairro == "") {
      setBairroError("Preencha o campo Bairro!");
      return 0;
    }

    if (cidade == "") {
      setCidadeError("Preencha o campo Cidade!");
      return 0;
    }

    if (uf == "") {
      setUfError("Preencha o campo Uf!");
      return 0;
    }

    if (phones.some((p) => !p.telefone)) {
      setPhoneError("Preencha o campo telefone!");
      return 0;
    }

    if (emails.some((e) => !e.email)) {
      setEmailError("Preencha o campo email!");
      return 0;
    }

    if (cepValidated?.error) {
      setCepError(cepValidated.message);
      return 0;
    }

    if (nameValidated?.error) {
      setNameError(nameValidated.message);
      return 0;
    }

    if (cpfValidated?.error) {
      setCpfError(cpfValidated.message);
      return 0;
    }

    return 1;
  };

  async function handleUpdateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateFields()) return;
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
      if (error?.response) {
        console.error(error?.response?.data?.message);
      }
    }
  }

  const getUser = async () => {
    try {
      const user = await getUserById(params.id as string);
      if (!user) return;

      setUser(user);
      setPhones(user.phoneNumbers);
      setEmails(user.emails);
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="max-w-[800px] mx-auto py-8">
      <header className="flex justify-between py-5">
        <h1>Ola Admin, pode editar o usuário {user?.name}</h1>
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
                  error={loginError}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-6 items-center">
                <label htmlFor="senha">Senha:</label>
                <Input
                  id="senha"
                  type="text"
                  error={passwordError}
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
                  placeholder={user?.cpf ?? "000.000.000-00"}
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
                  placeholder={user?.cep ?? "Ex: 00000-000"}
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
                  error={logradouroError}
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-12 items-center">
                <label htmlFor="bairro">Bairro:</label>
                <Input
                  id="bairro"
                  type="text"
                  error={bairroError}
                  placeholder={user?.bairro ?? "Bairro"}
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-10 items-center">
                <label htmlFor="cidade">Cidade:</label>
                <Input
                  id="cidade"
                  type="text"
                  error={cidadeError}
                  placeholder={user?.cidade ?? "Cidade"}
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-[70px] items-center">
                <label htmlFor="uf">UF:</label>
                <Input
                  id="uf"
                  type="text"
                  error={ufError}
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
                    <PhoneField
                      key={`phone ${index + 1}`}
                      index={index}
                      phone={phone}
                      handleRemovePhone={handleRemovePhone}
                      phoneError={phoneError}
                      handlePhoneChange={handlePhoneChange}
                    />
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
                  <EmailField
                    key={`email ${index + 1}`}
                    email={email}
                    index={index}
                    emailError={emailError}
                    handleRemoveEmail={handleRemoveEmail}
                    handleEmailChange={handleEmailChange}
                  />
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
