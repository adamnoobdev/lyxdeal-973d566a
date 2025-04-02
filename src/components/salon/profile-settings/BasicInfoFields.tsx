
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>;
  readOnly?: boolean;
}

export const BasicInfoFields = ({ form, readOnly = false }: BasicInfoFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Namn</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ange namn..." 
                {...field} 
                readOnly={readOnly}
                className={readOnly ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </FormControl>
            {readOnly && (
              <p className="text-xs text-muted-foreground">
                Kontakta support för att ändra salongnamn.
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-post</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ange e-post..." 
                {...field} 
                readOnly={readOnly}
                className={readOnly ? "bg-gray-100 cursor-not-allowed" : ""}
              />
            </FormControl>
            {readOnly && (
              <p className="text-xs text-muted-foreground">
                Kontakta support för att ändra e-postadress.
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
