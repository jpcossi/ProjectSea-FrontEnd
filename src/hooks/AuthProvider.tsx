import { useState, useEffect } from "react";
import { api } from "../services/api";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

interface IAuthProviderProps {
  children: React.ReactNode;
}

type User = { name: string; role: string; id: number };

interface ILoginResponse {
  data: { user: User | null; token?: string };
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const [data, setData] = useState<ILoginResponse["data"]>();

  async function signIn({
    login,
    password,
  }: {
    login: string;
    password: string;
  }) {
    try {
      const response: ILoginResponse = await api.post("/auth/login", {
        login,
        password,
      });
      if (!response.data) return;
      const { user, token } = response.data;
      localStorage.setItem("@Sea:user", JSON.stringify(user));
      localStorage.setItem("@Sea:token", token as string);

      setData({ ...data, user, token });
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error("Não foi possível entrar.");
      }
    }
  }

  function signOut() {
    localStorage.removeItem("@Sea:user");
    localStorage.removeItem("@Sea:token");
    setData({ ...data, user: null });
  }

  useEffect(() => {
    const user = localStorage.getItem("@Sea:user");
    const token = localStorage.getItem("@Sea:token");

    if (token && user) {
      setData({ user: JSON.parse(user) });
    } else {
      setData({ user: null });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, user: data?.user }}>
      {children}
    </AuthContext.Provider>
  );
}
