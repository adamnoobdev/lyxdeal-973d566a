
import { Resend } from "https://esm.sh/resend@1.1.0";

export async function sendWelcomeEmail(session: any, password: string, subscription: any) {
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured in environment");
      return { success: false, error: "Email service API key not configured" };
    }
    
    if (!session.metadata || !session.metadata.email || !session.metadata.business_name) {
      console.error("Missing required metadata for email:", JSON.stringify(session.metadata || {}, null, 2));
      return { success: false, error: "Missing required metadata for email" };
    }
    
    console.log(`Preparing to send welcome email to ${session.metadata.email}`);
    
    const resend = new Resend(resendApiKey);
    
    // Format the current date as day month year
    const formattedDate = new Date().toLocaleDateString('sv-SE');
    
    // Determine subscription end date if available
    let subscriptionEndDate = "Not available";
    if (subscription && subscription.current_period_end) {
      subscriptionEndDate = new Date(subscription.current_period_end * 1000).toLocaleDateString('sv-SE');
    }
    
    // Format subscription details
    const planTitle = session.metadata.plan_title || "Standard";
    const planType = session.metadata.plan_type === 'yearly' ? 'Årsvis' : 'Månadsvis';
    
    // Create the email HTML
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Välkommen till Lyxdeal!</title>
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
          background-color: #6366f1;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
          background-color: #f9fafb;
        }
        .details {
          background-color: white;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          border: 1px solid #eee;
        }
        .button {
          display: inline-block;
          background-color: #6366f1;
          color: white !important;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin-top: 15px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Välkommen till Lyxdeal!</h1>
        </div>
        <div class="content">
          <p>Hej ${session.metadata.business_name}!</p>
          
          <p>Tack för att du registrerade dig hos oss. Ditt konto har skapats och du kan nu börja använda vår plattform.</p>
          
          <div class="details">
            <h3>Dina inloggningsuppgifter:</h3>
            <p><strong>E-post:</strong> ${session.metadata.email}</p>
            <p><strong>Lösenord:</strong> ${password}</p>
            <p><small>För din säkerhet, vänligen ändra ditt lösenord vid första inloggningen.</small></p>
          </div>
          
          <div class="details">
            <h3>Din prenumeration:</h3>
            <p><strong>Plan:</strong> ${planTitle}</p>
            <p><strong>Betalningstyp:</strong> ${planType}</p>
            <p><strong>Startdatum:</strong> ${formattedDate}</p>
            <p><strong>Nästa betalning:</strong> ${subscriptionEndDate}</p>
          </div>
          
          <p>För att komma igång, klicka på knappen nedan för att logga in på vår plattform:</p>
          
          <a href="https://lyxdeal.se/salon/login" class="button">Logga in nu</a>
          
          <p>Om du har några frågor eller behöver hjälp, kontakta oss på <a href="mailto:info@lyxdeal.se">info@lyxdeal.se</a>.</p>
          
          <p>Med vänliga hälsningar,<br>Lyxdeal-teamet</p>
        </div>
        <div class="footer">
          <p>Detta är ett automatiskt meddelande, vänligen svara inte på detta e-postmeddelande.</p>
          <p>&copy; 2023 Lyxdeal. Alla rättigheter förbehållna.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    console.log("Sending email with Resend API...");
    
    // Set production mode flag for testing/debugging
    const isProduction = true;
    
    // Determine the recipient email based on production mode
    let recipientEmail = session.metadata.email;
    
    // Log email details before sending
    console.log(`Sending welcome email: 
      From: Lyxdeal <noreply@lyxdeal.se>
      To: ${recipientEmail}
      Subject: Välkommen till Lyxdeal - Din salonginformation
      Production mode: ${isProduction ? 'Yes' : 'No'}
    `);
    
    const emailResponse = await resend.emails.send({
      from: "Lyxdeal <noreply@lyxdeal.se>",
      to: [recipientEmail],
      subject: "Välkommen till Lyxdeal - Din salonginformation",
      html: emailHtml,
    });
    
    console.log("Email response from Resend:", emailResponse);
    
    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      return { 
        success: false, 
        error: `Email service error: ${emailResponse.error}`,
        raw: emailResponse
      };
    }
    
    return { 
      success: true, 
      messageId: emailResponse.id,
      productionMode: isProduction,
      recipient: recipientEmail
    };
  } catch (error) {
    console.error("Exception in sendWelcomeEmail:", error);
    console.error("Error stack:", error.stack);
    return { success: false, error: `Exception: ${error.message}` };
  }
}
