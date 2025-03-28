
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Phone } from "lucide-react";
import { MapboxAddressInput, AddressParts } from "@/components/common/MapboxAddressInput";

interface ContactFieldsProps {
  form: UseFormReturn<any>;
}

export const ContactFields = ({ form }: ContactFieldsProps) => {
  // Hantera mapbox-adressinmatning
  const handleAddressChange = (value: string, parts?: AddressParts) => {
    // Uppdatera det synliga adressfältet
    form.setValue('fullAddress', value, { shouldValidate: true });
    
    // Om vi har strukturerade detaljer, uppdatera de individuella fälten
    if (parts) {
      if (parts.street) form.setValue('street', parts.street, { shouldValidate: true });
      if (parts.postalCode) form.setValue('postalCode', parts.postalCode, { shouldValidate: true });
      if (parts.city) form.setValue('city', parts.city, { shouldValidate: true });
      
      // Skapa fullständig adress för backend
      let fullAddress = '';
      if (parts.street) fullAddress += parts.street;
      if (parts.postalCode) {
        if (fullAddress) fullAddress += ', ';
        fullAddress += parts.postalCode;
      }
      if (parts.city) {
        if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
        fullAddress += parts.city;
      }
      
      form.setValue('address', fullAddress, { shouldValidate: true });
    } else {
      // Om vi inte har strukturerade detaljer, använd hela värdet som adress
      form.setValue('address', value, { shouldValidate: true });
    }
  };

  // Skapa en konstruerad defaultValue för Mapbox-inmatningen
  const getFullAddress = () => {
    const street = form.watch('street') || '';
    const postalCode = form.watch('postalCode') || '';
    const city = form.watch('city') || '';
    
    if (!street && !postalCode && !city) return '';
    
    let fullAddress = '';
    if (street) fullAddress += street;
    if (postalCode) {
      if (fullAddress) fullAddress += ', ';
      fullAddress += postalCode;
    }
    if (city) {
      if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
      fullAddress += city;
    }
    return fullAddress;
  };

  return (
    <>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefon</FormLabel>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <FormControl>
                <Input placeholder="08-12 34 56..." className="pl-9" {...field} />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormDescription>
          Sök och välj en fullständig adress för korrekt visning på kartan
        </FormDescription>
        
        <FormField
          control={form.control}
          name="fullAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adress</FormLabel>
              <MapboxAddressInput
                defaultValue={getFullAddress()}
                onChange={handleAddressChange}
                error={!!form.formState.errors.address}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Dolda fält för att lagra strukturerade adressdelar */}
        <input type="hidden" {...form.register('street')} />
        <input type="hidden" {...form.register('postalCode')} />
        <input type="hidden" {...form.register('city')} />
        <input type="hidden" {...form.register('address')} />
      </div>
    </>
  );
};
