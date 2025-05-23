
/**
 * Shared email styles for consistent design across all email templates
 */
export function getSharedEmailStyles() {
  return `
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
    }
    
    .header {
      background-color: #520053;
      color: white;
      padding: 25px 20px;
      text-align: center;
    }

    .header img {
      max-width: 150px;
      height: auto;
      margin-bottom: 10px;
    }
    
    .header h1 {
      font-size: 24px;
      margin: 0;
      font-weight: normal;
    }
    
    .content {
      padding: 30px 25px;
    }
    
    .footer {
      background-color: #f9f5f9;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    
    .button {
      display: inline-block;
      background-color: #520053;
      color: white !important;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 0;
      margin: 25px 0;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 4px 6px rgba(82,0,83,0.2);
      transition: all 0.3s ease;
    }
    
    .highlight {
      color: #520053;
      font-weight: bold;
    }
    
    .card {
      background-color: #fff9fe;
      padding: 20px;
      margin: 25px 0;
      border-left: 4px solid #520053;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    .discount-code {
      background-color: #f1e5f2;
      border: 2px dashed #520053;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 2px;
      text-align: center;
      padding: 20px;
      margin: 20px 0;
      color: #520053;
    }
    
    .instructions {
      background-color: #f9f5f9;
      padding: 20px;
      margin: 25px 0;
      border-left: 4px solid #520053;
    }
    
    .booking-link {
      margin-top: 15px;
      text-align: center;
    }

    .btn-booking {
      display: inline-block;
      background-color: #520053;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 0;
      font-weight: bold;
    }
  `;
}
