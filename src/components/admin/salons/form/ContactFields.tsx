
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBSCRIPTION_PLANS } from "@/components/salon/subscription/types";

interface ContactFieldsProps {
  form: UseFormReturn<any>;
  includeSubscriptionFields?: boolean;
}

export const ContactFields = ({ form, includeSubscriptionFields = false }: ContactFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefon</FormLabel>
            <FormControl>
              <Input placeholder="Ange telefonnummer..." {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gatuadress</FormLabel>
            <FormControl>
              <Input placeholder="Ange gatuadress..." {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postnummer</FormLabel>
              <FormControl>
                <Input placeholder="Ange postnummer..." {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ort</FormLabel>
              <FormControl>
                <Input placeholder="Ange ort..." {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {includeSubscriptionFields && (
        <>
          <FormField
            control={form.control}
            name="subscriptionPlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prenumerationsplan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "Baspaket"}>
                  <FormControl>
                    <SelectTrigger>
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subscriptionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Betalningsintervall</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "monthly"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj intervall" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="monthly">Månadsvis</SelectItem>
                    <SelectItem value="yearly">Årsvis</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
};
