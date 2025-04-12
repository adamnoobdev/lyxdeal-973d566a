
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
    console.log(`Ursprunglig återställnings-URL: ${data.resetUrl}`);
    
    // Kontrollera att resetUrl är korrekt formaterad och modifiera för att använda /salon/update-password
    try {
      const resetUrlObj = new URL(data.resetUrl);
      
      // Ändra sökvägen till /salon/update-password för konsekvent routing
      const baseUrl = resetUrlObj.origin;
      const hashFragment = resetUrlObj.hash;
      data.resetUrl = `${baseUrl}/salon/update-password${hashFragment}`;
      
      console.log("Korrigerad återställnings-URL:", data.resetUrl);
    } catch (urlError) {
      console.error("Ogiltig URL format:", urlError);
      // Fallback om vi inte kan parsa URL:en
      const domain = req.headers.get("origin") || "https://www.lyxdeal.se";
      data.resetUrl = `${domain}/salon/update-password`;
      console.log("Fallback URL:", data.resetUrl);
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
