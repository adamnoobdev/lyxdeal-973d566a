
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getAvailableDiscountCode, markDiscountCodeAsUsed } from "@/utils/discount-codes";
import { validateEmail } from "@/utils/validation";
import { SecureFormValues } from "@/components/deal/secure-deal/SecureForm";
import { createNewDiscountCode, generateRandomCode, saveClaimedDeal } from "@/utils/discount-code-utils";

interface UseSecureDealSubmitProps {
  dealId: number;
  dealTitle: string;
  onSuccess?: () => void;
  hasAlreadyClaimed: boolean;
}

export const useSecureDealSubmit = ({
  dealId,
  dealTitle,
  onSuccess,
  hasAlreadyClaimed
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

    setIsSubmitting(true);
    
    try {
      console.log(`[SecureDealContainer] Securing deal ${dealId} for ${values.email}`);
      
      // 1. Verifiera e-post och telefonnummer
      if (!validateEmail(values.email)) {
        toast.error("Vänligen ange en giltig e-postadress");
        setIsSubmitting(false);
        return;
      }

      // Kontrollera om email redan har använts för detta erbjudande
      const { data: existingEmail } = await supabase
        .from("discount_codes")
        .select("id")
        .eq("deal_id", dealId)
        .eq("customer_email", values.email)
        .limit(1);

      if (existingEmail && existingEmail.length > 0) {
        toast.error("Denna e-postadress har redan använts för detta erbjudande");
        setIsSubmitting(false);
        return;
      }

      // Kontrollera om telefonnumret är giltigt
      const phonePattern = /^(?:\+46|0)7[0-9]{8}$/;
      const formattedPhone = values.phone.replace(/\s+/g, "");
      if (!phonePattern.test(formattedPhone)) {
        toast.error("Vänligen ange ett giltigt svenskt mobilnummer (07XXXXXXXX)");
        setIsSubmitting(false);
        return;
      }

      // Kontrollera om telefonnummer redan har använts för detta erbjudande
      const { data: existingPhone } = await supabase
        .from("discount_codes")
        .select("id")
        .eq("deal_id", dealId)
        .eq("customer_phone", formattedPhone)
        .limit(1);

      if (existingPhone && existingPhone.length > 0) {
        toast.error("Detta telefonnummer har redan använts för detta erbjudande");
        setIsSubmitting(false);
        return;
      }
      
      // 2. Försök hämta en tillgänglig rabattkod
      let code = await getAvailableDiscountCode(dealId);
      
      // Om ingen rabattkod finns, skapa en ny
      if (!code) {
        console.log("No discount code available, generating a new one");
        const newCode = generateRandomCode();
        const codeCreated = await createNewDiscountCode(dealId, newCode);
        
        if (!codeCreated) {
          toast.error("Ett fel uppstod när en ny rabattkod skulle skapas.");
          setIsSubmitting(false);
          return;
        }
        
        code = newCode;
      }
      
      // 3. Markera koden som använd och koppla till kundinformation
      const codeUpdated = await markDiscountCodeAsUsed(code, {
        name: values.name,
        email: values.email,
        phone: formattedPhone
      });
      
      if (!codeUpdated) {
        toast.error("Ett fel uppstod när rabattkoden skulle kopplas till din profil.");
        setIsSubmitting(false);
        return;
      }
      
      // 4. Om användaren valt att prenumerera på nyhetsbrevet
      if (values.subscribeToNewsletter) {
        try {
          // Lägg till användaren i nyhetsbrevstabellen
          const { error: newsletterError } = await supabase
            .from("newsletter_subscribers")
            .insert({
              email: values.email,
              name: values.name,
              interests: ["deals"]  // Standard-intresse, kan anpassas
            })
            .single();
            
          if (newsletterError) {
            // Om felmeddelandet innehåller "duplicate", har användaren redan prenumererat
            if (newsletterError.message.includes("duplicate")) {
              console.log("User already subscribed to newsletter:", values.email);
            } else {
              console.error("Error adding user to newsletter:", newsletterError);
            }
          } else {
            console.log("Successfully added to newsletter:", values.email);
          }
        } catch (newsletterException) {
          console.error("Exception adding to newsletter:", newsletterException);
          // Vi fortsätter trots fel med nyhetsbrevet
        }
      }
      
      // 5. Vi försöker skapa en purchase-post, men fortsätter även om det misslyckas
      // eftersom vi har den viktigaste informationen i discount_codes-tabellen
      try {
        const { error: purchaseError } = await supabase
          .from("purchases")
          .insert({
            customer_email: values.email,
            deal_id: Number(dealId),
            discount_code: code,
          });
          
        if (purchaseError) {
          console.error("Error creating purchase record:", purchaseError);
          // Vi fortsätter ändå eftersom rabattkoden redan är genererad och kopplad till kunden
        }
      } catch (purchaseException) {
        console.error("Exception creating purchase record:", purchaseException);
        // Vi fortsätter trots fel med purchase-posten
      }
      
      // 6. Skicka e-post med rabattkoden för att verifiera e-postadressen
      let emailSent = false;
      let emailResponse;
      try {
        const { data, error } = await supabase.functions.invoke("send-discount-email", {
          body: {
            email: values.email,
            name: values.name,
            phone: formattedPhone,
            code: code,
            dealTitle: dealTitle,
            subscribedToNewsletter: values.subscribeToNewsletter
          },
        });
        
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", data);
          emailResponse = data;
          emailSent = true;
        }
      } catch (emailError) {
        console.error("Exception sending email:", emailError);
      }
      
      // 7. Visa bekräftelse oavsett om e-post skickades eller inte
      if (emailSent) {
        // Check if we're in testing mode and emails are being redirected
        if (emailResponse && emailResponse.productionMode === false) {
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
      
      // Spara erbjudande-ID:t i localStorage för att förhindra dubbletter
      saveClaimedDeal(dealId);
      
      // Store email for confirmation message
      setEmailSent(values.email);
      
      // We still store the discount code in state for debugging purposes, 
      // but we won't display it in the UI
      setDiscountCode(code);
      setIsSuccess(true);
      
      // 8. Anropa success callback om tillhandahållen
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
