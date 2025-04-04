
import { corsHeaders } from "./corsConfig.ts";
import { ResetPasswordRequest } from "./types.ts";
import { sendResetPasswordEmail } from "./emailSender.ts";

/**
 * Handles the reset password request
 */
export async function handleResetPasswordRequest(req: Request): Promise<Response> {
  try {
    // Tolka förfrågans body
    const data: ResetPasswordRequest = await req.json();
    
    if (!data.email || !data.resetUrl) {
      console.error("Saknar obligatoriska fält i förfrågan:", data);
      return new Response(
        JSON.stringify({ 
          error: "Saknar obligatoriska fält", 
          received: Object.keys(data)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Skickar lösenordsåterställning till: ${data.email}`);
    console.log(`Återställnings-URL: ${data.resetUrl}`);
    
    // Kontrollera att resetUrl är korrekt formaterad
    const resetUrlObj = new URL(data.resetUrl);
    if (!resetUrlObj.pathname.includes("/salon/update-password")) {
      console.warn("Ogiltig återställnings-URL format, korrigerar:", data.resetUrl);
      // Säkerställ att URL:en har rätt format
      const baseUrl = resetUrlObj.origin;
      data.resetUrl = `${baseUrl}/salon/update-password`;
      console.log("Korrigerad återställnings-URL:", data.resetUrl);
    }

    // Skicka e-post med Resend
    const emailResponse = await sendResetPasswordEmail(data.email, data.resetUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Återställningsinstruktioner skickade",
        data: emailResponse
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Fel i reset-password-funktionen:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}
