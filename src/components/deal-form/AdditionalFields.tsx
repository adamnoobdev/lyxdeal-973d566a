import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface AdditionalFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const AdditionalFields = ({ form }: AdditionalFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="timeRemaining"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giltighetstid</FormLabel>
            <FormControl>
              <Input placeholder="t.ex. 2 dagar kvar" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="featured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Utvalt erbjudande</FormLabel>
              <p className="text-sm text-muted-foreground">
                Detta erbjudande kommer att visas i sektionen för utvalda erbjudanden
              </p>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};