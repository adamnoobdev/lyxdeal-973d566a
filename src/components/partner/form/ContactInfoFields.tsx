
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PartnerFormValues } from "../PartnerFormSchema";

interface ContactInfoFieldsProps {
  form: UseFormReturn<PartnerFormValues>;
}

export const ContactInfoFields = ({ form }: ContactInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-post *</FormLabel>
            <FormControl>
              <Input placeholder="ditt@företag.se" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefon *</FormLabel>
            <FormControl>
              <Input placeholder="070-123 45 67" type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
