
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

interface TemplateProps {
  preheader: string;
  content: string;
  footer: string;
}

export function template({ preheader, content, footer }: TemplateProps): string {
  const styles = getEmailStyles();
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${preheader}</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .header {
            background-color: #520053;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .header img {
            max-width: 150px;
            height: auto;
          }
          .header h1 {
            margin: 10px 0 0;
            font-size: 24px;
          }
          .content {
            padding: 20px;
          }
          .greeting {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
          }
          .highlight {
            color: #520053;
            font-weight: bold;
          }
          .discount-code {
            background-color: #f7f0f7;
            border: 1px solid #e0c6e0;
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 24px;
            font-weight: bold;
            color: #520053;
            letter-spacing: 2px;
          }
          .instructions {
            background-color: #f9f9f9;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
          }
          .instructions h3 {
            color: #520053;
            margin-top: 0;
          }
          .instructions ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .instructions li {
            margin-bottom: 8px;
          }
          .booking-link {
            margin: 15px 0;
          }
          .btn-booking {
            display: inline-block;
            background-color: #520053;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
          }
          .signature {
            margin-top: 25px;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
          ${footer}
        </div>
      </body>
    </html>
  `;
}
