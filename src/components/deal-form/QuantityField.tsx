
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface QuantityFieldProps {
  form: UseFormReturn<FormValues>;
  readOnly?: boolean;
}

export const QuantityField = ({ form, readOnly = false }: QuantityFieldProps) => {
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
              disabled={readOnly}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-100" : ""}
            />
          </FormControl>
          <FormDescription>
            Ange hur många rabattkoder som ska genereras för detta erbjudande. 
            Detta kan inte ändras efter att erbjudandet har skapats.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
