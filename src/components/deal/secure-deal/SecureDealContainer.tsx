
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAvailableDiscountCode, markDiscountCodeAsUsed } from "@/utils/discount-codes";
import { toast } from "sonner";
import { SecureForm, SecureFormValues } from "./SecureForm";
import { SuccessMessage } from "./SuccessMessage";
import { validateEmail } from "@/utils/validation";

interface SecureDealContainerProps {
  dealId: number;
  dealTitle: string;
  onSuccess?: () => void;
}

export const SecureDealContainer = ({ 
  dealId, 
  dealTitle,
  onSuccess 
}: SecureDealContainerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [hasAlreadyClaimed, setHasAlreadyClaimed] = useState(false);

  // Kontrollera om användaren redan har säkrat detta erbjudande
  useEffect(() => {
    const checkIfAlreadyClaimed = async () => {
      try {
        // Kolla om det finns tidigare anspråk baserat på IP/browser fingerprint
        const storedClaims = localStorage.getItem('claimed_deals') || '[]';
        const claimedDeals = JSON.parse(storedClaims);
        
        if (claimedDeals.includes(dealId.toString())) {
          setHasAlreadyClaimed(true);
        }

        // Kolla även i databasen efter tidigare anspråk
        const { data: existingClaims, error } = await supabase
          .from("discount_codes")
          .select("id")
          .eq("deal_id", dealId)
          .eq("is_used", true)
          .limit(1);

        if (error) {
          console.error("Error checking existing claims:", error);
          return;
        }

        // Om användaren tidigare har använt en rabattkod för detta erbjudande
        if (existingClaims && existingClaims.length > 0) {
          const claimedIPAddress = localStorage.getItem('claimed_from_ip') || '';
          const { data: ipMatch } = await supabase.functions.invoke("check-previous-claims", {
            body: { 
              dealId, 
              previousIP: claimedIPAddress 
            }
          });
          
          if (ipMatch && ipMatch.isSameDevice) {
            setHasAlreadyClaimed(true);
          }
        }
      } catch (error) {
        console.error("Error checking claims:", error);
      }
    };

    checkIfAlreadyClaimed();
  }, [dealId]);

  // Funktion för att generera en slumpmässig rabattkod
  const generateRandomCode = (length = 8): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };

  // Funktion för att skapa en ny rabattkod i databasen
  const createNewDiscountCode = async (code: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("discount_codes")
        .insert({
          deal_id: dealId,
          code: code,
          is_used: false
        });
        
      if (error) {
        console.error("Error creating discount code:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Exception creating discount code:", error);
      return false;
    }
  };

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
        const codeCreated = await createNewDiscountCode(newCode);
        
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
      
      // 4. Vi försöker skapa en purchase-post, men fortsätter även om det misslyckas
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
      
      // 5. Skicka e-post med rabattkoden för att verifiera e-postadressen
      let emailSent = false;
      let emailResponse;
      try {
        const { data, error } = await supabase.functions.invoke("send-discount-email", {
          body: {
            email: values.email,
            name: values.name,
            phone: formattedPhone,
            code: code,
            dealTitle: dealTitle
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
      
      // 6. Visa bekräftelse oavsett om e-post skickades eller inte
      if (emailSent) {
        // Check if we're in testing mode and emails are being redirected
        if (emailResponse && emailResponse.productionMode === false) {
          toast.success("Rabattkoden har genererats, men vi är i testläge så e-post skickades till en testadress.");
        } else {
          toast.success("Grattis! Din rabattkod har skickats till din e-post.");
        }
      } else {
        toast.warning("Din rabattkod har reserverats men kunde inte skickas via e-post. Kontakta kundtjänst om du inte får din kod.");
      }
      
      // Spara erbjudande-ID:t i localStorage för att förhindra dubbletter
      const storedClaims = localStorage.getItem('claimed_deals') || '[]';
      const claimedDeals = JSON.parse(storedClaims);
      
      if (!claimedDeals.includes(dealId.toString())) {
        claimedDeals.push(dealId.toString());
        localStorage.setItem('claimed_deals', JSON.stringify(claimedDeals));
      }
      
      // Store email for confirmation message
      setEmailSent(values.email);
      
      // We still store the discount code in state for debugging purposes, 
      // but we won't display it in the UI
      setDiscountCode(code);
      setIsSuccess(true);
      
      // 7. Anropa success callback om tillhandahållen
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

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {hasAlreadyClaimed ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Du har redan säkrat detta erbjudande
          </h2>
          <p className="text-gray-600 mb-4">
            Du kan endast säkra ett erbjudande en gång. Kontrollera din e-post efter den rabattkod som redan skickats.
          </p>
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            onClick={() => window.history.back()}
          >
            Tillbaka till erbjudandet
          </button>
        </div>
      ) : isSuccess ? (
        <SuccessMessage onReset={handleReset} email={emailSent} />
      ) : (
        <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
};
