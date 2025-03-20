
export function createEmailContent(name: string, code: string, dealTitle: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Din rabattkod för ${dealTitle}</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            padding: 20px;
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-top: none;
            border-radius: 0 0 8px 8px;
          }
          .discount-code {
            background-color: #ffffff;
            border: 2px dashed #d1d5db;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
            border-radius: 4px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Din rabattkod är här!</h1>
        </div>
        <div class="content">
          <p>Hej ${name},</p>
          
          <p>Tack för att du bokade erbjudandet "${dealTitle}" via Lyxdeal!</p>
          
          <p>Här är din unika rabattkod som du kan använda när du besöker salongen:</p>
          
          <div class="discount-code">${code}</div>
          
          <p><strong>Instruktioner:</strong></p>
          <ul>
            <li>Visa denna kod när du besöker salongen</li>
            <li>Koden är giltig i 72 timmar</li>
            <li>Boka tid direkt med salongen om det behövs</li>
          </ul>
          
          <p>Vi hoppas att du får en fantastisk upplevelse!</p>
          
          <p>Med vänliga hälsningar,<br>Lyxdeal-teamet</p>
        </div>
        <div class="footer">
          <p>Detta är ett automatiskt genererat meddelande, vänligen svara inte på detta email.</p>
          <p>&copy; ${new Date().getFullYear()} Lyxdeal. Alla rättigheter förbehållna.</p>
        </div>
      </body>
    </html>
  `;
}
