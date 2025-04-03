
import { Resend } from "https://esm.sh/resend@2.0.0";
import { generateResetPasswordEmailHtml } from "./emailTemplate.ts";

/**
 * Sends a password reset email using Resend
 */
export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error("RESEND_API_KEY är inte konfigurerad i miljövariabler");
    throw new Error("RESEND_API_KEY är inte konfigurerad");
  }
  
  const resend = new Resend(resendApiKey);
  const htmlContent = generateResetPasswordEmailHtml(resetUrl);
  
  try {
    const emailResponse = await resend.emails.send({
      from: "Lyxdeal <info@lyxdeal.se>",
      to: [email],
      subject: "Återställ ditt lösenord på Lyxdeal",
      html: htmlContent,
    });
    
    console.log("E-post svar:", emailResponse);
    return emailResponse;
  } catch (resendError) {
    console.error("Resend API-fel:", resendError);
    throw resendError;
  }
}
