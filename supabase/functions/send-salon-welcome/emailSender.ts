
import { Resend } from "https://esm.sh/resend@2.0.0";

export async function sendWelcomeEmail(
  recipientEmail: string,
  subject: string,
  htmlContent: string
): Promise<any> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured in environment variables");
    throw new Error("RESEND_API_KEY is not configured");
  }
  
  console.log("Using Resend API with key starting with:", resendApiKey.substring(0, 5) + "...");
  const resend = new Resend(resendApiKey);
  
  try {
    const emailResponse = await resend.emails.send({
      from: "Lyxdeal <no-reply@lyxdeal.se>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
      reply_to: "support@lyxdeal.se"
    });

    console.log("Email sending response:", emailResponse);
    return emailResponse;
  } catch (error) {
    console.error("Resend API error:", error);
    console.error("Resend error details:", error.message);
    throw error;
  }
}
