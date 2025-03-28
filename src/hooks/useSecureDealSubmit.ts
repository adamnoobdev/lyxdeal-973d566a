
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { SecureFormValues } from "@/components/deal/secure-deal/SecureForm";

export const useSecureDealSubmit = (dealId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const navigate = useNavigate();

  // Check if the user has previously claimed this deal
  const checkPreviousClaims = async (email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("check-previous-claims", {
        body: { email, dealId: Number(dealId) }
      });

      if (error) {
        console.error("Error checking previous claims:", error);
        return false;
      }

      return data.hasClaimed;
    } catch (error) {
      console.error("Exception checking previous claims:", error);
      return false;
    }
  };

  const handleSubmit = async (formData: SecureFormValues) => {
    if (!formData.termsAccepted) {
      toast.error("Du måste godkänna våra villkor för att fortsätta");
      return;
    }
    
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Check if user has already claimed this deal
      const hasClaimed = await checkPreviousClaims(formData.email);
      
      if (hasClaimed) {
        setAlreadyClaimed(true);
        setIsSubmitting(false);
        return;
      }

      // Generate a discount code
      const { data, error } = await supabase
        .from("discount_codes")
        .insert([
          {
            deal_id: Number(dealId),
            code: generateDiscountCode(8),
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone,
            is_used: false
          }
        ])
        .select();

      if (error) {
        console.error("Error generating discount code:", error);
        toast.error("Ett fel uppstod. Vänligen försök igen senare.");
        setIsSubmitting(false);
        return;
      }

      // Successfully created the discount code
      if (data && data.length > 0) {
        const discountCode = data[0].code;
        
        // Send email with the discount code (if email sending is enabled)
        const emailSendResponse = await supabase.functions.invoke("send-discount-email", {
          body: {
            name: formData.name,
            email: formData.email,
            code: discountCode,
            dealId: Number(dealId)
          }
        });

        if (emailSendResponse.error) {
          console.warn("Email sending failed but code was generated:", emailSendResponse.error);
          // Don't show error to user as the code was generated successfully
        }

        setIsSuccess(true);
        // Track the purchase
        await supabase
          .from("purchases")
          .insert([
            {
              deal_id: Number(dealId),
              customer_email: formData.email,
              discount_code: discountCode
            }
          ]);

        // Decrease quantity
        const { data: deal } = await supabase
          .from("deals")
          .select("stripe_price_id")
          .eq("id", dealId)
          .single();

        if (deal?.stripe_price_id) {
          await supabase.rpc("decrease_quantity", { price_id: deal.stripe_price_id });
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("Ett fel uppstod. Vänligen försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate a random discount code
  const generateDiscountCode = (length: number) => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  return {
    handleSubmit,
    isSubmitting,
    isSuccess,
    alreadyClaimed
  };
};
