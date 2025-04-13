
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
    
    // Förbered URL för återställningssidan och håll koll på om vi är i utveckling eller produktion
    let resetUrl = data.resetUrl;
    let isLocalhost = resetUrl.includes('localhost');
    let isLovableProject = resetUrl.includes('.lovableproject.com');
    let isProduction = !isLocalhost && !isLovableProject;
    
    console.log("URL miljö:", isLocalhost ? "localhost" : isLovableProject ? "lovableproject" : "produktion");
    
    // När vi använder lovableproject.com men vill generera länkar för produktion
    if (isLovableProject) {
      try {
        // Ersätt lovableproject.com med lyxdeal.se för produktion
        resetUrl = resetUrl.replace('.lovableproject.com', '.lyxdeal.se');
        console.log("Korrigerad resetUrl för produktionsmiljö:", resetUrl);
      } catch (e) {
        console.error("Kunde inte korrigera URL för produktionsmiljö:", e);
      }
    }
    
    // Säkerställ att URL alltid pekar mot /salon/update-password
    try {
      const resetUrlObj = new URL(resetUrl);
      resetUrlObj.pathname = '/salon/update-password';
      resetUrl = resetUrlObj.toString();
      console.log("Standardiserad återställnings-URL:", resetUrl);
    } catch (urlError) {
      console.error("Ogiltig URL format:", urlError);
      // Fallback om vi inte kan parsa URL:en
      let domain = req.headers.get("origin") || "https://www.lyxdeal.se";
      
      // Om vi är i utvecklingsmiljö, använd origin, annars använd lyxdeal.se
      if (domain.includes('lovableproject.com')) {
        domain = domain.replace('lovableproject.com', 'lyxdeal.se');
      }
      
      resetUrl = `${domain}/salon/update-password`;
      console.log("Fallback URL:", resetUrl);
    }

    // Skapa en Supabase-klient för att generera en återställningstoken
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase miljövariabler saknas");
      throw new Error("Konfigurationsfel: Supabase-miljövariabler saknas");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Generera en token för användarens email, men skicka INTE Supabase-mejlet
    // Vi använder admin-API:et för att skapa en återställningstoken utan att skicka mejl
    const { data: userData, error: userError } = await supabase
      .auth
      .admin
      .generateLink({
        type: "recovery",
        email: data.email,
        options: {
          redirectTo: resetUrl
        }
      });
    
    if (userError) {
      console.error("Fel vid generering av återställningslänk:", userError);
      return new Response(
        JSON.stringify({ 
          error: "Kunde inte generera återställningslänk", 
          details: userError 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!userData || !userData.properties || !userData.properties.action_link) {
      console.error("Ingen action_link genererades:", userData);
      return new Response(
        JSON.stringify({ 
          error: "Kunde inte generera återställningslänk", 
          details: "Ingen action_link genererades" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Extrahera token från den genererade länken
    const actionLink = userData.properties.action_link;
    console.log("Återställningslänk genererad:", actionLink);
    
    // Skicka e-post med vår anpassade mall via Resend
    const emailResponse = await sendResetPasswordEmail(data.email, actionLink);

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
