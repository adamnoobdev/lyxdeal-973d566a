
/**
 * Main email template assembly
 */
import { getEmailStyles } from "./styles.ts";
import { 
  createHeaderSection, 
  createGreetingSection,
  createDiscountCodeSection,
  createInstructionsSection,
  createSignatureSection,
  createFooterSection
} from "./sections.ts";

export function createEmailContent(name: string, code: string, dealTitle: string, bookingUrl?: string): string {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Din rabattkod för ${dealTitle}</title>
        <style>
          ${getEmailStyles()}
        </style>
      </head>
      <body>
        <div class="container">
          ${createHeaderSection("Din rabattkod är här!")}
          <div class="content">
            ${createGreetingSection(name, dealTitle)}
            ${createDiscountCodeSection(code)}
            ${createInstructionsSection(bookingUrl)}
            <p>Vi hoppas att du får en fantastisk upplevelse och välkommen tillbaka till Lyxdeal för fler exklusiva erbjudanden!</p>
            ${createSignatureSection()}
          </div>
          ${createFooterSection(currentYear)}
        </div>
      </body>
    </html>
  `;
}
