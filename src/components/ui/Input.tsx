import { InputHTMLAttributes } from "react";
import { ShadInput } from "./ShadInput";

export interface InputComponentProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ value, error, ...rest }: InputComponentProps) {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      <ShadInput value={value} {...rest} />
      {error && (
        <span className=" absolute bottom-[-1.2rem] text-destructive text-[10px] whitespace-nowrap">
          {error}
        </span>
      )}
    </div>
  );
}
