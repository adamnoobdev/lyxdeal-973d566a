
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { submitPartnerRequest } from "./usePartnerRequests";

interface PartnerFormData {
  name: string;
  business: string;
  email: string;
  phone: string;
}

interface SelectedPlan {
  title: string;
  paymentType: 'monthly' | 'yearly';
  price: number;
  dealCount: number;
}

export const usePartnerForm = (selectedPlan: SelectedPlan | null) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    business: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateForm = (): boolean => {
    // Validera formulärdata
    if (!formData.name || !formData.business || !formData.email || !formData.phone) {
      toast.error("Vänligen fyll i alla fält");
      return false;
    }
    
    // Validera e-postformatet
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Vänligen ange en giltig e-postadress");
      return false;
    }
    
    // Validera telefonnummerformat (grundläggande kontroll)
    if (formData.phone.length < 7) {
      toast.error("Vänligen ange ett giltigt telefonnummer");
      return false;
    }

    return true;
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
      
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
      
      console.log("Submitting partner request with data:", {
        ...formData,
        plan: selectedPlan
      });
      
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
      
      console.log("Partner request submission result:", result);
      
      if (!result.success) {
        throw new Error(result.error || "Ett fel uppstod");
      }
      
      if (result.redirectUrl) {
        console.log("Redirecting to payment URL:", result.redirectUrl);
        
        // Add promo code information to toast message
        toast.success("Du skickas nu till betalningssidan. Använd rabattkoden 'provmanad' för en gratis provmånad!");
        
        // Redirect to payment page directly in the same tab
        window.location.href = result.redirectUrl;
        
        // Show a backup button in case redirect doesn't work automatically
        toast.success("Om du inte omdirigeras automatiskt, klicka här", {
          duration: 10000,
          action: {
            label: "Gå till betalning",
            onClick: () => window.location.href = result.redirectUrl!
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

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};
