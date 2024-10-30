/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../../services/api";
import { Input } from "../../components/ui/Input.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { Button } from "../../components/ui/button.tsx";
import { applyCpfMask } from "../../utils/applyCpfMask.ts";
import { applyCepMask } from "../../utils/applyCepMask.ts";
import { PhoneField } from "../EditAdmin/PhoneField.tsx";
import { validateCep } from "../../utils/validateCep.ts";
import { validateName } from "../../utils/validateName.ts";
import { validateCpf } from "../../utils/validateCpf.ts";
import { EmailField } from "../EditAdmin/EmailField.tsx";
import { removeMask } from "../../utils/removeMask.ts";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../components/ui/radio-group.tsx";
import { Label } from "../../components/ui/Label.tsx";

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function CreateUser() {
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

  const [role, setRole] = useState<"admin" | "user">("user");

  const unmaskedCpf = useMemo(() => {
    return removeMask(cpf);
  }, [cpf]);
  const unmaskedCep = useMemo(() => {
    return removeMask(cep);
  }, [cep]);

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
    setPhoneError("");
  }

  const handleEmailChange = (index: number, value: string) => {
    const updatedEmails = emails.map((email, i) =>
      i === index ? { email: value } : email
    );
    console.log(updatedEmails);
    setEmails(updatedEmails);
    setEmailError("");
  };

  const fetchAddress = async (cep: string): Promise<void> => {
    try {
      const response = await axios.get<ViaCepResponse>(
        `https://viacep.com.br/ws/${cep}/json/`
      );
      const data = response.data;
      if (data.erro) {
        alert("CEP não encontrado!");
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
    const validatedCep = validateCep(unmaskedCep);

    if (validatedCep.error) {
      setCepError(validatedCep.message);
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
      setLogradouroError("Preencha o campo logradouro!");
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

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateFields()) return;

    const user = {
      login,
      password,
      name,
      cpf: unmaskedCpf,
      cep: unmaskedCep,
      logradouro,
      bairro,
      cidade,
      uf,
      complemento,
      phoneNumbers: phones,
      emails: emails,
      role: role.toUpperCase(),
    };

    console.log(user);
    try {
      const response = await api.post("/auth/register", user);
      console.log("repsonse do post", response);
      navigate("/");
    } catch (error: any) {
      if (error.response) {
        console.error("Error response:", error.response);
      }
    }
  }

  return (
    <div className="max-w-[800px] mx-auto py-8">
      <header className="flex justify-between py-5">
        <h1>Ola Admin, pode criar o cliente</h1>
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
            onSubmit={handleCreateUser}
            action=""
          >
            <Card className=" flex flex-col justify-center gap-2 py-10 px-12">
              <div className="flex justify-start py-2 gap-3 items-center">
                <Label>Perfil:</Label>
                <RadioGroup
                  defaultValue={role}
                  onValueChange={(value: "admin" | "user") => setRole(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">Usuário</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex justify-start py-2 gap-3 items-center">
                <label htmlFor="login">Usuário:</label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Minimo 3 caracteres"
                  error={loginError}
                  onChange={(e) => {
                    setLogin(e.target.value);
                    setLoginError("");
                  }}
                />
              </div>
              <div className="flex justify-start py-2 gap-6 items-center">
                <label htmlFor="senha">Senha:</label>
                <Input
                  id="senha"
                  type="text"
                  placeholder="senha"
                  error={passwordError}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                />
              </div>
              <div className="flex justify-start py-2 gap-6 items-center">
                <label htmlFor="name">Nome:</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Apenas letras, espaços e numeros"
                  error={nameError}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError("");
                  }}
                />
              </div>
              <div className="flex justify-start py-2 gap-10 items-center">
                <label htmlFor="cpf">CPF:</label>
                <Input
                  id="cpf"
                  placeholder="Ex: 000-000-000-00"
                  error={cpfError}
                  value={applyCpfMask(cpf)}
                  onChange={(e) => {
                    setCpf(applyCpfMask(e.target.value));
                    setCpfError("");
                  }}
                />
              </div>
            </Card>
            <Card className=" flex flex-col justify-center gap-2 py-10 px-12">
              <div className="flex justify-start py-2 gap-16 items-center">
                <label htmlFor="cep">CEP:</label>
                <Input
                  id="cep"
                  type="text"
                  placeholder="Ex: 00000-000"
                  value={cep}
                  error={cepError}
                  onChange={(e) => {
                    setCep(applyCepMask(e.target.value));
                    setCepError("");
                  }}
                  onBlur={handleCepBlur}
                />
              </div>
              <div className="flex justify-start py-2 gap-2 items-center">
                <label htmlFor="logradouro">Logradouro:</label>
                <Input
                  id="logradouro"
                  type="text"
                  placeholder="Logradouro"
                  value={logradouro}
                  error={logradouroError}
                  onChange={(e) => {
                    setLogradouro(e.target.value);
                    setLogradouroError("");
                  }}
                />
              </div>
              <div className="flex justify-start py-2 gap-12 items-center">
                <label htmlFor="bairro">Bairro:</label>
                <Input
                  id="bairro"
                  type="text"
                  placeholder="Bairro"
                  error={bairroError}
                  value={bairro}
                  onChange={(e) => {
                    setBairro(e.target.value);
                    setBairroError("");
                  }}
                />
              </div>
              <div className="flex justify-start py-2 gap-10 items-center">
                <label htmlFor="cidade">Cidade:</label>
                <Input
                  id="cidade"
                  type="text"
                  placeholder="Cidade"
                  value={cidade}
                  error={cidadeError}
                  onChange={(e) => {
                    setCidade(e.target.value);
                    setCidadeError("");
                  }}
                />
              </div>
              <div className="flex justify-start py-2 gap-[70px] items-center">
                <label htmlFor="uf">UF:</label>
                <Input
                  id="uf"
                  type="text"
                  placeholder="UF"
                  value={uf}
                  error={ufError}
                  onChange={(e) => {
                    setUf(e.target.value);
                    setUfError("");
                  }}
                />
              </div>
              <div className="flex justify-start py-2 gap-3 items-center">
                <label htmlFor="Complemento">Complemento:</label>
                <Input
                  id="Complemto"
                  type="text"
                  placeholder="Complemento"
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
              <div className="flex items-center justify-start">
                <Button title="Adicionar usuário" type="submit">
                  Adicionar
                </Button>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}
