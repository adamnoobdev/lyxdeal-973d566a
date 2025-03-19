
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { email, business_name, temporary_password } = await req.json();

    if (!email || !business_name || !temporary_password) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(`Sending welcome email to new salon: ${business_name} (${email})`);

    const { data, error } = await resend.emails.send({
      from: "Lyxdeal <noreply@lyxdeal.se>",
      to: [email],
      subject: "Välkommen till Lyxdeal som salongspartner!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6; margin-bottom: 24px;">Välkommen till Lyxdeal!</h1>
          
          <p>Hej ${business_name},</p>
          
          <p>Tack för att du registrerade dig som partner på Lyxdeal! Vi är glada att ha dig med ombord.</p>
          
          <p>Här är dina inloggningsuppgifter till ditt salongskonto:</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Temporärt lösenord:</strong> ${temporary_password}</p>
          </div>
          
          <p>Vi rekommenderar att du ändrar ditt lösenord första gången du loggar in.</p>
          
          <a href="${Deno.env.get("PUBLIC_SITE_URL") || "https://lyxdeal.se"}/salon-login" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-top: 20px;">Logga in på ditt konto</a>
          
          <p style="margin-top: 40px;">Om du har några frågor eller behöver hjälp, tveka inte att kontakta oss.</p>
          
          <p>Med vänliga hälsningar,<br>Lyxdeal-teamet</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("Successfully sent salon welcome email:", data);
    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-salon-welcome function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
