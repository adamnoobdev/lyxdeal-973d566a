
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  business_name: string;
  temporary_password: string;
  subscription_info?: {
    plan: string;
    type: string;
    start_date: string;
    next_billing_date: string | null;
  }
}

serve(async (req) => {
  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("send-salon-welcome function started");
    
    // Initialize Resend with API key
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("RESEND_API_KEY is not configured");
    }
    
    const resend = new Resend(resendApiKey);

    // Parse request body
    let data: WelcomeEmailRequest;
    try {
      data = await req.json();
      console.log("Request payload received:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate request data
    if (!data.email || !data.business_name || !data.temporary_password) {
      console.error("Missing required fields in request:", data);
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          received: Object.keys(data)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Format subscription data if available
    const subInfo = data.subscription_info;
    const planTypeText = subInfo?.type === "yearly" ? "årsvis" : "månadsvis";
    const nextBillingDate = subInfo?.next_billing_date 
      ? new Date(subInfo.next_billing_date).toLocaleDateString('sv-SE')
      : "N/A";

    // Create HTML email content
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Välkommen till Lyxdeal</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #f8f8f8;
          padding: 20px;
          text-align: center;
          border-bottom: 3px solid #9333ea;
        }
        .content {
          padding: 20px;
        }
        .credentials {
          background-color: #f0f0f0;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
          border-left: 4px solid #9333ea;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
          border-top: 1px solid #eee;
        }
        .button {
          display: inline-block;
          background-color: #9333ea;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        table, th, td {
          border: 1px solid #ddd;
        }
        th, td {
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Välkommen till Lyxdeal</h1>
        </div>
        <div class="content">
          <p>Hej ${data.business_name},</p>
          
          <p>Tack för att du valt att bli partner med Lyxdeal! Vi är glada att ha dig med oss.</p>
          
          <p>Här är dina inloggningsuppgifter till salongsportalen:</p>
          
          <div class="credentials">
            <p><strong>E-post:</strong> ${data.email}</p>
            <p><strong>Lösenord:</strong> ${data.temporary_password}</p>
          </div>
          
          <p><strong>OBS!</strong> Detta är ett tillfälligt lösenord. Vi rekommenderar starkt att du ändrar det vid din första inloggning.</p>
          
          ${subInfo ? `
          <h3>Din prenumeration</h3>
          <table>
            <tr>
              <th>Plan</th>
              <td>${subInfo.plan}</td>
            </tr>
            <tr>
              <th>Betalning</th>
              <td>${planTypeText}</td>
            </tr>
            <tr>
              <th>Startdatum</th>
              <td>${new Date(subInfo.start_date).toLocaleDateString('sv-SE')}</td>
            </tr>
            <tr>
              <th>Nästa fakturering</th>
              <td>${nextBillingDate}</td>
            </tr>
          </table>
          ` : ''}
          
          <p>För att logga in på din salongsportal, klicka på knappen nedan:</p>
          
          <div style="text-align: center;">
            <a href="https://www.lyxdeal.se/salon/login" class="button">Logga in på salongsportalen</a>
          </div>
          
          <p>I portalen kan du:</p>
          <ul>
            <li>Skapa och hantera erbjudanden</li>
            <li>Se statistik över dina kampanjer</li>
            <li>Hantera din prenumeration</li>
            <li>Och mycket mer!</li>
          </ul>
          
          <p>Om du har några frågor eller behöver hjälp, tveka inte att kontakta oss på info@lyxdeal.se.</p>
          
          <p>Med vänliga hälsningar,<br>Teamet på Lyxdeal</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.</p>
          <p>Detta är ett automatiskt genererat meddelande. Vänligen svara inte på detta e-postmeddelande.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    console.log("Sending welcome email to:", data.email);

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Lyxdeal <no-reply@lyxdeal.se>",
      to: [data.email],
      subject: "Välkommen till Lyxdeal - Din inloggningsinformation",
      html: htmlContent,
    });

    console.log("Email sending response:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email sent successfully",
        data: emailResponse
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in send-salon-welcome function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
