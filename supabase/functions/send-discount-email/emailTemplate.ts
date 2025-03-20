
// Email template generator - ren HTML-implementation utan externa beroenden
export const createEmailContent = (name: string, code: string, dealTitle: string): string => {
  // Calculate expiry time (72 hours from now)
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 72);
  
  // Formatera datum manuellt istället för att använda Intl
  const day = expiryDate.getDate();
  const month = expiryDate.getMonth() + 1;
  const year = expiryDate.getFullYear();
  const hours = expiryDate.getHours().toString().padStart(2, '0');
  const minutes = expiryDate.getMinutes().toString().padStart(2, '0');
  
  const formattedDate = `${day} ${getMonthName(month)} ${year}, ${hours}:${minutes}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 0;
        }
        .container { 
          padding: 20px; 
          border: 1px solid #eaeaea; 
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .header { 
          background-color: #f9a826; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          border-radius: 8px 8px 0 0; 
        }
        .content { 
          padding: 30px 20px;
          background-color: white; 
        }
        .code { 
          background-color: #f5f5f5; 
          padding: 15px; 
          font-family: monospace; 
          font-size: 28px; 
          text-align: center; 
          letter-spacing: 3px; 
          border-radius: 8px; 
          margin: 25px 0; 
          border: 1px dashed #ccc;
          font-weight: bold;
        }
        .info-box {
          background-color: #f8f9fa;
          border-left: 4px solid #f9a826;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer { 
          font-size: 12px; 
          color: #999; 
          text-align: center; 
          margin-top: 30px; 
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 10px;
        }
        @media only screen and (max-width: 480px) {
          .container { padding: 10px; }
          .header { padding: 15px 10px; }
          .content { padding: 20px 15px; }
          .code { font-size: 24px; letter-spacing: 2px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Din rabattkod är här!</h1>
        </div>
        <div class="content">
          <p>Hej ${name},</p>
          <p>Tack för att du säkrat erbjudandet <strong>"${dealTitle}"</strong>! Här är din unika rabattkod:</p>
          
          <div class="code">${code}</div>
          
          <div class="info-box">
            <p><strong>Så här använder du din rabattkod:</strong></p>
            <ol>
              <li>Visa denna kod när du besöker salongen</li>
              <li>Rabattkoden bekräftar att du har rätt till erbjudandet</li>
              <li>Bokningsbar 72 timmar framåt</li>
            </ol>
          </div>

          <p><strong>Viktigt att veta:</strong></p>
          <ul>
            <li>Koden är giltig i 72 timmar, fram till <strong>${formattedDate}</strong></li>
            <li>Koden kan endast användas en gång</li>
            <li>Ta med legitimation vid besöket</li>
          </ul>
          
          <p>Vi önskar dig en fantastisk upplevelse!</p>
          
          <p>Med vänliga hälsningar,<br>Lyxdeal.se</p>
        </div>
        <div class="footer">
          <p>Detta är ett automatiskt utskick, vänligen svara inte på detta meddelande.</p>
          <p>&copy; ${new Date().getFullYear()} Lyxdeal.se - Alla rättigheter förbehållna</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Hjälpfunktion för att få månadsnamn på svenska
function getMonthName(monthNumber: number): string {
  const months = [
    "januari", "februari", "mars", "april", "maj", "juni", 
    "juli", "augusti", "september", "oktober", "november", "december"
  ];
  return months[monthNumber - 1];
}
