
import { getSharedEmailStyles } from "../shared/emailStyles.ts";

/**
 * Generates the HTML content for the password reset email
 */
export function generateResetPasswordEmailHtml(resetUrl: string): string {
  // Säkerställ att resetUrl har korrekt format och pekar på update-password sidan
  // Kontrollera om resetUrl redan innehåller token som query parameter
  const hasToken = resetUrl.includes('?') || resetUrl.includes('#');
  
  // Om URL:en inte redan har en token, lägg till en generic placeholder
  // (Supabase kommer att ersätta detta med den faktiska token i email sending processen)
  const finalResetUrl = hasToken ? resetUrl : `${resetUrl}#access_token={{TOKEN}}`;
  
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Återställ ditt lösenord på Lyxdeal</title>
      <style>
        ${getSharedEmailStyles()}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets//Lyxdeal-logo.svg" alt="Lyxdeal" />
          <h1>Återställ ditt lösenord</h1>
        </div>
        <div class="content">
          <p>Hej!</p>
          
          <p>Vi har tagit emot en begäran om att återställa lösenordet för ditt Lyxdeal-konto. Klicka på knappen nedan för att skapa ett nytt lösenord:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${finalResetUrl}" class="button">Återställ lösenord</a>
          </div>
          
          <div class="card">
            <p>Om du inte begärt att återställa ditt lösenord kan du ignorera detta mejl.</p>
            <p>Återställningslänken är giltig i 1 timme.</p>
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
