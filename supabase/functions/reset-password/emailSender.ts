
import { Resend } from "https://esm.sh/resend@2.0.0";
import { generateResetPasswordEmailHtml } from "./emailTemplate.ts";

/**
 * Sends a password reset email using Resend
 */
export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  console.log("=== Starting sendResetPasswordEmail function ===");
  
  // Check for required environment variable
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error("CRITICAL ERROR: RESEND_API_KEY is not configured in environment variables");
    throw new Error("RESEND_API_KEY is not configured");
  }
  
  console.log("Email recipient:", email);
  console.log("Reset URL to use:", resetUrl);
  
  try {
    console.log("Initializing Resend client with API key");
    const resend = new Resend(resendApiKey);
    
    console.log("Generating HTML email content");
    const htmlContent = generateResetPasswordEmailHtml(resetUrl);
    
    console.log("Preparing to send email with Resend");
    const emailResponse = await resend.emails.send({
      from: "Lyxdeal <info@lyxdeal.se>",
      to: [email],
      subject: "Återställ ditt lösenord på Lyxdeal",
      html: htmlContent,
    });
    
    console.log("Email sending complete. Response:", JSON.stringify(emailResponse));
    
    if (emailResponse.error) {
      console.error("Email sending failed with Resend error:", JSON.stringify(emailResponse.error));
      throw new Error(`Email sending failed: ${JSON.stringify(emailResponse.error)}`);
    }
    
    return emailResponse;
  } catch (error) {
    console.error("=== CRITICAL ERROR in sendResetPasswordEmail ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace available");
    console.error("=== End of error details ===");
    throw error;
  } finally {
    console.log("=== Completed sendResetPasswordEmail function ===");
  }
}
