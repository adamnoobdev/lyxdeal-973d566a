
import { WelcomeEmailRequest } from "./types.ts";
import { generateWelcomeEmailHtml } from "./emailTemplate.ts";
import { sendWelcomeEmail } from "./emailSender.ts";
import { corsHeaders } from "./corsConfig.ts";

export async function handleWelcomeEmailRequest(req: Request): Promise<Response> {
  // Parse request data
  try {
    const rawData = await req.text();
    console.log("Raw request body:", rawData);
    
    let data: WelcomeEmailRequest;
    try {
      data = JSON.parse(rawData);
      console.log("Request payload received:", JSON.stringify(data, null, 2));
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body",
          rawData 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate request data
    if (!data.email || !data.business_name || !data.temporary_password) {
      console.error("Missing required fields in request:", data);
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          received: Object.keys(data)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Prepare subscription data if available
    let planInfo = undefined;
    const subInfo = data.subscription_info;
    
    if (subInfo) {
      planInfo = {
        plan: subInfo.plan,
        type: subInfo.type,
        startDate: new Date(subInfo.start_date).toLocaleDateString('sv-SE'),
        nextBillingDate: subInfo.next_billing_date 
          ? new Date(subInfo.next_billing_date).toLocaleDateString('sv-SE')
          : "N/A"
      };
    }

    // Generate email HTML
    const htmlContent = generateWelcomeEmailHtml(
      data.business_name,
      data.email,
      data.temporary_password,
      planInfo
    );

    console.log("Sending welcome email to:", data.email);
    
    // Send email
    const emailResponse = await sendWelcomeEmail(
      data.email,
      "Välkommen till Lyxdeal - Din inloggningsinformation",
      htmlContent
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email sent successfully",
        data: emailResponse
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error: any) {
    console.error("Error in send-salon-welcome function:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}
