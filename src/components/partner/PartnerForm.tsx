
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { usePartnerForm } from "@/hooks/usePartnerForm";
import { MapboxAddressInput, AddressParts } from "@/components/common/MapboxAddressInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

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
  const { formData, isSubmitting, handleChange, handleAddressChange, handleSubmit, handleCheckboxChange, formErrors } = usePartnerForm(selectedPlan);

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
      
      {/* Kombinerad villkorsacceptans för både allmänna villkor och integritetspolicyn */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="termsAndPrivacyAccepted" 
            checked={(formData.termsAccepted && formData.privacyAccepted) || false}
            onCheckedChange={(checked) => {
              const isChecked = checked === true;
              handleCheckboxChange('termsAccepted', isChecked);
              handleCheckboxChange('privacyAccepted', isChecked);
            }}
            className="mt-1 border-gray-400"
          />
          <div>
            <label 
              htmlFor="termsAndPrivacyAccepted" 
              className="text-[#5D1277] font-medium cursor-pointer"
            >
              Jag har läst och accepterar <Link to="/terms" className="text-primary hover:underline" target="_blank">allmänna villkor</Link> och <Link to="/privacy" className="text-primary hover:underline" target="_blank">integritetspolicyn</Link>
            </label>
            {(formErrors.termsAccepted || formErrors.privacyAccepted) && (
              <p className="text-sm text-red-500 mt-1">Du måste acceptera våra villkor för att fortsätta</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <LoadingButton 
          type="submit" 
          className="flex-1 w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
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
