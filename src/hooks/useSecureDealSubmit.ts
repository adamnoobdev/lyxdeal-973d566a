
import { useState } from "react";
import { toast } from "sonner";
import { saveClaimedDeal } from "@/utils/discount-code-utils";
import { SecureFormValues } from "@/components/deal/secure-deal/SecureForm";
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
    console.log(`[useSecureDealSubmit] Submit initiated with values:`, values);
    
    if (hasAlreadyClaimed) {
      toast.error("Du har redan säkrat detta erbjudande.");
      return;
    }

    // Om detta är ett direktbokningserbjudande, dirigera om till boknings-URL
    if (!requiresDiscountCode && bookingUrl) {
      window.open(bookingUrl, '_blank');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log(`[useSecureDealSubmit] Securing deal ${dealId} for ${values.email}`);
      
      // 1. Validera indata - lita på att React Hook Form redan har validerat telefonnummerformatet
      // men utför andra valideringar relaterade till affärslogiken
      const phoneRegex = /^07[0-9]{8}$/;
      if (!phoneRegex.test(values.phone)) {
        console.error(`[useSecureDealSubmit] Phone validation failed: ${values.phone}`);
        toast.error("Vänligen ange ett giltigt svenskt mobilnummer (07XXXXXXXX)");
        setIsSubmitting(false);
        return;
      }
      
      // 2. Säkra rabattkod
      console.log(`[useSecureDealSubmit] Attempting to secure discount code...`);
      const codeResult = await secureDiscountCode(dealId, {
        name: values.name,
        email: values.email,
        phone: values.phone
      });
      
      console.log(`[useSecureDealSubmit] Code securing result:`, codeResult);
      
      if (!codeResult.success) {
        toast.error(codeResult.message || "Kunde inte säkra rabattkod");
        setIsSubmitting(false);
        return;
      }
      
      const code = codeResult.code as string;
      console.log(`[useSecureDealSubmit] Secured discount code: ${code}`);
      
      // 3. Om användaren vill prenumerera på nyhetsbrev
      if (values.subscribeToNewsletter) {
        console.log(`[useSecureDealSubmit] Adding user to newsletter...`);
        await addToNewsletter(values.email, values.name);
      }
      
      // 4. Skapa köpregister (fortsätter även om detta misslyckas)
      console.log(`[useSecureDealSubmit] Creating purchase record...`);
      const purchaseResult = await createPurchaseRecord(values.email, dealId, code);
      console.log(`[useSecureDealSubmit] Purchase record created:`, purchaseResult);
      
      // 5. Skicka e-post med koden
      console.log(`[useSecureDealSubmit] Sending email with code...`);
      const emailResult = await sendDiscountCodeEmail(
        values.email,
        values.name,
        values.phone,
        code,
        dealTitle,
        values.subscribeToNewsletter
      );
      
      console.log(`[useSecureDealSubmit] Email sending result:`, emailResult);
      
      // 6. Visa bekräftelse och hantera framgång
      if (emailResult.success) {
        // Kontrollera om vi är i testläge och e-postarna dirigeras om
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
      
      // Spara deal-ID i localStorage för att förhindra dubbletter
      saveClaimedDeal(dealId);
      
      // Lagra e-post för bekräftelsemeddelande
      setEmailSent(values.email);
      setDiscountCode(code);
      setIsSuccess(true);
      
      // Anropa framgångsåterkallning om det tillhandahålls
      if (onSuccess) {
        onSuccess();
      }
      
      console.log(`[useSecureDealSubmit] Process completed successfully with code: ${code}`);
      
    } catch (error) {
      console.error("[useSecureDealSubmit] Error securing deal:", error);
      toast.error("Något gick fel. Vänligen försök igen senare.");
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
