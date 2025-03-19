
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

  const handleSubmit = async (values: SecureFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log(`[SecureDealContainer] Securing deal ${dealId} for ${values.email}`);
      
      // 1. Hämta en tillgänglig rabattkod
      const code = await getAvailableDiscountCode(dealId);
      
      if (!code) {
        toast.error("Tyvärr finns det inga fler koder tillgängliga för detta erbjudande.");
        return;
      }
      
      // 2. Markera koden som använd och koppla till kundinformation
      const codeUpdated = await markDiscountCodeAsUsed(code, {
        name: values.name,
        email: values.email,
        phone: values.phone
      });
      
      if (!codeUpdated) {
        toast.error("Ett fel uppstod när rabattkoden skulle kopplas till din profil.");
        return;
      }
      
      // 3. Skicka e-post med rabattkoden
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
        toast.error("Rabattkoden har reserverats men det gick inte att skicka e-postmeddelandet.");
        // Vi fortsätter ändå eftersom rabattkoden har markerats som använd
      } else {
        console.log("Email sent successfully:", data);
      }
      
      // 4. Skapa en purchase-post i databasen
      const { error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          customer_email: values.email,
          deal_id: String(dealId), // Convert to string to avoid type issues
          discount_code: code,
        });
        
      if (purchaseError) {
        console.error("Error creating purchase record:", purchaseError);
        // Vi fortsätter ändå eftersom rabattkoden redan är genererad och skickad
      }
      
      // 5. Visa bekräftelse
      toast.success("Grattis! Din rabattkod har skickats till din e-post.");
      setEmailSent(values.email);
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
