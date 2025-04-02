
import { useState } from "react";
import { toast } from "sonner";
import { saveClaimedDeal } from "@/utils/discount-code-utils";
import { SecureFormValues } from "@/components/deal/secure-deal/SecureForm";
import { validateDealInput } from "@/utils/deals/dealValidation";
import { secureDiscountCode, createPurchaseRecord } from "@/utils/discount-codes/codeSecuring";
import { sendDiscountCodeEmail } from "@/utils/email/emailUtils";
import { addToNewsletter } from "@/utils/newsletter/newsletterUtils";

interface UseSecureDealSubmitProps {
  dealId: number;
  dealTitle: string;
  onSuccess?: () => void;
  hasAlreadyClaimed: boolean;
  requiresDiscountCode?: boolean;
  bookingUrl?: string | null;
}

export const useSecureDealSubmit = ({
  dealId,
  dealTitle,
  onSuccess,
  hasAlreadyClaimed,
  requiresDiscountCode = true,
  bookingUrl
}: UseSecureDealSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  const handleSubmit = async (values: SecureFormValues) => {
    if (hasAlreadyClaimed) {
      toast.error("Du har redan säkrat detta erbjudande.");
      return;
    }

    // If this is a direct booking deal, redirect to the booking URL
    if (!requiresDiscountCode && bookingUrl) {
      window.open(bookingUrl, '_blank');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log(`[SecureDealContainer] Securing deal ${dealId} for ${values.email}`);
      
      // 1. Validate input data
      const validation = await validateDealInput(dealId, values.email, values.phone);
      
      if (!validation.isValid) {
        toast.error(validation.message);
        setIsSubmitting(false);
        return;
      }
      
      const formattedPhone = validation.formattedPhone as string;
      
      // 2. Secure discount code
      const codeResult = await secureDiscountCode(dealId, {
        name: values.name,
        email: values.email,
        phone: formattedPhone
      });
      
      if (!codeResult.success) {
        toast.error(codeResult.message);
        setIsSubmitting(false);
        return;
      }
      
      const code = codeResult.code as string;
      
      // 3. If user wants newsletter subscription
      if (values.subscribeToNewsletter) {
        await addToNewsletter(values.email, values.name);
      }
      
      // 4. Create purchase record (we continue even if this fails)
      await createPurchaseRecord(values.email, dealId, code);
      
      // 5. Send email with the code
      const emailResult = await sendDiscountCodeEmail(
        values.email,
        values.name,
        formattedPhone,
        code,
        dealTitle,
        values.subscribeToNewsletter
      );
      
      // 6. Show confirmation and handle success
      if (emailResult.success) {
        // Check if we're in testing mode and emails are being redirected
        if (emailResult.data && emailResult.data.productionMode === false) {
          toast.success("Rabattkoden har genererats, men vi är i testläge så e-post skickades till en testadress.");
        } else {
          toast.success("Grattis! Din rabattkod har skickats till din e-post.");
          
          if (values.subscribeToNewsletter) {
            toast.success("Du har också lagts till i vårt nyhetsbrev. Välkommen!", {
              duration: 5000,
              position: "bottom-center"
            });
          }
        }
      } else {
        toast.warning("Din rabattkod har reserverats men kunde inte skickas via e-post. Kontakta kundtjänst om du inte får din kod.");
      }
      
      // Save deal-ID in localStorage to prevent duplicates
      saveClaimedDeal(dealId);
      
      // Store email for confirmation message
      setEmailSent(values.email);
      setDiscountCode(code);
      setIsSuccess(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error securing deal:", error);
      toast.error("Något gick fel. Vänligen försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setEmailSent(null);
    setDiscountCode(null);
  };

  return {
    isSubmitting,
    isSuccess,
    emailSent,
    discountCode,
    handleSubmit,
    handleReset
  };
};
