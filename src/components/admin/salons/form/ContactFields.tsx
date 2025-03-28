
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface ContactFieldsProps {
  form: UseFormReturn<any>;
}

export const ContactFields = ({ form }: ContactFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefon</FormLabel>
            <FormControl>
              <Input placeholder="Ange telefon..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adress</FormLabel>
            <FormDescription>
              Ange fullständig adress med gatunummer, postnummer och stad för korrekt visning på kartan (t.ex. "Torsplan 8, 113 65 Stockholm")
            </FormDescription>
            <FormControl>
              <Input 
                placeholder="Gatuadress, postnummer och stad..." 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
