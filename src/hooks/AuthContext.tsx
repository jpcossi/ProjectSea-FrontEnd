import { createContext } from "react";

interface IAuthContextProps {
  signIn:
    | (({
        login,
        password,
      }: {
        login: string;
        password: string;
      }) => Promise<void>)
    | null;
  signOut: () => void;
  user?: { name: string; role: string; id: number } | null;
}

export const AuthContext = createContext<IAuthContextProps>({
  signIn: null,
  signOut: () => {},
  user: null,
});
