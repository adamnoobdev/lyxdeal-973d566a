
// We replace Resend-npm-package with a simple fetch-implementation
import { createEmailContent } from "./emailTemplates/template.ts";
import { RequestPayload } from "./types.ts";
import { corsHeaders } from "./corsConfig.ts";

export async function sendDiscountEmail(payload: RequestPayload) {
  const { email, name, code, dealTitle, bookingUrl } = payload;
  
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

  // Create the email content using our template function
  const emailContent = createEmailContent(name, code, dealTitle, bookingUrl);
  
  console.log(`Sending discount email to ${email} for deal "${dealTitle}"`);
  if (bookingUrl) {
    console.log(`Including booking URL: ${bookingUrl}`);
  }
  
  try {
    // Set production mode based on environment variable
    const productionMode = Deno.env.get("ENVIRONMENT") === "production";
    
    // In production mode, use the actual recipient's email
    // In non-production mode, redirect to the verified email
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
    
    // Log if we're redirecting emails in non-production mode
    if (!productionMode && email !== verifiedEmail) {
      console.log(`TESTING MODE: Redirecting email from ${email} to verified email ${verifiedEmail}`);
    }

    // Detailed logging before API call
    console.log("Sending email with config:", JSON.stringify({
      ...emailConfig,
      html: "[HTML content omitted for brevity]"
    }));

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailConfig)
    });

    // Log the full response for debugging
    const responseText = await response.text();
    console.log(`Resend API Response (${response.status}):`, responseText);
    
    // Parse the response back to JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText);
      responseData = { error: "Invalid JSON response", raw: responseText };
    }

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

    // Add information in response about where the email was sent
    let message = `Rabattkod skickad till ${email}`;
    if (!productionMode && email !== verifiedEmail) {
      message = `TESTLÄGE: Rabattkod som skulle skickats till ${email} skickades istället till ${verifiedEmail}`;
    }

    console.log(`Successfully sent email`, responseData);
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
