
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    const { email, business_name, temporary_password, subscription_info } = await req.json();

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
    
    // Formatera datum för tydligare visning
    const formatDate = (dateString) => {
      if (!dateString) return "Inte tillgängligt";
      const date = new Date(dateString);
      return date.toLocaleDateString('sv-SE');
    };
    
    const startDate = formatDate(subscription_info?.start_date);
    const nextBillingDate = formatDate(subscription_info?.next_billing_date);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #520053; padding: 30px 20px; text-align: center; color: white;">
          <img src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets//Lyxdeal-logo.svg" alt="Lyxdeal" style="width: 150px; margin-bottom: 15px;" />
          <h1 style="margin: 0; font-size: 24px;">Välkommen till Lyxdeal!</h1>
        </div>
        
        <div style="background-color: white; padding: 30px 20px;">
          <p>Hej ${business_name},</p>
          
          <p>Tack för att du registrerade dig som partner på Lyxdeal! Vi är glada att ha dig med ombord.</p>
          
          <p>Här är dina inloggningsuppgifter till ditt salongskonto:</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 4px; margin: 20px 0;">
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Temporärt lösenord:</strong> ${temporary_password}</p>
          </div>
          
          <p>Vi rekommenderar att du ändrar ditt lösenord första gången du loggar in.</p>
          
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #520053;">
            <h3 style="margin-top: 0; color: #520053;">Din prenumeration</h3>
            <p><strong>Plan:</strong> ${subscription_info?.plan || 'Standard'}</p>
            <p><strong>Typ:</strong> ${subscription_info?.type === 'yearly' ? 'Årsvis' : 'Månadsvis'}</p>
            <p><strong>Startdatum:</strong> ${startDate}</p>
            <p><strong>Nästa faktureringsdag:</strong> ${nextBillingDate}</p>
          </div>
          
          <p>Din prenumeration ger dig tillgång till alla funktioner i Lyxdeal-plattformen. Du kan när som helst hantera din prenumeration från din kontrollpanel.</p>
          
          <a href="${Deno.env.get("PUBLIC_SITE_URL") || "https://lyxdeal.se"}/salon-login" style="display: inline-block; background-color: #520053; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-top: 20px;">Logga in på ditt konto</a>
          
          <p style="margin-top: 40px;">Om du har några frågor eller behöver hjälp, tveka inte att kontakta oss på info@lyxdeal.se.</p>
          
          <p>Med vänliga hälsningar,<br>Lyxdeal-teamet</p>
        </div>
        
        <div style="background-color: #f9f0fa; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #f3e8f3;">
          <p>Detta är ett automatiskt genererat meddelande, vänligen svara inte på detta email.</p>
          <p>&copy; ${new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    `;

    // Check if we're in production mode
    const testingMode = !Deno.env.get("PRODUCTION_MODE");
    const verifiedEmail = Deno.env.get("VERIFIED_EMAIL") || "adam@larlid.com";
    
    const emailConfig = {
      // In production, use the verified domain. In testing, use Resend's default
      from: testingMode 
        ? "Lyxdeal <onboarding@resend.dev>" 
        : "Lyxdeal <info@lyxdeal.se>",
      // In testing mode, always send to the verified email
      to: testingMode ? [verifiedEmail] : [email],
      subject: "Välkommen till Lyxdeal som salongspartner!",
      html: htmlContent,
      reply_to: "info@lyxdeal.se"
    };
    
    if (testingMode && email !== verifiedEmail) {
      console.log(`TESTING MODE: Redirecting email from ${email} to verified email ${verifiedEmail}`);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailConfig)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error sending email:", data);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: data }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Add note in response if we're in testing mode
    let message = `Välkomstmail skickat till ${email}`;
    if (testingMode && email !== verifiedEmail) {
      message = `TESTLÄGE: Välkomstmail som skulle skickats till ${email} skickades istället till ${verifiedEmail}`;
    }

    console.log("Successfully sent salon welcome email:", data);
    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        message: message,
        testingMode: testingMode
      }),
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
