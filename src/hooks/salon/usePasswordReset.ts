
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Function to send password reset via our edge function
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Vänligen ange din e-postadress");
      return;
    }

    setLoading(true);

    try {
      // Calculate production URL based on environment
      const isProduction = window.location.hostname !== "localhost" && 
                         !window.location.hostname.includes(".lovableproject.com");
      
      // Use correct domain for redirection
      const productionDomain = isProduction 
        ? "https://lyxdeal.se" 
        : window.location.origin;
      
      // Construct the full URL to the reset page
      const redirectUrl = `${productionDomain}/salon/update-password`;
      
      console.log("Sending reset to:", email);
      console.log("Environment-dependent redirect URL:", redirectUrl);
      console.log("Current environment is production:", isProduction);
      
      try {
        const response = await supabase.functions.invoke("reset-password", {
          body: {
            email,
            resetUrl: redirectUrl
          }
        });

        if (response.error) {
          console.error("Error calling reset-password function:", response.error);
          toast.error("Ett problem uppstod. Försök igen senare.");
          return;
        }

        console.log("Custom reset email sent", response.data);
        setSuccess(true);
        toast.success("Återställningsinstruktioner har skickats till din e-post");
      } catch (customEmailError) {
        console.error("Could not send custom reset email:", customEmailError);
        toast.error("Ett problem uppstod. Försök igen senare.");
      }
    } catch (err) {
      console.error("Error during password reset:", err);
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
