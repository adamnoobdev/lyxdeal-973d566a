
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
      // Beräkna produktions-URL baserad på miljö
      const isProduction = window.location.hostname !== "localhost" && 
                          !window.location.hostname.includes(".lovableproject.com");
      
      // Använd korrekt domän för omdirigering
      const productionDomain = isProduction 
        ? "https://lyxdeal.se" 
        : window.location.origin;
      
      // Konstruera den fullständiga URL:en till återställningssidan
      const redirectUrl = `${productionDomain}/salon/update-password`;
      
      console.log("Skickar återställning till:", email);
      console.log("Miljöberoende omdirigerings-URL:", redirectUrl);
      console.log("Aktuell miljö är produktion:", isProduction);
      
      // Vi skickar INTE längre via Supabase Auth för att undvika dubbla mejl
      // Använd istället direkt vår edge function för anpassat mejl
      try {
        const response = await supabase.functions.invoke("reset-password", {
          body: {
            email,
            resetUrl: redirectUrl
          }
        });

        if (response.error) {
          toast.error("Ett problem uppstod. Försök igen senare.");
          console.error("Fel vid anrop av reset-password funktionen:", response.error);
          setLoading(false);
          return;
        }

        console.log("Anpassat återställningsmail skickat", response.data);
        setSuccess(true);
        toast.success("Återställningsinstruktioner har skickats till din e-post");
      } catch (customEmailError) {
        console.error("Kunde inte skicka anpassat återställningsmail:", customEmailError);
        toast.error("Ett problem uppstod. Försök igen senare.");
      }
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
