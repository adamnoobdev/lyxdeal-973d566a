
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { submitPartnerRequest } from "./usePartnerRequests";
import { isValidAddressFormat } from "@/utils/mapbox";

interface PartnerFormData {
  name: string;
  business: string;
  email: string;
  phone: string;
  street?: string;
  postalCode?: string;
  city?: string;
  address: string;
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
    street: "",
    postalCode: "",
    city: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleAddressChange = useCallback((address: string) => {
    setFormData(prev => ({ ...prev, address }));
  }, []);

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

    // Validera att vi har tillräcklig adressinformation
    if ((!formData.street || !formData.postalCode || !formData.city) && formData.address) {
      toast.warning("Adressinformationen kan vara ofullständig. Vänligen fyll i gata, postnummer och stad.");
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log("Formuläret skickas redan, ignorerar nytt klick");
      return;
    }
    
    setIsSubmitting(true);
    console.log("Formulär skickas, isSubmitting satt till true");
    
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
      
      // Uppdatera den kombinerade adressen om den inte redan är uppdaterad
      let fullAddress = formData.address;
      if (!fullAddress && (formData.street || formData.postalCode || formData.city)) {
        const street = formData.street || '';
        const postalCode = formData.postalCode || '';
        const city = formData.city || '';
        
        fullAddress = '';
        if (street) fullAddress += street;
        if (postalCode) {
          if (fullAddress) fullAddress += ', ';
          fullAddress += postalCode;
        }
        if (city) {
          if (fullAddress && !fullAddress.endsWith(' ')) fullAddress += ' ';
          fullAddress += city;
        }
      }
      
      console.log("Submitting partner request with data:", {
        ...formData,
        address: fullAddress,
        plan: selectedPlan
      });
      
      // Visa toast innan anrop för att ge användaren feedback direkt
      toast.info("Bearbetar din begäran...");
      
      // Submit partner request with address included
      const result = await submitPartnerRequest({
        name: formData.name,
        business_name: formData.business,
        email: formData.email,
        phone: formData.phone,
        address: fullAddress, // Include combined address in the request
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
        
        // Visa en tydlig toast om omdirigering
        toast.success("Du skickas nu till betalningssidan!");
        
        // Omdirigera med timeout för att ge toast tid att visas
        setTimeout(() => {
          console.log("Executing redirect to:", result.redirectUrl);
          window.location.href = result.redirectUrl!;
        }, 1000);
        
        // För att ge användaren en fallback om något inte fungerar
        const timeoutId = setTimeout(() => {
          if (document.visibilityState !== 'hidden') {
            console.log("User still here after timeout, showing fallback link");
            toast.error("Kunde inte omdirigera automatiskt. Klicka här för att gå till betalning.", {
              duration: 30000,
              action: {
                label: "Gå till betalning",
                onClick: () => window.open(result.redirectUrl!, "_blank")
              }
            });
          }
        }, 5000);
        
        return () => clearTimeout(timeoutId);
      } else {
        // If no payment required (free plan)
        toast.success("Tack för din registrering! Vi kontaktar dig inom kort.");
        navigate('/partner');
      }
    } catch (error) {
      console.error("Error submitting partner request:", error);
      toast.error(error instanceof Error ? error.message : "Ett fel uppstod. Försök igen senare.");
    } finally {
      console.log("Partner request submission completed, isSubmitting set to false");
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleAddressChange,
    handleSubmit
  };
};
