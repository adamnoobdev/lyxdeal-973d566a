
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PartnerFormValues } from "../PartnerFormSchema";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<PartnerFormValues>;
}

export const PersonalInfoFields = ({ form }: PersonalInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ditt namn *</FormLabel>
            <FormControl>
              <Input placeholder="Anna Andersson" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="business_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Företagsnamn *</FormLabel>
            <FormControl>
              <Input placeholder="Din Salong AB" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
