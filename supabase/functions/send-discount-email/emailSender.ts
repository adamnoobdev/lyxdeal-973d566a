
import { generateEmailHtml } from "./emailTemplate.ts";
import { RequestPayload } from "./types.ts";
import { corsHeaders } from "./corsConfig.ts";

export async function sendDiscountEmail(payload: RequestPayload) {
  const { email, name, code, dealTitle, bookingUrl, subscribedToNewsletter } = payload;
  
  try {
    // Kontrollera om RESEND_API_KEY är konfigurerad
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY är inte konfigurerad");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY är inte konfigurerad" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Skapa mejlinnehållet med vår mallfunktion
    const emailContent = generateEmailHtml({
      name, 
      code, 
      dealTitle,
      bookingUrl,
      subscribedToNewsletter
    });
    
    console.log(`Skickar rabattkodsmejl till ${email} för erbjudande "${dealTitle}"`);
    if (bookingUrl) {
      console.log(`Inkluderar boknings-URL: ${bookingUrl}`);
    }
    
    // Ställ in produktionsläge baserat på miljövariabel
    const productionMode = Deno.env.get("ENVIRONMENT") === "production";
    
    // I produktionsläge, använd den faktiska mottagarens e-post
    // I icke-produktionsläge, omdirigera till den verifierade e-posten
    const verifiedEmail = Deno.env.get("VERIFIED_EMAIL") || "test@example.com";
    const recipient = productionMode ? email : verifiedEmail;
    
    const emailConfig = {
      from: productionMode 
        ? "Lyxdeal <info@lyxdeal.se>" 
        : "Lyxdeal <onboarding@resend.dev>",
      to: recipient,
      subject: `Din rabattkod för "${dealTitle}"`,
      html: emailContent,
      reply_to: "support@lyxdeal.se"
    };
    
    // Logga om vi omdirigerar e-post i icke-produktionsläge
    if (!productionMode && email !== verifiedEmail) {
      console.log(`TESTLÄGE: Omdirigerar e-post från ${email} till verifierad e-post ${verifiedEmail}`);
    }

    // Detaljerad loggning före API-anrop
    console.log("Skickar e-post med konfiguration:", JSON.stringify({
      ...emailConfig,
      html: "[HTML-innehåll utelämnat för korthet]"
    }, null, 2));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailConfig)
    });

    // Logga hela svaret för felsökning
    const responseText = await response.text();
    console.log(`Resend API-svar (${response.status}):`, responseText);
    
    // Parsa tillbaka svaret till JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Kunde inte parsa svar som JSON:", responseText);
      responseData = { error: "Ogiltigt JSON-svar", raw: responseText };
    }

    if (!response.ok) {
      console.error("Resend API-fel:", responseData);
      return new Response(
        JSON.stringify({ 
          error: "Kunde inte skicka e-post", 
          details: responseData,
          apiConfig: {
            ...emailConfig,
            html: "[Innehåll utelämnat]"
          }
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Lägg till information i svaret om vart e-posten skickades
    let message = `Rabattkod skickad till ${email}`;
    if (!productionMode && email !== verifiedEmail) {
      message = `TESTLÄGE: Rabattkod som skulle skickats till ${email} skickades istället till ${verifiedEmail}`;
    }

    console.log(`Mejlet skickades framgångsrikt`, responseData);
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: responseData,
        message: message,
        productionMode: productionMode,
        actualRecipient: recipient
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (err) {
    console.error("Fel vid skickande av e-post:", err);
    return new Response(
      JSON.stringify({ 
        error: "Undantag vid skickande av e-post", 
        details: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
