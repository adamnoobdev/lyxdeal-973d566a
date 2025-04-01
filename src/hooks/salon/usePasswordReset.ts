
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Funktion för att skicka lösenordsåterställning via Supabase
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Vänligen ange din e-postadress");
      return;
    }

    setLoading(true);

    try {
      // Använd Supabase Auth för att skicka återställningslänk
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/salon/update-password`,
      });

      if (error) {
        toast.error(error.message);
        console.error("Fel vid lösenordsåterställning:", error);
        setLoading(false);
        return;
      }

      // Skicka också ett anpassat e-postmeddelande via vår edge function
      const resetUrl = `${window.location.origin}/salon/update-password`;
      
      try {
        const response = await supabase.functions.invoke("reset-password", {
          body: {
            email,
            resetUrl
          }
        });

        if (!response.error) {
          console.log("Anpassat återställningsmail skickat", response.data);
        } else {
          console.warn("Varning: Kunde inte skicka anpassat återställningsmail:", response.error);
          console.warn("Standardåterställning från Supabase skickades ändå.");
        }
      } catch (customEmailError) {
        console.warn("Varning: Kunde inte skicka anpassat återställningsmail:", customEmailError);
        console.warn("Standardåterställning från Supabase skickades ändå.");
      }

      setSuccess(true);
      toast.success("Återställningsinstruktioner har skickats till din e-post");
    } catch (err) {
      console.error("Fel vid lösenordsåterställning:", err);
      toast.error("Ett problem uppstod. Försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    success,
    resetPassword
  };
};
