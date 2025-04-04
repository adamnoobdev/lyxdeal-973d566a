
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUBSCRIPTION_PLANS } from "../subscription/types";

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
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adress</FormLabel>
            <FormControl>
              <Input placeholder="Ange adress..." {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
