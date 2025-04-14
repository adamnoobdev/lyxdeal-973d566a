
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to send password reset via our edge function
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    
    if (!email || !email.trim()) {
      toast.error("Vänligen ange din e-postadress");
      setError("E-postadress krävs");
      return;
    }

    setLoading(true);

    try {
      // Calculate base URL based on environment
      const hostname = window.location.hostname;
      const isProduction = hostname === "lyxdeal.se" || hostname === "www.lyxdeal.se";
      
      // Use current domain for redirection
      const domainBase = isProduction 
        ? "https://lyxdeal.se" 
        : window.location.origin;
      
      console.log("Sending password reset request for:", email);
      console.log("Using domain base:", domainBase);
      console.log("Current environment is production:", isProduction);
      
      // Call our edge function
      const { data, error } = await supabase.functions.invoke("reset-password", {
        body: {
          email: email.trim(),
          resetUrl: domainBase // Let the edge function handle path construction
        }
      });

      if (error) {
        console.error("Error calling reset-password function:", error);
        setError(`Kunde inte skicka återställningsmejl: ${error.message}`);
        toast.error("Ett problem uppstod vid skickandet av återställningslänk.");
        return;
      }

      console.log("Reset password function response:", data);
      
      if (data && data.success) {
        setSuccess(true);
        toast.success("Återställningsinstruktioner har skickats till din e-post");
      } else {
        console.error("Unexpected response from reset-password function:", data);
        setError("Oväntad respons från servern");
        toast.error("Ett problem uppstod. Försök igen senare.");
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      setError(err instanceof Error ? err.message : "Okänt fel");
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
    error,
    resetPassword
  };
};
