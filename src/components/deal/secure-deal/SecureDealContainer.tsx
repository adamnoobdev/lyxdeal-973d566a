
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAvailableDiscountCode, markDiscountCodeAsUsed } from "@/utils/discount-codes";
import { toast } from "sonner";
import { SecureForm, SecureFormValues } from "./SecureForm";
import { SuccessMessage } from "./SuccessMessage";

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
    setIsSubmitting(true);
    
    try {
      console.log(`[SecureDealContainer] Securing deal ${dealId} for ${values.email}`);
      
      // 1. Försök hämta en tillgänglig rabattkod
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
      
      // 2. Markera koden som använd och koppla till kundinformation
      const codeUpdated = await markDiscountCodeAsUsed(code, {
        name: values.name,
        email: values.email,
        phone: values.phone
      });
      
      if (!codeUpdated) {
        toast.error("Ett fel uppstod när rabattkoden skulle kopplas till din profil.");
        setIsSubmitting(false);
        return;
      }
      
      // 3. Vi försöker skapa en purchase-post, men fortsätter även om det misslyckas
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
      
      // 4. Skicka e-post med rabattkoden
      let emailSent = false;
      try {
        const { data, error } = await supabase.functions.invoke("send-discount-email", {
          body: {
            email: values.email,
            name: values.name,
            phone: values.phone,
            code: code,
            dealTitle: dealTitle
          },
        });
        
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", data);
          emailSent = true;
        }
      } catch (emailError) {
        console.error("Exception sending email:", emailError);
      }
      
      // 5. Visa bekräftelse oavsett om e-post skickades eller inte
      if (emailSent) {
        toast.success("Grattis! Din rabattkod har skickats till din e-post.");
      } else {
        toast.warning("Din rabattkod har reserverats men kunde inte skickas via e-post. Kontakta kundtjänst om du inte får din kod.");
      }
      
      // Store email for confirmation message
      setEmailSent(values.email);
      
      // We still store the discount code in state for debugging purposes, 
      // but we won't display it in the UI
      setDiscountCode(code);
      setIsSuccess(true);
      
      // 6. Anropa success callback om tillhandahållen
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
      {isSuccess ? (
        <SuccessMessage onReset={handleReset} email={emailSent} />
      ) : (
        <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
};
