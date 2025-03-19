
import { Resend } from "npm:resend@3.0.0";
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

  const resend = new Resend(apiKey);
  const emailContent = createEmailContent(name, code, dealTitle);
  
  console.log(`Sending discount email to ${email} for deal "${dealTitle}"`);
  
  const { data, error } = await resend.emails.send({
    from: "Lyxdeal <noreply@lyxdeal.se>",
    to: email,
    subject: `Din rabattkod för "${dealTitle}"`,
    html: emailContent,
    reply_to: "info@lyxdeal.se"
  });

  if (error) {
    console.error("Resend API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send email", details: error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  console.log(`Successfully sent email to ${email}`, data);
  return new Response(
    JSON.stringify({ 
      success: true, 
      data,
      message: `Rabattkod skickad till ${email}`
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    }
  );
}
