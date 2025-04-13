
import { getSharedEmailStyles } from "../shared/emailStyles.ts";

/**
 * Generates the HTML content for the password reset email
 */
export function generateResetPasswordEmailHtml(resetUrl: string): string {
  // resetUrl is now the complete URL with token from Supabase auth.admin.generateLink
  
  const currentYear = new Date().getFullYear();
  
  // Log the reset URL for debugging
  console.log("Using reset URL in email template:", resetUrl);

  return `
    <!DOCTYPE html>
    <html lang="sv">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Återställ ditt lösenord på Lyxdeal</title>
      <style>
        ${getSharedEmailStyles()}
        
        /* Extra responsiveness styles */
        @media only screen and (max-width: 480px) {
          .container {
            width: 100% !important;
            padding: 10px !important;
          }
          .button {
            padding: 10px 15px !important;
            font-size: 16px !important;
            width: 80% !important;
          }
        }
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
            <a href="${resetUrl}" class="button" style="display: inline-block; background-color: #520053; color: white; text-decoration: none; padding: 12px 20px; border-radius: 4px; font-weight: bold;">Återställ lösenord</a>
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
