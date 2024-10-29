import { Input as ShadInput } from "./Input";
import { InputHTMLAttributes } from "react";

interface InputCpomponentProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({
  id,
  value,
  error,
  onChange,
  ...rest
}: InputCpomponentProps) {
  return (
    <>
      <ShadInput value={value} {...rest} />
      <span className="text-destructive">{error}</span>
    </>
  );
}
