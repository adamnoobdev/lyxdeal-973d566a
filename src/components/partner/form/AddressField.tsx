
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { MapboxAddressInput, type AddressParts } from "@/components/common/MapboxAddressInput";
import { useState } from "react";
import { PartnerFormValues } from "../PartnerFormSchema";

interface AddressFieldProps {
  form: UseFormReturn<PartnerFormValues>;
}

export const AddressField = ({ form }: AddressFieldProps) => {
  const [addressParts, setAddressParts] = useState<AddressParts | undefined>();

  const handleAddressChange = (address: string, parts?: AddressParts) => {
    form.setValue("address", address);
    if (parts) {
      setAddressParts(parts);
    }
  };

  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Adress *</FormLabel>
          <FormControl>
            <MapboxAddressInput
              id="address" 
              defaultValue={field.value}
              onChange={handleAddressChange}
              placeholder="Sök din adress här..."
              required
              error={!!form.formState.errors.address}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
