
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@3.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") || "");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestPayload {
  email: string;
  name: string;
  phone: string;
  code: string;
  dealTitle: string;
}

const createEmailContent = (name: string, code: string, dealTitle: string): string => {
  // Beräkna utgångstid (72 timmar från nu)
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 72);
  const formattedDate = expiryDate.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { padding: 20px; border: 1px solid #eaeaea; border-radius: 5px; }
        .header { background-color: #f9a826; color: white; padding: 10px 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .code { background-color: #f5f5f5; padding: 10px; font-family: monospace; font-size: 24px; text-align: center; letter-spacing: 2px; border-radius: 5px; margin: 20px 0; }
        .footer { font-size: 12px; color: #999; text-align: center; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Din rabattkod är här!</h1>
        </div>
        <div class="content">
          <p>Hej ${name},</p>
          <p>Tack för att du säkrat erbjudandet "${dealTitle}"! Här är din unika rabattkod:</p>
          
          <div class="code">${code}</div>
          
          <p><strong>Viktigt att veta:</strong></p>
          <ul>
            <li>Koden är giltig i 72 timmar, fram till ${formattedDate}</li>
            <li>Visa denna kod i salongen för att lösa in erbjudandet</li>
            <li>Koden kan endast användas en gång</li>
          </ul>
          
          <p>Vi önskar dig en fantastisk upplevelse!</p>
        </div>
        <div class="footer">
          <p>Detta är ett automatiskt utskick, vänligen svara inte på detta meddelande.</p>
          <p>&copy; ${new Date().getFullYear()} Lyxdeal.se - Alla rättigheter förbehållna</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  // Hantera CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: RequestPayload = await req.json();
    const { email, name, code, dealTitle } = payload;

    if (!email || !name || !code || !dealTitle) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailContent = createEmailContent(name, code, dealTitle);

    const { data, error } = await resend.emails.send({
      from: "Lyxdeal <noreply@lyxdeal.se>",
      to: email,
      subject: `Din rabattkod för "${dealTitle}"`,
      html: emailContent,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
