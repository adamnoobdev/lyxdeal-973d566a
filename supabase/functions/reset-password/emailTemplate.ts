
import { getSharedEmailStyles } from "../shared/emailStyles.ts";

/**
 * Generates the HTML content for the password reset email
 */
export function generateResetPasswordEmailHtml(resetUrl: string): string {
  // Säkerställ att resetUrl har korrekt format (inkluderar token)
  // resetUrl ska redan innehålla token från Supabase auth.resetPasswordForEmail
  
  const currentYear = new Date().getFullYear();
  
  // Kontrollera om vi har en lovableproject.com URL och ersätt med lyxdeal.se i produktion
  if (resetUrl && resetUrl.includes('.lovableproject.com')) {
    try {
      const urlObj = new URL(resetUrl);
      // Ersätt lovableproject.com med lyxdeal.se för produktionsmiljön
      resetUrl = resetUrl.replace('.lovableproject.com', '.lyxdeal.se');
      console.log("Korrigerad resetUrl för produktionsmiljö:", resetUrl);
    } catch (e) {
      console.error("Kunde inte korrigera URL:", e);
    }
  }
  
  // Se till att URL:en pekar mot /salon/update-password för konsekvent routing
  if (resetUrl && !resetUrl.includes('/salon/update-password')) {
    try {
      const urlObj = new URL(resetUrl);
      resetUrl = urlObj.origin + '/salon/update-password' + urlObj.hash;
      console.log("Korrigerad resetUrl i emailTemplate:", resetUrl);
    } catch (e) {
      console.error("Kunde inte korrigera URL:", e);
    }
  }

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
            <a href="${resetUrl}" class="button">Återställ lösenord</a>
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
