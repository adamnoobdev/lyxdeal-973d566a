
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
  subscribedToNewsletter?: boolean;
}

export function generateEmailHtml({ name, code, dealTitle, subscribedToNewsletter }: EmailTemplateProps): string {
  // HTML-innehåll för rabattkodsinformationen
  const dealCodeSection = `
    <tr>
      <td style="${getEmailStyles().contentCell}">
        <h2 style="${getEmailStyles().heading}">Din rabattkod är klar!</h2>
        <p style="${getEmailStyles().paragraph}">Hej ${name},</p>
        <p style="${getEmailStyles().paragraph}">Tack för att du säkrade erbjudandet "${dealTitle}".</p>
        <p style="${getEmailStyles().paragraphBold}">Här är din rabattkod:</p>
        <div style="${getEmailStyles().codeContainer}">
          <p style="${getEmailStyles().code}">${code}</p>
        </div>
        <p style="${getEmailStyles().paragraph}">Visa denna kod i salongen för att lösa in ditt erbjudande.</p>
        <p style="${getEmailStyles().paragraph}">Observera att koden är giltig i 72 timmar från nu.</p>
      </td>
    </tr>
  `;

  // Villkorlig sektion för nyhetsbrevsprenumeration
  const newsletterSection = subscribedToNewsletter ? `
    <tr>
      <td style="${getEmailStyles().contentCell}">
        <h3 style="${getEmailStyles().subheading}">Välkommen till vårt nyhetsbrev!</h3>
        <p style="${getEmailStyles().paragraph}">Du har valt att prenumerera på vårt nyhetsbrev. Vi kommer att skicka dig exklusiva erbjudanden och nyheter om skönhetsbehandlingar.</p>
        <p style="${getEmailStyles().paragraph}">Du kan när som helst avsluta din prenumeration genom att klicka på avprenumerationslänken i våra nyhetsbrev.</p>
      </td>
    </tr>
  ` : '';

  return template({
    preheader: `Din rabattkod för "${dealTitle}" är: ${code}`,
    content: dealCodeSection + newsletterSection,
    footer: createFooterSection(new Date().getFullYear()),
  });
}
