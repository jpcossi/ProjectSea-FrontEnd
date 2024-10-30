import { Button } from "../../components/ui/button.tsx";
import { Input } from "../../components/ui/Input.tsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { applyPhoneMask } from "../../utils/applyPhoneMask.ts";

interface PhoneFieldProps {
  handlePhoneChange: (index: number, field: string, value: string) => void;
  handleRemovePhone: (index: number) => void;
  index: number;
  phone: {
    telefone: string;
    tipo: string;
  };
  phoneError: string;
}

export const PhoneField = ({
  index,
  phone,
  handleRemovePhone,
  phoneError,
  handlePhoneChange,
}: PhoneFieldProps) => {
  return (
    <div className="flex flex-row gap-6 items-center" key={index}>
      <label htmlFor="phone">Telefone:</label>
      <label htmlFor={`tipo-${index}`}>
        <Select onValueChange={(e) => handlePhoneChange(index, "tipo", e)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione um tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tipos de telefone</SelectLabel>
              <SelectItem value="Celular">Celular</SelectItem>
              <SelectItem value="Residencial">Residencial</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </label>

      <Input
        type="text"
        placeholder="Telefone"
        error={phoneError}
        value={applyPhoneMask(phone.telefone, phone.tipo)}
        onChange={(e) =>
          handlePhoneChange(
            index,
            "telefone",
            applyPhoneMask(e.target.value, phone.tipo)
          )
        }
      />

      <Button onClick={() => handleRemovePhone(index)} type="button">
        Remover
      </Button>
    </div>
  );
};
