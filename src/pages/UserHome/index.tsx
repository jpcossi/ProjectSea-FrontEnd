import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User } from "../../@types/user.ts";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/button";
import { applyCpfMask } from "../../utils/applyCpfMask.ts";
import { applyCepMask } from "../../utils/applyCepMask.ts";
import { applyPhoneMask } from "../../utils/applyPhoneMask.ts";
import { getUserById } from "../../services/getUserById.ts";

type UserStorage = { name: string; role: string; id: number } | undefined;

export function UserHome() {
  const { signOut } = useAuth();

  const [user, setUser] = useState<User>();
  const [phones, setPhones] = useState([{ tipo: "", telefone: "" }]);
  const [emails, setEmails] = useState([{ email: "" }]);

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  async function fetchUser() {
    const storageUser = localStorage.getItem("@Sea:user");

    if (!storageUser) return;

    const user: UserStorage = JSON.parse(storageUser);

    try {
      const response = await getUserById(`${user?.id}`);
      if (!response) return;

      setUser(response);
      setPhones(response?.phoneNumbers);
      setEmails(response?.emails);
    } catch (error) {
      // toast.error("Falha ao buscar usuario");
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="max-w-[600px] mx-auto py-8">
      <header className="flex justify-between py-5 items-center">
        <h1>Cliente {user?.name}</h1>
      </header>
      <main className="flex flex-col gap-8">
        <Card className=" flex flex-col gap-7 py-7 px-12">
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="login">Usuário:</label>
            <p>{user?.login}</p>
          </div>
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="login">Nome:</label>
            <p>{user?.name}</p>
          </div>
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="login">CPF:</label>
            <p>{applyCpfMask(user?.cpf)}</p>
          </div>
        </Card>
        <Card className=" flex flex-col gap-7 py-7 px-12">
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="cep">CEP:</label>
            <p>{applyCepMask(user?.cep)}</p>
          </div>
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="logradouro">Logradouro:</label>
            <p>{user?.logradouro}</p>
          </div>
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="bairro">Bairro:</label>
            <p>{user?.bairro}</p>
          </div>
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="cidade">Cidade:</label>
            <p>{user?.cidade}</p>
          </div>
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="uf">UF:</label>
            <p>{user?.uf}</p>
          </div>
          <div className="flex flex-row gap-5 border rounded-md p-2">
            <label htmlFor="Complemento">Complemento:</label>
            <p>{user?.complemento}</p>
          </div>
        </Card>
        <Card className=" flex flex-col gap-2 py-7 px-12">
          {phones?.map((phone, index) => {
            return (
              <div
                className=" flex flex-row justify-between gap-2 px-6 border rounded-md p-2"
                key={`${user?.login}-${index}`}
              >
                <div className="flex flex-row items-center gap-2">
                  <label htmlFor="phone">Telefone:</label>
                  <p>{applyPhoneMask(phone?.telefone, phone?.tipo)}</p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <label htmlFor="tipo">Tipo:</label>
                  <p>{phone?.tipo}</p>
                </div>
              </div>
            );
          })}
        </Card>
        <Card className=" flex flex-col gap-2 py-7 px-12">
          {emails?.map((email, index) => {
            return (
              <div
                className=" flex flex-row gap-2 px-6 border rounded-md p-2"
                key={`${user?.login}-${index}`}
              >
                <label htmlFor="email">Email:</label>
                <p>{email?.email}</p>
              </div>
            );
          })}
        </Card>
        <Button className="" title="Sair" onClick={handleSignOut}>
          Sair
        </Button>
      </main>
    </div>
  );
}
