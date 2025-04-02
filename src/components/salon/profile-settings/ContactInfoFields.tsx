
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MapboxAddressInput } from "@/components/common/MapboxAddressInput";
import type { AddressParts } from "@/components/common/MapboxAddressInput";

interface ContactInfoFieldsProps {
  form: UseFormReturn<any>;
}

export const ContactInfoFields = ({ form }: ContactInfoFieldsProps) => {
  // Hantera adressändring från Mapbox-komponent
  const handleAddressChange = (value: string, parts?: AddressParts) => {
    form.setValue("address", value, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Telefon</FormLabel>
            <FormControl>
              <Input placeholder="Ange telefonnummer..." {...field} value={field.value || ''} />
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
            <FormLabel className="text-sm font-medium">Adress</FormLabel>
            <FormControl>
              <MapboxAddressInput 
                defaultValue={field.value || ''}
                onChange={handleAddressChange}
                id="address"
                placeholder="Sök efter din adress"
                error={!!form.formState.errors.address}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
