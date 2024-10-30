import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Link } from "react-router-dom";

function LoginContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center [&>div]:w-full",
        className
      )}
      {...props}
    />
  );
}

export function SignIn() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();

  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signIn?.({ login, password });
  }

  return (
    <LoginContainer>
      <div className="max-w-[500px] mx-auto py-24">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Bem vindo</CardTitle>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className="grid gap-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Continuar com
                  </span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="usuario">Usuário</Label>
                <Input
                  id="usuario"
                  type="text"
                  placeholder=""
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 w-full">
              <Button className="w-full" type="submit">
                Entrar
              </Button>
              <Link className="w-full" to="/new">
                <Button variant="secondary" className="w-full" type="submit">
                  Registrar
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </LoginContainer>
  );
}
