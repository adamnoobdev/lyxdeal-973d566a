import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface QuantityFieldProps {
  form: UseFormReturn<FormValues>;
}

export const QuantityField = ({ form }: QuantityFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="quantity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Antal erbjudanden</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="t.ex. 10" 
              {...field} 
              min="1"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};