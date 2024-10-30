import { createContext } from "react";
export interface ISignInUser {
  name: string;
  role: string;
  id: number;
}
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
  user?: ISignInUser | null;
}

export const AuthContext = createContext<IAuthContextProps>({
  signIn: null,
  signOut: () => {},
  user: null,
});
