
// Email template generation for welcome emails
import { getSharedEmailStyles } from "../shared/emailStyles.ts";

export function generateWelcomeEmailHtml(
  businessName: string,
  email: string,
  password: string,
  planInfo?: {
    plan: string;
    type: string;
    startDate: string;
    nextBillingDate: string;
  }
): string {
  // Format subscription data if available
  const planTypeText = planInfo?.type === "yearly" ? "årsvis" : "månadsvis";
  const nextBillingDate = planInfo?.nextBillingDate || "N/A";
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Välkommen till Lyxdeal</title>
      <style>
        ${getSharedEmailStyles()}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets//Lyxdeal-logo.svg" alt="Lyxdeal" />
          <h1>Välkommen till Lyxdeal</h1>
        </div>
        <div class="content">
          <p>Hej <span class="highlight">${businessName}</span>!</p>
          
          <p>Vi är glada att välkomna dig som partner till Lyxdeal! Ditt konto har nu skapats och du kan komma igång direkt med att skapa fantastiska erbjudanden.</p>
          
          <div class="card">
            <h3 style="margin-top: 0">Dina inloggningsuppgifter:</h3>
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Lösenord:</strong> ${password}</p>
            <p style="font-size: 0.9em; color: #777;">Vi rekommenderar att du ändrar ditt lösenord vid första inloggningen.</p>
          </div>
          
          ${planInfo ? `
          <div class="card">
            <h3 style="margin-top: 0">Din prenumeration:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Plan</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${planInfo.plan}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Betalning</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${planTypeText}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Startdatum</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${planInfo.startDate}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Nästa fakturering</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${nextBillingDate}</td>
              </tr>
            </table>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.lyxdeal.se/salon/login" class="button">Logga in på salongsportalen</a>
          </div>
          
          <h3 style="color: #520053;">Vad kan du göra i salongsportalen?</h3>
          
          <ul style="background-color: #fff9fe; padding: 15px; margin: 20px 0;">
            <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
              <span style="content: '✓'; color: #520053; font-weight: bold; position: absolute; left: 0;">✓</span>
              Skapa och hantera exklusiva erbjudanden
            </li>
            <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
              <span style="content: '✓'; color: #520053; font-weight: bold; position: absolute; left: 0;">✓</span>
              Övervaka kampanjresultat i realtid
            </li>
            <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
              <span style="content: '✓'; color: #520053; font-weight: bold; position: absolute; left: 0;">✓</span>
              Hantera rabattkoder för dina kunder
            </li>
            <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
              <span style="content: '✓'; color: #520053; font-weight: bold; position: absolute; left: 0;">✓</span>
              Se statistik över dina kampanjer
            </li>
            <li style="margin-bottom: 10px; position: relative; padding-left: 25px;">
              <span style="content: '✓'; color: #520053; font-weight: bold; position: absolute; left: 0;">✓</span>
              Uppdatera din profil och prenumerationsinformation
            </li>
          </ul>
          
          <div class="card">
            <h3 style="color: #520053; margin-top: 0;">Behöver du hjälp?</h3>
            <p>Om du har några frågor eller behöver support, kontakta oss på:</p>
            <p><a href="mailto:support@lyxdeal.se" style="color: #520053; text-decoration: none; font-weight: bold;">support@lyxdeal.se</a></p>
            <p>För allmänna frågor: <a href="mailto:info@lyxdeal.se" style="color: #520053; text-decoration: none; font-weight: bold;">info@lyxdeal.se</a></p>
          </div>
          
          <p>Vi är övertygade om att vårt samarbete kommer att bidra till ökad synlighet och fler kunder till din verksamhet!</p>
          
          <p>Med vänliga hälsningar,<br>Teamet på Lyxdeal</p>
        </div>
        <div class="footer">
          <p>© ${currentYear} Lyxdeal. Alla rättigheter förbehållna.</p>
          <p>Detta är ett automatiskt genererat meddelande. Vänligen svara inte på detta e-postmeddelande.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
