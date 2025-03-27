
export function createEmailContent(name: string, code: string, dealTitle: string): string {
  const currentYear = new Date().getFullYear();
  
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
            padding: 0;
            background-color: #f9f9fb;
          }
          .container {
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
            overflow: hidden;
            margin: 20px;
          }
          .header {
            background-color: #FFF0FF;
            color: #520053;
            padding: 30px 20px;
            text-align: center;
          }
          .header img {
            width: 150px;
            height: auto;
            margin-bottom: 15px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
          }
          .content {
            padding: 30px 20px;
            background-color: #ffffff;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 15px;
          }
          .discount-code {
            background-color: #f9f0fa;
            border: 2px dashed #b944ba;
            padding: 15px;
            margin: 25px 0;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
            border-radius: 6px;
            color: #520053;
          }
          .instructions {
            background-color: #f9f9fb;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
          }
          .instructions h3 {
            color: #520053;
            margin-top: 0;
            font-size: 16px;
          }
          .instructions ul {
            margin: 0;
            padding-left: 20px;
          }
          .instructions li {
            margin-bottom: 8px;
          }
          .signature {
            margin-top: 25px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            padding: 20px;
            background-color: #f9f0fa;
            border-top: 1px solid #f3e8f3;
          }
          .logo {
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            text-decoration: none;
          }
          .highlight {
            color: #b944ba;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://gmqeqhlhqhyrjquzhuzg.supabase.co/storage/v1/object/public/assets//Lyxdeal-logo.svg" alt="Lyxdeal" />
            <h1>Din rabattkod är här!</h1>
          </div>
          <div class="content">
            <p class="greeting">Hej ${name}!</p>
            
            <p>Tack för att du bokade erbjudandet <span class="highlight">"${dealTitle}"</span> via Lyxdeal!</p>
            
            <p>Här är din unika rabattkod:</p>
            
            <div class="discount-code">${code}</div>
            
            <div class="instructions">
              <h3>💜 Så här använder du din kod:</h3>
              <ul>
                <li>Visa denna kod när du besöker salongen</li>
                <li>Koden är giltig i 72 timmar</li>
                <li>Boka tid direkt med salongen om det behövs</li>
              </ul>
            </div>
            
            <p>Vi hoppas att du får en fantastisk upplevelse och välkommen tillbaka till Lyxdeal för fler exklusiva erbjudanden!</p>
            
            <div class="signature">
              <p>Med vänliga hälsningar,<br>Lyxdeal-teamet</p>
            </div>
          </div>
          <div class="footer">
            <p>Detta är ett automatiskt genererat meddelande, vänligen svara inte på detta email.</p>
            <p>&copy; ${currentYear} Lyxdeal. Alla rättigheter förbehållna.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
