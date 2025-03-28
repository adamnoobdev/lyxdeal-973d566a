
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MapPin, Phone, Home, MapPinned, Building } from "lucide-react";

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

      <div className="space-y-4">
        <FormDescription>
          Fyll i fullständig adressinformation för korrekt visning på kartan
        </FormDescription>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gatuadress</FormLabel>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      placeholder="Gatunamn och nummer..." 
                      className="pl-9" 
                      {...field} 
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postnummer</FormLabel>
                <div className="relative">
                  <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input 
                      placeholder="XXX XX" 
                      className="pl-9" 
                      {...field} 
                      maxLength={6}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stad</FormLabel>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input 
                    placeholder="Stad..." 
                    className="pl-9" 
                    {...field} 
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Behåll det dolda adressfältet som kombinerar de individuella fälten */}
        <input
          type="hidden"
          name="address"
          id="address"
          value={`${form.watch('street') || ''}, ${form.watch('postalCode') || ''} ${form.watch('city') || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '')}
          onChange={() => {}}
        />
      </div>
    </>
  );
};
