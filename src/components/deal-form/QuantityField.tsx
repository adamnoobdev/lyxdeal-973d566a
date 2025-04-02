
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, useWatch } from "react-hook-form";
import { FormValues } from "./schema";

interface QuantityFieldProps {
  form: UseFormReturn<FormValues>;
  readOnly?: boolean;
}

export const QuantityField = ({ form, readOnly = false }: QuantityFieldProps) => {
  const requiresDiscountCode = useWatch({
    control: form.control,
    name: "requires_discount_code",
    defaultValue: true
  });
  
  // If discount codes are not required, this field should be disabled
  const isDisabled = readOnly || !requiresDiscountCode;
  
  return (
    <FormField
      control={form.control}
      name="quantity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Antal rabattkoder</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="t.ex. 10" 
              {...field} 
              min="1"
              disabled={isDisabled}
              readOnly={isDisabled}
              className={isDisabled ? "bg-gray-100" : ""}
              value={requiresDiscountCode ? field.value : "0"}
            />
          </FormControl>
          <FormDescription>
            {requiresDiscountCode 
              ? "Ange hur många rabattkoder som ska genereras för detta erbjudande. Detta kan inte ändras efter att erbjudandet har skapats."
              : "Inga rabattkoder kommer att genereras för detta erbjudande eftersom det använder direkt bokning."
            }
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
