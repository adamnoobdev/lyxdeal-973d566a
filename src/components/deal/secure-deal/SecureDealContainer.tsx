
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAvailableDiscountCode, markDiscountCodeAsUsed } from "@/utils/discountCodes";
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

  const handleSubmit = async (values: SecureFormValues) => {
    setIsSubmitting(true);
    
    try {
      // 1. Hämta en tillgänglig rabattkod
      const code = await getAvailableDiscountCode(dealId);
      
      if (!code) {
        toast.error("Tyvärr finns det inga fler koder tillgängliga för detta erbjudande.");
        return;
      }
      
      // 2. Markera koden som använd och koppla till kundinformation
      await markDiscountCodeAsUsed(code, {
        name: values.name,
        email: values.email,
        phone: values.phone
      });
      
      // 3. Skicka e-post med rabattkoden
      const { error } = await supabase.functions.invoke("send-discount-email", {
        body: {
          email: values.email,
          name: values.name,
          phone: values.phone,
          code: code,
          dealTitle: dealTitle
        },
      });
      
      if (error) {
        throw new Error(`Fel vid sändning av e-post: ${error.message}`);
      }
      
      // 4. Skapa en purchase-post i databasen
      const { error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          customer_email: values.email,
          deal_id: dealId,
          discount_code: code,
        });
        
      if (purchaseError) {
        console.error("Error creating purchase record:", purchaseError);
        // Vi fortsätter ändå eftersom rabattkoden redan är genererad och skickad
      }
      
      // 5. Visa bekräftelse
      toast.success("Grattis! Din rabattkod har skickats till din e-post.");
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
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {isSuccess ? (
        <SuccessMessage onReset={handleReset} />
      ) : (
        <SecureForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
};
