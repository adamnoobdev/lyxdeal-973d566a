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
      console.error("RESEND_API_KEY is not configured in environment variables");
      throw new Error("RESEND_API_KEY is not configured");
    }
    
    const resend = new Resend(resendApiKey);

    // Parse request body
    let data: WelcomeEmailRequest;
    try {
      const rawData = await req.text();
      console.log("Raw request body:", rawData);
      
      try {
        data = JSON.parse(rawData);
        console.log("Request payload received:", JSON.stringify(data, null, 2));
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        return new Response(
          JSON.stringify({ 
            error: "Invalid JSON in request body",
            rawData 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    } catch (bodyError) {
      console.error("Error reading request body:", bodyError);
      return new Response(
        JSON.stringify({ 
          error: "Error reading request body",
          details: bodyError.message
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

    // Create HTML email content with improved Lyxdeal branding
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
          background-color: #fef5ff;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          padding: 25px 20px;
          border-bottom: 3px solid #520053;
          background: linear-gradient(to right, #520053, #9c27b0);
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        .content {
          padding: 30px 20px;
        }
        .credentials {
          background-color: #fff9fe;
          padding: 20px;
          margin: 25px 0;
          border-radius: 8px;
          border-left: 4px solid #520053;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
          border-top: 1px solid #eee;
          background-color: #f9f0fc;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background-color: #520053;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 50px;
          margin: 25px 0;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 4px 6px rgba(82,0,83,0.2);
          transition: all 0.3s ease;
        }
        .button:hover {
          background-color: #6a006c;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(82,0,83,0.25);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        table, th, td {
          border: 1px solid #f0d4f2;
        }
        th, td {
          padding: 12px 15px;
          text-align: left;
        }
        th {
          background-color: #f0d4f2;
          color: #520053;
        }
        td {
          background-color: #fff;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 15px;
        }
        .highlight {
          color: #520053;
          font-weight: bold;
        }
        .feature-list {
          background-color: #fff9fe;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .feature-list li {
          margin-bottom: 10px;
          position: relative;
          padding-left: 25px;
        }
        .feature-list li:before {
          content: "✓";
          color: #520053;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        .contact-info {
          margin-top: 20px;
          padding: 15px;
          background-color: #fff9fe;
          border-radius: 8px;
          border-left: 4px solid #520053;
        }
        .contact-info p {
          margin: 5px 0;
        }
        .contact-info a {
          color: #520053;
          text-decoration: none;
          font-weight: bold;
        }
        @media only screen and (max-width: 600px) {
          .container {
            border-radius: 0;
          }
          .header {
            padding: 20px 15px;
          }
          .content {
            padding: 20px 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Välkommen till Lyxdeal</h1>
        </div>
        <div class="content">
          <p>Hej <span class="highlight">${data.business_name}</span>!</p>
          
          <p>Vi är glada att välkomna dig som partner till Lyxdeal! Ditt konto har nu skapats och du kan komma igång direkt med att skapa fantastiska erbjudanden.</p>
          
          <div class="credentials">
            <p><strong>E-post:</strong> ${data.email}</p>
            <p><strong>Lösenord:</strong> ${data.temporary_password}</p>
            <p style="font-size: 0.9em; color: #777;">Vi rekommenderar att du ändrar ditt lösenord vid första inloggningen.</p>
          </div>
          
          ${subInfo ? `
          <h3 style="color: #520053; margin-top: 30px;">Din prenumeration</h3>
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
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.lyxdeal.se/salon/login" class="button">Logga in på salongsportalen</a>
          </div>
          
          <h3 style="color: #520053;">Vad kan du göra i salongsportalen?</h3>
          
          <ul class="feature-list">
            <li>Skapa och hantera exklusiva erbjudanden</li>
            <li>Övervaka kampanjresultat i realtid</li>
            <li>Hantera rabattkoder för dina kunder</li>
            <li>Se statistik över dina kampanjer</li>
            <li>Uppdatera din profil och prenumerationsinformation</li>
          </ul>
          
          <div class="contact-info">
            <h3 style="color: #520053; margin-top: 0;">Behöver du hjälp?</h3>
            <p>Om du har några frågor eller behöver support, kontakta oss på:</p>
            <p><a href="mailto:support@lyxdeal.se">support@lyxdeal.se</a></p>
            <p>För allmänna frågor: <a href="mailto:info@lyxdeal.se">info@lyxdeal.se</a></p>
          </div>
          
          <p>Vi är övertygade om att vårt samarbete kommer att bidra till ökad synlighet och fler kunder till din verksamhet!</p>
          
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
    console.log("Using Resend API with key starting with:", resendApiKey.substring(0, 5) + "...");

    // Send email using Resend
    try {
      const emailResponse = await resend.emails.send({
        from: "Lyxdeal <no-reply@lyxdeal.se>",
        to: [data.email],
        subject: "Välkommen till Lyxdeal - Din inloggningsinformation",
        html: htmlContent,
        reply_to: "support@lyxdeal.se"
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
    } catch (resendError) {
      console.error("Resend API error:", resendError);
      console.error("Resend error details:", resendError.message);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email via Resend API",
          details: resendError.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("Error in send-salon-welcome function:", error);
    console.error("Error stack:", error.stack);
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
