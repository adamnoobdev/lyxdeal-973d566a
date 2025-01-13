import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface PasswordFieldProps {
  form: UseFormReturn<any>;
}

export const PasswordField = ({ form }: PasswordFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Lösenord</FormLabel>
          <FormControl>
            <Input 
              type="password" 
              placeholder="Ange nytt lösenord..." 
              {...field} 
            />
          </FormControl>
          <FormDescription>
            Lämna tomt om du inte vill ändra lösenordet
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};