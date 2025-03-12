
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequestBody {
  customerName: string;
  customerEmail: string;
  discountCode: string;
  dealTitle: string;
  expiryHours: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, discountCode, dealTitle, expiryHours = 72 }: EmailRequestBody = await req.json();
    
    console.log(`Sending discount code email to ${customerEmail} for deal: ${dealTitle}`);
    
    if (!customerEmail || !discountCode) {
      throw new Error("Missing required fields: customerEmail and discountCode");
    }

    const { data, error } = await resend.emails.send({
      from: "Beautydeals <noreply@yourdomain.com>", // Update this with your verified domain in Resend
      to: [customerEmail],
      subject: `Din rabattkod för "${dealTitle}"`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; font-size: 24px;">Hej ${customerName || 'där'}!</h1>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Tack för ditt intresse för erbjudandet "${dealTitle}".
          </p>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Här är din exklusiva rabattkod:
          </p>
          
          <div style="background-color: #f7f7f7; border: 1px solid #e5e5e5; border-radius: 5px; padding: 15px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #888;">Din rabattkod</p>
            <p style="font-family: monospace; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 1px; color: #333;">
              ${discountCode}
            </p>
          </div>
          
          <div style="background-color: #fff4e5; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #b35c00;">
              <strong>OBS:</strong> Rabattkoden är giltig i ${expiryHours} timmar från detta meddelande.
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Besök salongen och visa upp din rabattkod för att ta del av erbjudandet.
            Betala direkt hos salongen vid ditt besök.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            Detta är ett automatiskt meddelande, vänligen svara inte på detta email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Email sent successfully, ID:", data?.id);
    
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", id: data?.id }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in send-discount-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
