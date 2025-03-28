
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { usePartnerForm } from "@/hooks/usePartnerForm";
import { MapboxAddressInput, AddressParts } from "@/components/common/MapboxAddressInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SelectedPlan {
  title: string;
  paymentType: 'monthly' | 'yearly';
  price: number;
  dealCount: number;
}

interface PartnerFormProps {
  selectedPlan: SelectedPlan | null;
}

export const PartnerForm: React.FC<PartnerFormProps> = ({ selectedPlan }) => {
  const navigate = useNavigate();
  const { formData, isSubmitting, handleChange, handleAddressChange, handleSubmit: submitForm } = usePartnerForm(selectedPlan);
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  // Hantera direkt adressinmatning från Mapbox
  const handleMapboxAddressChange = (value: string, parts?: AddressParts) => {
    // Uppdatera adressfältet för formuläret
    handleAddressChange(value);
    
    // Om vi har uppdelade delar, uppdatera dem också
    if (parts) {
      if (parts.street) handleChange({ target: { id: 'street', value: parts.street } } as any);
      if (parts.postalCode) handleChange({ target: { id: 'postalCode', value: parts.postalCode } } as any);
      if (parts.city) handleChange({ target: { id: 'city', value: parts.city } } as any);
    }
  };

  // Wrapper för submit som kontrollerar terms acceptance
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast.error("Du måste godkänna villkoren för att fortsätta");
      return;
    }
    
    submitForm(e);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} aria-label="Partner registreringsformulär">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Namn</label>
          <Input 
            id="name" 
            placeholder="Ditt namn" 
            value={formData.name}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="business" className="text-sm font-medium">Företagsnamn</label>
          <Input 
            id="business" 
            placeholder="Ditt företag" 
            value={formData.business}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">E-post</label>
          <Input 
            id="email" 
            type="email" 
            placeholder="din@email.com" 
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full"
            inputMode="email"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Telefon</label>
          <Input 
            id="phone" 
            placeholder="Ditt telefonnummer" 
            value={formData.phone}
            onChange={handleChange}
            required
            aria-required="true"
            className="w-full"
            inputMode="tel"
          />
        </div>
        
        {/* Använd Mapbox för adressinmatning */}
        <div className="md:col-span-2 space-y-2">
          <label htmlFor="address" className="text-sm font-medium">Adress</label>
          <MapboxAddressInput
            defaultValue={formData.address || ''}
            onChange={handleMapboxAddressChange}
            id="address"
            placeholder="Sök efter din adress"
            required
          />
          
          {/* Dolda fält för att lagra strukturerade adressdelar */}
          <input type="hidden" id="street" value={formData.street || ''} onChange={() => {}} />
          <input type="hidden" id="postalCode" value={formData.postalCode || ''} onChange={() => {}} />
          <input type="hidden" id="city" value={formData.city || ''} onChange={() => {}} />
        </div>
      </div>
      
      {/* Terms and Conditions Checkbox */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={termsAccepted}
            onCheckedChange={(checked: boolean) => setTermsAccepted(checked)}
            className="mt-1"
          />
          <div className="grid gap-1.5 leading-none">
            <Label 
              htmlFor="terms" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Jag godkänner Lyxdeals{' '}
              <Link to="/terms" target="_blank" className="text-primary hover:underline">
                allmänna villkor
              </Link>{' '}
              och{' '}
              <Link to="/privacy" target="_blank" className="text-primary hover:underline">
                integritetspolicy
              </Link>
            </Label>
            <p className="text-xs text-muted-foreground">
              Genom att registrera dig som salongspartner godkänner du våra villkor.
            </p>
          </div>
        </div>
        
        {!termsAccepted && (
          <div className="text-xs flex items-center text-destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Du måste godkänna villkoren för att fortsätta
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <LoadingButton 
          type="submit" 
          className="flex-1 w-full"
          loading={isSubmitting}
          disabled={isSubmitting || !termsAccepted}
          aria-label={isSubmitting ? "Skickar din information..." : "Fortsätt till betalning"}
        >
          {isSubmitting ? "Bearbetar..." : "Fortsätt till betalning"}
        </LoadingButton>
        
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 w-full"
          onClick={() => navigate('/partner')}
          disabled={isSubmitting}
          aria-label="Avbryt registrering"
        >
          Avbryt
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-muted rounded-md">
        <p className="text-sm text-muted-foreground">
          Efter registrering kommer du att skickas till vår betalningspartner för att slutföra din prenumeration. 
          <strong className="font-medium"> Kom ihåg att använda rabattkoden "provmanad" för att få din första månad gratis!</strong>
        </p>
      </div>
    </form>
  );
};
