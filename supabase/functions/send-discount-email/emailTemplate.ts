
import type { EmailRequest } from "./types.ts";
import { getEmailStyles } from "./emailTemplates/styles.ts";
import { getHeaderSection, getFooterSection, getCodeSection, getBookingSection } from "./emailTemplates/sections.ts";

export function generateEmailTemplate(data: EmailRequest) {
  const styles = getEmailStyles();
  const {
    name,
    code,
    dealTitle,
    bookingUrl,
  } = data;

  // Bestäm ämnesrad baserat på om det är direktbokning eller rabattkod
  const isDirectBooking = code === 'DIRECT_BOOKING';
  const subject = isDirectBooking 
    ? `Din bokning för "${dealTitle}" är bekräftad`
    : `Din rabattkod för "${dealTitle}" är redo att användas`;

  // Skapa huvudinnehållet för mejlet
  let mainContent = `
    <div style="${styles.content}">
      <h2 style="${styles.heading}">Hej ${name}!</h2>
      ${isDirectBooking 
        ? `<p style="${styles.paragraph}">Tack för att du bokar genom Beauty Deals. Här är din bokningsbekräftelse för <strong>${dealTitle}</strong>.</p>`
        : `<p style="${styles.paragraph}">Tack för att du använder Beauty Deals. Din rabattkod för <strong>${dealTitle}</strong> är:</p>
          ${getCodeSection(code, styles)}`
      }
      
      <p style="${styles.paragraph}">Så här gör du:</p>
      <ol style="margin-bottom: 20px;">
        ${isDirectBooking
          ? `<li style="margin-bottom: 10px;">Klicka på bokningsknappen nedan för att slutföra din bokning.</li>
             <li style="margin-bottom: 10px;">Följ instruktionerna på bokningssidan.</li>
             <li style="margin-bottom: 10px;">Spara bekräftelsen du får från salongen.</li>`
          : `<li style="margin-bottom: 10px;">Kontakta salongen för att boka tid.</li>
             <li style="margin-bottom: 10px;">Uppge din rabattkod när du bokar.</li>
             <li style="margin-bottom: 10px;">Visa denna rabattkod när du besöker salongen.</li>`
        }
      </ol>
      
      ${isDirectBooking && bookingUrl ? getBookingSection(bookingUrl, styles) : ''}
      
      <div style="${styles.divider}"></div>
      
      <p style="${styles.paragraph}">Om du har några frågor, kontakta oss på <a href="mailto:info@beautydeals.se" style="${styles.link}">info@beautydeals.se</a>.</p>
      
      <p style="${styles.paragraphBold}">Vänliga hälsningar,<br>Beauty Deals-teamet</p>
    </div>
  `;

  // Kombinera alla delar av mejlet
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="${styles.container}">
          ${getHeaderSection(styles)}
          ${mainContent}
          ${getFooterSection(styles)}
        </div>
      </body>
    </html>
  `;

  return { html, subject };
}
