
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
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (values: SecureFormValues) => {
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
    setEmailError(null);
    
    try {
      // 1. Validera telefonnummerformatet
      const phoneRegex = /^07[0-9]{8}$/;
      if (!phoneRegex.test(values.phone)) {
        toast.error("Vänligen ange ett giltigt svenskt mobilnummer (07XXXXXXXX)");
        setIsSubmitting(false);
        return;
      }
      
      // 2. Säkra rabattkod
      const codeResult = await secureDiscountCode(dealId, {
        name: values.name,
        email: values.email,
        phone: values.phone
      });
      
      if (!codeResult.success) {
        toast.error(codeResult.message || "Kunde inte säkra rabattkod");
        setIsSubmitting(false);
        return;
      }
      
      const code = codeResult.code as string;
      
      // 3. Om användaren vill prenumerera på nyhetsbrev
      if (values.subscribeToNewsletter) {
        await addToNewsletter(values.email, values.name);
      }
      
      // 4. Skapa köpregister
      await createPurchaseRecord(values.email, dealId, code);
      
      // Spara deal-ID i localStorage för att förhindra dubbletter
      saveClaimedDeal(dealId);
      
      // Lagra e-post och kod för bekräftelsemeddelande
      setEmailSent(values.email);
      setDiscountCode(code);
      
      // 5. Skicka e-post med koden
      try {
        const emailResult = await sendDiscountCodeEmail(
          values.email.trim().toLowerCase(),
          values.name.trim(),
          values.phone.trim(),
          code.trim().toUpperCase(),
          dealTitle.trim(),
          values.subscribeToNewsletter,
          bookingUrl || undefined
        );
        
        if (emailResult.success) {
          // Kontrollera om vi är i testläge och e-postar dirigeras om
          if (emailResult.data && emailResult.data.productionMode === false) {
            toast.success("Rabattkoden har skickats till din e-post. (Test-läge)", {
              duration: 5000
            });
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
          setEmailError("E-postskickning misslyckades: " + (emailResult.error || "Okänt fel"));
          toast.warning("Din rabattkod har reserverats men kunde inte skickas via e-post. Du kan kopiera koden nedan.", {
            duration: 6000
          });
        }
      } catch (emailError) {
        setEmailError("E-postskickning misslyckades: " + (emailError instanceof Error ? emailError.message : "Okänt fel"));
        toast.warning("Din rabattkod har reserverats men kunde inte skickas via e-post. Du kan kopiera koden nedan.", {
          duration: 6000
        });
      }
      
      // Markera processen som framgångsrik även om e-postskickning misslyckas
      setIsSuccess(true);
      
      // Anropa framgångsåterkallning om det tillhandahålls
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      toast.error("Något gick fel. Vänligen försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setEmailSent(null);
    setDiscountCode(null);
    setEmailError(null);
  };

  return {
    isSubmitting,
    isSuccess,
    emailSent,
    discountCode,
    emailError,
    handleSubmit,
    handleReset
  };
};
