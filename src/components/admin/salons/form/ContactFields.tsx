
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBSCRIPTION_PLANS } from "@/components/salon/subscription/types";
import { MapboxAddressInput } from "@/components/common/MapboxAddressInput";
import type { AddressParts } from "@/components/common/MapboxAddressInput";

interface ContactFieldsProps {
  form: UseFormReturn<any>;
  includeSubscriptionFields?: boolean;
}

export const ContactFields = ({ form, includeSubscriptionFields = false }: ContactFieldsProps) => {
  // Kontrollera om skipSubscription är markerad
  const skipSubscription = form.watch("skipSubscription");
  
  // Visa prenumerationsfält om includeSubscriptionFields är true ELLER om skipSubscription är markerad
  const showSubscriptionFields = includeSubscriptionFields || skipSubscription;

  // Hantera adressändring från Mapbox-komponent
  const handleAddressChange = (value: string, parts?: AddressParts) => {
    form.setValue("address", value, { shouldValidate: true });
    
    // Om vi får tillbaka adressdelar, spara dem i formuläret
    if (parts) {
      form.setValue("street", parts.street || "", { shouldValidate: false });
      form.setValue("postalCode", parts.postalCode || "", { shouldValidate: false });
      form.setValue("city", parts.city || "", { shouldValidate: false });
    }
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
              <Input placeholder="Ange telefonnummer..." {...field} value={field.value || ''} className="w-full" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Gatuadress</FormLabel>
            <FormControl>
              <MapboxAddressInput
                defaultValue={field.value || ''}
                onChange={handleAddressChange}
                id="address"
                placeholder="Sök efter adress..."
                error={!!form.formState.errors.address}
                className="w-full"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Visa alltid prenumerationsfält i admin edit salon, även om isEditing är true */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="subscriptionPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Prenumerationsplan</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "Baspaket"}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj plan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.keys(SUBSCRIPTION_PLANS).map((planKey) => (
                    <SelectItem key={planKey} value={planKey}>
                      {SUBSCRIPTION_PLANS[planKey].title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subscriptionType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Betalningsintervall</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "monthly"}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj intervall" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Månadsvis</SelectItem>
                  <SelectItem value="yearly">Årsvis</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
