
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface AdditionalFieldsProps {
  form: UseFormReturn<FormValues>;
}

export const AdditionalFields = ({ form }: AdditionalFieldsProps) => {
  // Calculate dates
  const today = new Date();
  const maxDate = addDays(today, 60);

  return (
    <>
      <FormField
        control={form.control}
        name="expirationDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Giltighetstid (max 60 dagar)</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "yyyy-MM-dd")
                    ) : (
                      <span>Välj slutdatum</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < today || date > maxDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
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
