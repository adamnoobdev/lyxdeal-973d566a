
// Vi ersätter Resend-npm-paketet med en enkel fetch-implementation
import { createEmailContent } from "./emailTemplate.ts";
import { RequestPayload } from "./types.ts";
import { corsHeaders } from "./corsConfig.ts";

export async function sendDiscountEmail(payload: RequestPayload) {
  const { email, name, code, dealTitle } = payload;
  
  // Check if RESEND_API_KEY is configured
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY is not configured" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  // Skapa e-postinnehållet med vår rena HTML-funktion
  const emailContent = createEmailContent(name, code, dealTitle);
  
  console.log(`Sending discount email to ${email} for deal "${dealTitle}"`);
  
  try {
    // Använd fetch för att anropa Resend API istället för npm-paketet
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Lyxdeal <noreply@lyxdeal.se>",
        to: email,
        subject: `Din rabattkod för "${dealTitle}"`,
        html: emailContent,
        reply_to: "info@lyxdeal.se"
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Resend API Error:", responseData);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: responseData }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Successfully sent email to ${email}`, responseData);
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: responseData,
        message: `Rabattkod skickad till ${email}`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (err) {
    console.error("Error sending email:", err);
    return new Response(
      JSON.stringify({ 
        error: "Exception when sending email", 
        details: err instanceof Error ? err.message : String(err) 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
