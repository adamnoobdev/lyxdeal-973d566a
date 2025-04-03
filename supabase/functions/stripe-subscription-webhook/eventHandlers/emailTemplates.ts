
/**
 * Email template generation for welcome emails
 */
import { getSharedEmailStyles } from "../../shared/emailStyles.ts";

export function generateWelcomeEmailHtml(
  businessName: string,
  email: string,
  password: string,
  planTitle: string,
  planType: string,
  formattedDate: string,
  subscriptionEndDate: string
): string {
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
          <h1>Välkommen till Lyxdeal!</h1>
        </div>
        <div class="content">
          <p>Hej <span class="highlight">${businessName}</span>!</p>
          
          <p>Vi är glada att välkomna dig som partner till Lyxdeal! Ditt konto har nu skapats och du kan komma igång direkt med att skapa fantastiska erbjudanden.</p>
          
          <div class="card">
            <h3>Dina inloggningsuppgifter:</h3>
            <p><strong>E-post:</strong> ${email}</p>
            <p><strong>Lösenord:</strong> ${password}</p>
            <p style="font-size: 0.9em; color: #777;">Vi rekommenderar att du ändrar ditt lösenord vid första inloggningen.</p>
          </div>
          
          <div class="card">
            <h3>Din prenumeration:</h3>
            <p><strong>Plan:</strong> ${planTitle}</p>
            <p><strong>Betalningstyp:</strong> ${planType}</p>
            <p><strong>Startdatum:</strong> ${formattedDate}</p>
            <p><strong>Nästa betalning:</strong> ${subscriptionEndDate}</p>
          </div>
          
          <h3 style="color: #520053;">Vad kan du göra i salongsportalen?</h3>
          
          <ul class="feature-list" style="background-color: #fff9fe; padding: 15px; margin: 20px 0;">
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
          
          <div style="text-align: center;">
            <a href="https://lyxdeal.se/salon/login" class="button">Logga in nu</a>
          </div>
          
          <div class="card">
            <h3 style="color: #520053; margin-top: 0;">Behöver du hjälp?</h3>
            <p>Om du har några frågor eller behöver support, kontakta oss på:</p>
            <p><a href="mailto:support@lyxdeal.se" style="color: #520053; text-decoration: none; font-weight: bold;">support@lyxdeal.se</a></p>
            <p>För allmänna frågor: <a href="mailto:info@lyxdeal.se" style="color: #520053; text-decoration: none; font-weight: bold;">info@lyxdeal.se</a></p>
          </div>
          
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
