import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/Input.tsx";

interface EmailFieldProps {
  index: number;
  email: { email: string };
  emailError?: string;
  handleEmailChange: (index: number, value: string) => void;
  handleRemoveEmail: (index: number) => void;
}

export const EmailField = ({
  index,
  email,
  emailError,
  handleEmailChange,
  handleRemoveEmail,
}: EmailFieldProps) => {
  return (
    <div className="flex flex-row gap-4 items-center" key={index}>
      <label htmlFor="email">Email:</label>
      <Input
        id="email"
        type="email"
        error={emailError}
        placeholder="Email"
        value={email.email}
        onChange={(e) => handleEmailChange(index, e.target.value)}
      />
      <Button onClick={() => handleRemoveEmail(index)} type="button">
        Remover
      </Button>
    </div>
  );
};
