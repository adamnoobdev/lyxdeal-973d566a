
import { Resend } from "https://esm.sh/resend@1.1.0";

interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  productionMode?: boolean;
  recipient?: string;
  raw?: any;
}

export async function sendEmail(
  recipientEmail: string,
  subject: string,
  htmlContent: string
): Promise<EmailSendResult> {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured in environment");
      return { success: false, error: "Email service API key not configured" };
    }
    
    console.log(`Preparing to send email to ${recipientEmail}`);
    
    const resend = new Resend(resendApiKey);
    
    // Always use production mode
    const isProduction = true;
    
    // Log email details before sending
    console.log(`Sending email: 
      From: Lyxdeal <noreply@lyxdeal.se>
      To: ${recipientEmail}
      Subject: ${subject}
      Production mode: ${isProduction ? 'Yes' : 'No'}
    `);
    
    const emailResponse = await resend.emails.send({
      from: "Lyxdeal <noreply@lyxdeal.se>",
      to: [recipientEmail],
      subject: subject,
      html: htmlContent,
    });
    
    console.log("Email response from Resend:", emailResponse);
    
    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      return { 
        success: false, 
        error: `Email service error: ${emailResponse.error}`,
        raw: emailResponse
      };
    }
    
    return { 
      success: true, 
      messageId: emailResponse.id,
      productionMode: isProduction,
      recipient: recipientEmail
    };
  } catch (error) {
    console.error("Exception in sendEmail:", error);
    console.error("Error stack:", error.stack);
    return { success: false, error: `Exception: ${error.message}` };
  }
}
