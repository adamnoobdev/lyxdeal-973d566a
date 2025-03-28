
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Phone } from "lucide-react";
import { isValidAddressFormat } from "@/utils/mapbox";

interface ContactFieldsProps {
  form: UseFormReturn<any>;
}

export const ContactFields = ({ form }: ContactFieldsProps) => {
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

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>Adress</FormLabel>
            <FormDescription>
              Ange fullständig adress med gatunummer, postnummer och stad för korrekt visning på kartan (t.ex. "Torsplan 8, 113 65 Stockholm")
            </FormDescription>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <FormControl>
                <Input 
                  placeholder="Gatuadress, postnummer och stad..." 
                  className="pl-9"
                  {...field} 
                  onBlur={(e) => {
                    field.onBlur();
                    // Validera och ge visuell feedback om adressen verkar ofullständig
                    const isValid = isValidAddressFormat(e.target.value);
                    if (e.target.value && !isValid) {
                      e.target.classList.add('border-orange-400');
                    } else {
                      e.target.classList.remove('border-orange-400');
                    }
                  }}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
