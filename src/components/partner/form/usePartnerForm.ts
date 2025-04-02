import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { submitPartnerRequest } from "@/hooks/usePartnerRequests";
import { formSchema, PartnerFormValues } from "../PartnerFormSchema";
import { AddressParts } from "@/components/common/MapboxAddressInput";

interface UsePartnerFormProps {
  selectedPlan: {
    title: string;
    paymentType: 'monthly' | 'yearly';
    price: number;
    dealCount: number;
  } | null;
}

export const usePartnerForm = ({ selectedPlan }: UsePartnerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressParts, setAddressParts] = useState<AddressParts | undefined>();
  const navigate = useNavigate();

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      business_name: "",
      email: "",
      phone: "",
      address: "",
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const onSubmit = async (values: PartnerFormValues) => {
    if (!selectedPlan) {
      toast.error("Inget paket valt. Vänligen välj ett paket först.");
      navigate("/partner");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the data with plan information and ensure required fields are present
      const requestData = {
        name: values.name,
        business_name: values.business_name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        message: "", // Tom sträng istället för att ta bort helt för att upprätthålla API-kompatibilitet
        plan_title: selectedPlan.title,
        plan_payment_type: selectedPlan.paymentType,
        plan_price: selectedPlan.price,
        plan_deal_count: selectedPlan.dealCount
      };
      
      const result = await submitPartnerRequest(requestData);
      
      if (result.success) {
        toast.success("Din ansökan har skickats!");
        
        // If we got a redirect URL, the user will be redirected to Stripe Checkout
        if (result.redirectUrl) {
          // The redirect is handled in submitPartnerRequest
          return;
        }
        
        // Otherwise navigate to success page
        navigate("/partner/success");
      } else {
        throw new Error(result.error || "Ett okänt fel inträffade");
      }
    } catch (error) {
      console.error("Error submitting partner request:", error);
      toast.error(error.message || "Något gick fel. Vänligen försök igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    addressParts,
    setAddressParts,
    onSubmit
  };
};
