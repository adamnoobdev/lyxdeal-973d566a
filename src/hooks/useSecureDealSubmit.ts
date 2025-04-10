
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
    console.log(`[useSecureDealSubmit] Submit initierad med värden:`, values);
    
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
      console.log(`[useSecureDealSubmit] Säkrar erbjudande ${dealId} för ${values.email}`);
      
      // 1. Validera telefonnummerformatet
      const phoneRegex = /^07[0-9]{8}$/;
      if (!phoneRegex.test(values.phone)) {
        console.error(`[useSecureDealSubmit] Telefonvalidering misslyckades: ${values.phone}`);
        toast.error("Vänligen ange ett giltigt svenskt mobilnummer (07XXXXXXXX)");
        setIsSubmitting(false);
        return;
      }
      
      // 2. Säkra rabattkod
      console.log(`[useSecureDealSubmit] Försöker säkra rabattkod...`);
      const codeResult = await secureDiscountCode(dealId, {
        name: values.name,
        email: values.email,
        phone: values.phone
      });
      
      console.log(`[useSecureDealSubmit] Resultat av kodsäkring:`, codeResult);
      
      if (!codeResult.success) {
        toast.error(codeResult.message || "Kunde inte säkra rabattkod");
        setIsSubmitting(false);
        return;
      }
      
      const code = codeResult.code as string;
      console.log(`[useSecureDealSubmit] Rabattkod säkrad: ${code}`);
      
      // 3. Om användaren vill prenumerera på nyhetsbrev
      if (values.subscribeToNewsletter) {
        console.log(`[useSecureDealSubmit] Lägger till användaren i nyhetsbrev...`);
        await addToNewsletter(values.email, values.name);
      }
      
      // 4. Skapa köpregister (fortsätter även om detta misslyckas)
      console.log(`[useSecureDealSubmit] Skapar köpregister...`);
      const purchaseResult = await createPurchaseRecord(values.email, dealId, code);
      console.log(`[useSecureDealSubmit] Köpregister skapat:`, purchaseResult);
      
      // Spara deal-ID i localStorage för att förhindra dubbletter
      saveClaimedDeal(dealId);
      
      // Lagra e-post och kod för bekräftelsemeddelande
      setEmailSent(values.email);
      setDiscountCode(code);
      
      // 5. Skicka e-post med koden
      console.log(`[useSecureDealSubmit] Skickar e-post med kod...`);
      
      // Create a properly structured request body with all required fields
      const emailData = {
        email: values.email.trim().toLowerCase(),
        name: values.name.trim(),
        phone: values.phone.trim(),
        code: code.trim().toUpperCase(),
        dealTitle: dealTitle.trim(),
        subscribedToNewsletter: values.subscribeToNewsletter,
        bookingUrl: bookingUrl || undefined
      };
      
      console.log(`[useSecureDealSubmit] Email request data:`, JSON.stringify(emailData));
      
      try {
        const emailResult = await sendDiscountCodeEmail(
          emailData.email,
          emailData.name,
          emailData.phone,
          emailData.code,
          emailData.dealTitle,
          emailData.subscribedToNewsletter,
          emailData.bookingUrl
        );
        
        console.log(`[useSecureDealSubmit] Resultat av e-postskickning:`, emailResult);
        
        if (emailResult.success) {
          // Kontrollera om vi är i testläge och e-postar dirigeras om
          if (emailResult.data && emailResult.data.productionMode === false) {
            toast.success("Rabattkoden har genererats, men vi är i testläge så e-post skickades till en testadress.", {
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
          console.error("[useSecureDealSubmit] E-postskickning misslyckades:", emailResult.error);
          toast.warning("Din rabattkod har reserverats men kunde inte skickas via e-post. Du kan kopiera koden nedan.", {
            duration: 6000
          });
        }
      } catch (emailError) {
        console.error("[useSecureDealSubmit] Fel vid e-postskickning:", emailError);
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
      
      console.log(`[useSecureDealSubmit] Process slutfördes framgångsrikt med kod: ${code}`);
      
    } catch (error) {
      console.error("[useSecureDealSubmit] Fel vid säkrandet av erbjudande:", error);
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
