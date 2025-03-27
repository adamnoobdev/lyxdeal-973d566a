
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
    
    // Create the email HTML with improved Lyxdeal branding
    const emailHtml = `
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
        .details {
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
          color: white !important;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 50px;
          margin: 25px 0;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 4px 6px rgba(82,0,83,0.2);
          transition: all 0.3s ease;
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Välkommen till Lyxdeal!</h1>
        </div>
        <div class="content">
          <p>Hej <span class="highlight">${session.metadata.business_name}</span>!</p>
          
          <p>Vi är glada att välkomna dig som partner till Lyxdeal! Ditt konto har nu skapats och du kan komma igång direkt med att skapa fantastiska erbjudanden.</p>
          
          <div class="details">
            <h3>Dina inloggningsuppgifter:</h3>
            <p><strong>E-post:</strong> ${session.metadata.email}</p>
            <p><strong>Lösenord:</strong> ${password}</p>
            <p style="font-size: 0.9em; color: #777;">Vi rekommenderar att du ändrar ditt lösenord vid första inloggningen.</p>
          </div>
          
          <div class="details">
            <h3>Din prenumeration:</h3>
            <p><strong>Plan:</strong> ${planTitle}</p>
            <p><strong>Betalningstyp:</strong> ${planType}</p>
            <p><strong>Startdatum:</strong> ${formattedDate}</p>
            <p><strong>Nästa betalning:</strong> ${subscriptionEndDate}</p>
          </div>
          
          <h3 style="color: #520053;">Vad kan du göra i salongsportalen?</h3>
          
          <ul class="feature-list">
            <li>Skapa och hantera exklusiva erbjudanden</li>
            <li>Övervaka kampanjresultat i realtid</li>
            <li>Hantera rabattkoder för dina kunder</li>
            <li>Se statistik över dina kampanjer</li>
            <li>Uppdatera din profil och prenumerationsinformation</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="https://lyxdeal.se/salon/login" class="button">Logga in nu</a>
          </div>
          
          <p>Om du har några frågor eller behöver hjälp, kontakta oss på <a href="mailto:info@lyxdeal.se" style="color: #520053;">info@lyxdeal.se</a>.</p>
          
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
