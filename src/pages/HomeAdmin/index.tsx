import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button.tsx";
import { User } from "../../@types/user.ts";
import { Card, CardHeader } from "../../components/ui/Card.tsx";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../../components/ui/Table.tsx";
import { applyCepMask } from "../../utils/applyCepMask.ts";
import { applyCpfMask } from "../../utils/applyCpfMask.ts";
import { mockUsers } from "../../mocks/user.ts";
import { getUsers } from "../../services/getUsers.ts";

export function HomeAdmin() {
  const { signOut } = useAuth();

  const [users, setUsers] = useState<User[] | undefined>();
  const [username, setUsername] = useState("Administrador");

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      if (!users?.length) return;
      setUsers(users);
    } catch (error) {
      console.error("error: ", error);
      setUsers(mockUsers);
    }
  };

  useEffect(() => {
    const storageUser = JSON.parse(localStorage.getItem("@Sea:user") ?? "");
    setUsername(storageUser.name);

    fetchUsers();
  }, []);

  return (
    <Card className="mt-10 w-full p-4">
      <CardHeader>Olá, {username}</CardHeader>

      <Table>
        <TableCaption>Usuários cadastrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">login</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>CEP</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead className="text-right">UF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow
              key={user.name}
              onClick={() => navigate(`/userAdmin/${user.id}`)}
            >
              <TableCell className="font-medium">{user.login}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{applyCpfMask(user.cpf)}</TableCell>
              <TableCell>{applyCepMask(user.cep)}</TableCell>
              <TableCell>{user.cidade}</TableCell>
              <TableCell className="text-right">{user.uf}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex w-full justify-between">
        <Button onClick={() => navigate("/new")}>Adicionar</Button>
        <Button variant="secondary" onClick={handleSignOut}>
          Sair
        </Button>
      </div>
    </Card>
  );
}
