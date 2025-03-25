
import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { usePartnerForm } from "@/hooks/usePartnerForm";

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
  const { formData, isSubmitting, handleChange, handleSubmit } = usePartnerForm(selectedPlan);

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
