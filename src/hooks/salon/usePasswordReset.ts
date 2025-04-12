
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Function to send password reset via Supabase
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Vänligen ange din e-postadress");
      return;
    }

    setLoading(true);

    try {
      // Calculate the production URL to use for redirection
      const baseUrl = window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://www.lyxdeal.se";
      
      // Create a specific URL for password reset with the correct path
      const redirectUrl = `${baseUrl}/update-password`;
      
      console.log("Sending reset to:", email);
      console.log("Using redirect URL:", redirectUrl);
      
      // Use Supabase Auth to send reset link
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (supabaseError) {
        console.error("Supabase auth error:", supabaseError);
        toast.error(supabaseError.message || "Ett fel uppstod vid lösenordsåterställning");
        setLoading(false);
        return;
      }

      console.log("Supabase password reset email sent successfully");

      // Also send a custom email via our edge function
      try {
        const { data: customEmailData, error: customEmailError } = await supabase.functions.invoke("reset-password", {
          body: {
            email,
            resetUrl: redirectUrl // URL will be formatted correctly in the edge function
          }
        });

        if (customEmailError) {
          console.warn("Custom reset email warning:", customEmailError);
          console.warn("Standard reset from Supabase was still sent.");
        } else {
          console.log("Custom reset email sent:", customEmailData);
        }
      } catch (customEmailError) {
        console.warn("Could not send custom reset email:", customEmailError);
        console.warn("Standard reset from Supabase was still sent.");
      }

      setSuccess(true);
      toast.success("Återställningsinstruktioner har skickats till din e-post");
    } catch (err) {
      console.error("Password reset error:", err);
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
