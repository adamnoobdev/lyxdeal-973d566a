
import { corsHeaders } from "./corsConfig.ts";
import { ResetPasswordRequest } from "./types.ts";
import { sendResetPasswordEmail } from "./emailSender.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    
    // Kontrollera om vi har en lovableproject.com URL och ersätt med lyxdeal.se i produktion
    if (data.resetUrl && data.resetUrl.includes('.lovableproject.com')) {
      try {
        // Ersätt lovableproject.com med lyxdeal.se för produktion
        data.resetUrl = data.resetUrl.replace('.lovableproject.com', '.lyxdeal.se');
        console.log("Korrigerad resetUrl för produktionsmiljö:", data.resetUrl);
      } catch (e) {
        console.error("Kunde inte korrigera URL för produktionsmiljö:", e);
      }
    }
    
    // Kontrollera att resetUrl är korrekt formaterad och modifiera för att använda /salon/update-password
    try {
      const resetUrlObj = new URL(data.resetUrl);
      
      // Ändra sökvägen till /salon/update-password för konsekvent routing
      const baseUrl = resetUrlObj.origin;
      data.resetUrl = `${baseUrl}/salon/update-password`;
      
      console.log("Korrigerad återställnings-URL:", data.resetUrl);
    } catch (urlError) {
      console.error("Ogiltig URL format:", urlError);
      // Fallback om vi inte kan parsa URL:en
      let domain = req.headers.get("origin") || "https://www.lyxdeal.se";
      
      // Om vi är i utvecklingsmiljö, använd origin, annars använd lyxdeal.se
      if (domain.includes('lovableproject.com')) {
        domain = "https://www.lyxdeal.se";
      }
      
      data.resetUrl = `${domain}/salon/update-password`;
      console.log("Fallback URL:", data.resetUrl);
    }

    // Skapa en Supabase-klient för att generera en återställningstoken
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase miljövariabler saknas");
      throw new Error("Konfigurationsfel: Supabase-miljövariabler saknas");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generera en återställningslänk med token
    const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: data.resetUrl,
      }
    );
    
    if (resetError) {
      console.error("Fel vid generering av återställningslänk:", resetError);
      return new Response(
        JSON.stringify({ error: "Kunde inte generera återställningslänk" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Återställningslänk genererad");

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
