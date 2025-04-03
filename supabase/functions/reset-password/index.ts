
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { getSharedEmailStyles } from "../shared/emailStyles.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  email: string;
  resetUrl: string;
}

serve(async (req) => {
  // Hantera OPTIONS-förfrågan för CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("reset-password function started");
    
    // Initiera Resend med API-nyckel
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY är inte konfigurerad i miljövariabler");
      throw new Error("RESEND_API_KEY är inte konfigurerad");
    }
    
    const resend = new Resend(resendApiKey);

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

    const currentYear = new Date().getFullYear();

    // Skapa HTML för e-postinnehåll med vår uppdaterade design
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Återställ ditt lösenord på Lyxdeal</title>
      <style>
        ${getSharedEmailStyles()}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets//Lyxdeal-logo.svg" alt="Lyxdeal" />
          <h1>Återställ ditt lösenord</h1>
        </div>
        <div class="content">
          <p>Hej!</p>
          
          <p>Vi har tagit emot en begäran om att återställa lösenordet för ditt Lyxdeal-konto. Klicka på knappen nedan för att skapa ett nytt lösenord:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" class="button">Återställ lösenord</a>
          </div>
          
          <div class="card">
            <p>Om du inte begärt att återställa ditt lösenord kan du ignorera detta mejl.</p>
            <p>Återställningslänken är giltig i 1 timme.</p>
          </div>
          
          <p>Med vänliga hälsningar,<br>Teamet på Lyxdeal</p>
        </div>
        <div class="footer">
          <p>© ${currentYear} Lyxdeal. Alla rättigheter förbehållna.</p>
          <p>Detta är ett automatiskt genererat meddelande. Vänligen svara inte på detta e-postmeddelande.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Skicka e-post med Resend
    try {
      const emailResponse = await resend.emails.send({
        from: "Lyxdeal <info@lyxdeal.se>",
        to: [data.email],
        subject: "Återställ ditt lösenord på Lyxdeal",
        html: htmlContent,
      });

      console.log("E-post svar:", emailResponse);

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
    } catch (resendError) {
      console.error("Resend API-fel:", resendError);
      
      return new Response(
        JSON.stringify({ 
          error: "Kunde inte skicka e-post via Resend API",
          details: resendError instanceof Error ? resendError.message : String(resendError)
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
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
});
