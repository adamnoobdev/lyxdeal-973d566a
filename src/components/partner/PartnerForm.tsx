
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { submitPartnerRequest, PartnerRequestData } from "@/hooks/usePartnerRequests";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!selectedPlan) {
        toast.error("Inget paket valt");
        setIsSubmitting(false);
        return;
      }
      
      // Validera formulärdata
      if (!formData.name || !formData.business || !formData.email || !formData.phone) {
        toast.error("Vänligen fyll i alla fält");
        setIsSubmitting(false);
        return;
      }
      
      // Validera e-postformatet
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Vänligen ange en giltig e-postadress");
        setIsSubmitting(false);
        return;
      }
      
      // Validera telefonnummerformat (grundläggande kontroll)
      if (formData.phone.length < 7) {
        toast.error("Vänligen ange ett giltigt telefonnummer");
        setIsSubmitting(false);
        return;
      }
      
      // Submit partner request
      const result = await submitPartnerRequest({
        name: formData.name,
        business_name: formData.business,
        email: formData.email,
        phone: formData.phone,
        message: "", // No message needed for signup
        plan_title: selectedPlan.title,
        plan_payment_type: selectedPlan.paymentType,
        plan_price: selectedPlan.price,
        plan_deal_count: selectedPlan.dealCount
      });
      
      if (!result.success) {
        throw new Error(result.error || "Ett fel uppstod");
      }
      
      if (result.redirectUrl) {
        // Öppna betalningssidan i nytt fönster/flik
        toast.success("Du skickas nu till betalningssidan");
        window.open(result.redirectUrl, "_blank");
        
        // Visa också en knapp som användaren kan klicka på om automatisk omdirigering misslyckas
        toast.success("Om du inte omdirigeras automatiskt, klicka här", {
          duration: 10000,
          action: {
            label: "Gå till betalning",
            onClick: () => window.open(result.redirectUrl!, "_blank")
          }
        });
      } else {
        // If no payment required (free plan)
        toast.success("Tack för din registrering! Vi kontaktar dig inom kort.");
        navigate('/partner');
      }
    } catch (error) {
      console.error("Error submitting partner request:", error);
      toast.error(error instanceof Error ? error.message : "Ett fel uppstod. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">Namn</label>
          <Input 
            id="name" 
            placeholder="Ditt namn" 
            value={formData.name}
            onChange={handleChange}
            required
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
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <LoadingButton 
          type="submit" 
          className="flex-1"
          loading={isSubmitting}
        >
          Fortsätt till betalning
        </LoadingButton>
        
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={() => navigate('/partner')}
        >
          Avbryt
        </Button>
      </div>
    </form>
  );
};
