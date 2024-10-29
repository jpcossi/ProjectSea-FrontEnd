import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { api } from "../../services/api";
import { Input } from "../../components/ui/Input.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { Button } from "../../components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";

interface ViaCepResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function CreateUser() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [complemento, setComplemento] = useState("");

  const [phones, setPhones] = useState([{ tipo: "", telefone: "" }]);
  const [emails, setEmails] = useState([{ email: "" }]);

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
    console.log(updatedEmails);
    setEmails(updatedEmails);
  };

  function applyCepMask(cep?: string) {
    if (!cep) {
      return "";
    }
    return cep
      .replace(/\D/g, "")
      .slice(0, 8)
      .replace(/(\d{5})(\d{3})/, "$1-$2");
  }

  function applyCpfMask(cpf?: string) {
    if (!cpf) {
      return "";
    }
    return cpf
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  function applyPhoneMask(phone: string, type: string) {
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

  function removeMask(value: string) {
    return value.replace(/\D/g, "");
  }

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
    const unmaskedCep = removeMask(cep);
    if (unmaskedCep == "") {
      return;
    }
    if (unmaskedCep.length === 8) {
      fetchAddress(unmaskedCep);
    } else {
      alert("CEP inválido! Insira um CEP com 8 dígitos.");
    }
  };

  async function handleCreateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const unmaskedCpf = removeMask(cpf);
    const unmaskedCep = removeMask(cep);

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
    };

    console.log(user);
    try {
      const response = await api.post("/auth/register", user);
      console.log("repsonse do post", response);
      navigate("/");
    } catch (error: any) {
      if (error.response) {
        console.error("Error response:", error.response);
        alert(
          error.response ? error.response.data.message : "Erro desconhecido"
        );
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
                <label htmlFor="login">Usuário:</label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Minimo 3 caracteres"
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-6 items-center">
                <label htmlFor="senha">Senha:</label>
                <Input
                  id="senha"
                  type="text"
                  placeholder="senha"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-6 items-center">
                <label htmlFor="name">Nome:</label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Apenas letras, espaços e numeros"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-10 items-center">
                <label htmlFor="cpf">CPF:</label>
                <Input
                  id="cpf"
                  placeholder="Ex: 000-000-000-00"
                  value={cpf}
                  onChange={(e) => setCpf(applyCpfMask(e.target.value))}
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
                  onChange={(e) => setCep(applyCepMask(e.target.value))}
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
                  onChange={(e) => setLogradouro(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-12 items-center">
                <label htmlFor="bairro">Bairro:</label>
                <Input
                  id="bairro"
                  type="text"
                  placeholder="Bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-10 items-center">
                <label htmlFor="cidade">Cidade:</label>
                <Input
                  id="cidade"
                  type="text"
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div className="flex justify-start py-2 gap-[70px] items-center">
                <label htmlFor="uf">UF:</label>
                <Input
                  id="uf"
                  type="text"
                  placeholder="UF"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
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
