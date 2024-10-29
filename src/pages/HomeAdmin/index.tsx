import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

import { Button } from "../../components/ui/button.tsx";

import { User } from "../../@types/user.ts";
import { Card } from "../../components/ui/Card.tsx";
import { Table } from "lucide-react";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/Table.tsx";
import { applyCepMask } from "../../utils/applyCepMask.ts";
import { applyCpfMask } from "../../utils/applyCpfMask.ts";

interface IUsersResponse {
  data?: User[];
}

export function HomeAdmin() {
  const { signOut } = useAuth();

  const [users, setUsers] = useState<User[]>();

  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    async function fetchUsers() {
      const response: IUsersResponse = await api.get(`/admin/users`);
      console.log(response);
      setUsers(response.data);
    }
    fetchUsers();
  }, []);

  return <Card className="mt-10 w-full p-4">oi</Card>;
}
