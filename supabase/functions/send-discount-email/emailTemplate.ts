
import { 
  createHeaderSection,
  createGreetingSection,
  createDiscountCodeSection,
  createInstructionsSection,
  createSignatureSection,
  createFooterSection
} from "./emailTemplates/sections.ts";
import { getEmailStyles } from "./emailTemplates/styles.ts";
import { template } from "./emailTemplates/template.ts";

interface EmailTemplateProps {
  name: string;
  code: string;
  dealTitle: string;
  bookingUrl?: string;
  subscribedToNewsletter?: boolean;
}

export function generateEmailHtml({ 
  name, 
  code, 
  dealTitle, 
  bookingUrl, 
  subscribedToNewsletter 
}: EmailTemplateProps): string {
  // Hämta stilarna
  const styles = getEmailStyles();
  
  // HTML-innehåll för rabattkodsinformationen
  const dealCodeSection = `
    <tr>
      <td style="${styles.contentCell}">
        <h2 style="${styles.heading}">Din rabattkod är klar!</h2>
        <p style="${styles.paragraph}">Hej ${name},</p>
        <p style="${styles.paragraph}">Tack för att du säkrade erbjudandet "${dealTitle}".</p>
        <p style="${styles.paragraphBold}">Här är din rabattkod:</p>
        <div style="${styles.codeContainer}">
          <p style="${styles.code}">${code}</p>
        </div>
        <p style="${styles.paragraph}">Visa denna kod i salongen för att lösa in ditt erbjudande.</p>
        <p style="${styles.paragraph}">Observera att koden är giltig i 72 timmar från nu.</p>
      </td>
    </tr>
  `;

  // Bokningssektion om boknings-URL tillhandahålls
  const bookingSection = bookingUrl ? `
    <tr>
      <td style="${styles.contentCell}">
        <h3 style="${styles.subheading}">Boka din tid</h3>
        <p style="${styles.paragraph}">Du kan också boka din tid direkt hos salongen genom att klicka på länken nedan:</p>
        <a href="${bookingUrl}" style="${styles.button}" target="_blank">Boka tid nu</a>
      </td>
    </tr>
  ` : '';

  // Villkorlig sektion för nyhetsbrevsprenumeration
  const newsletterSection = subscribedToNewsletter ? `
    <tr>
      <td style="${styles.contentCell}">
        <h3 style="${styles.subheading}">Välkommen till vårt nyhetsbrev!</h3>
        <p style="${styles.paragraph}">Du har valt att prenumerera på vårt nyhetsbrev. Vi kommer att skicka dig exklusiva erbjudanden och nyheter om skönhetsbehandlingar.</p>
        <p style="${styles.paragraph}">Du kan när som helst avsluta din prenumeration genom att klicka på avprenumerationslänken i våra nyhetsbrev.</p>
      </td>
    </tr>
  ` : '';

  return template({
    preheader: `Din rabattkod för "${dealTitle}" är: ${code}`,
    content: dealCodeSection + bookingSection + newsletterSection,
    footer: createFooterSection(new Date().getFullYear()),
  });
}
