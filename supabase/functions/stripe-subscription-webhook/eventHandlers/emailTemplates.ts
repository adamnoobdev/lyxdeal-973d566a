
/**
 * Email template generation for welcome emails
 */

export function generateWelcomeEmailHtml(
  businessName: string,
  email: string,
  password: string,
  planTitle: string,
  planType: string,
  formattedDate: string,
  subscriptionEndDate: string
): string {
  return `
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
          border-radius: 0;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .header {
          text-align: center;
          padding: 25px 20px;
          border-bottom: 3px solid #520053;
          background-color: #FFF0FF;
        }
        .header h1 {
          color: #520053;
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
          border-radius: 0;
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
          border-radius: 0;
        }
        .button {
          display: inline-block;
          background-color: #520053;
          color: white !important;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 0;
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
          border-radius: 0;
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
          <p>Hej <span class="highlight">${businessName}</span>!</p>
          
          <p>Vi är glada att välkomna dig som partner till Lyxdeal! Ditt konto har nu skapats och du kan komma igång direkt med att skapa fantastiska erbjudanden.</p>
          
          <div class="details">
            <h3>Dina inloggningsuppgifter:</h3>
            <p><strong>E-post:</strong> ${email}</p>
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
}
