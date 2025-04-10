
import { corsHeaders } from "./corsConfig.ts";
import { sendEmail } from "./emailSender.ts";
import { EmailRequest } from "./types.ts";

export async function requestHandler(req: Request): Promise<Response> {
  try {
    // 1. Validate request
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST requests are supported" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 }
      );
    }

    // 2. Handle JSON body
    let requestData: EmailRequest;
    let rawBody = "";
    
    try {
      rawBody = await req.text();
      console.log("Raw request body:", rawBody);
      
      try {
        requestData = JSON.parse(rawBody);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        return new Response(
          JSON.stringify({ error: "Invalid JSON body", details: parseError.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 3. Validate required fields
    const { email, name, code, dealTitle } = requestData;
    const phone = requestData.phone || "";
    
    // More detailed logging of incoming data
    console.log("Incoming email request:", {
      email, 
      name,
      phone: phone ? phone.substring(0, 2) + "***" : undefined, // Mask part of phone number in logs
      code,
      dealTitle: dealTitle?.substring(0, 20) + (dealTitle?.length > 20 ? "..." : ""),
      hasBookingUrl: !!requestData.bookingUrl,
      subscribedToNewsletter: !!requestData.subscribedToNewsletter
    });

    if (!email || !name || !code || !dealTitle) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!name) missingFields.push("name");
      if (!code) missingFields.push("code");
      if (!dealTitle) missingFields.push("dealTitle");
      
      console.error("Missing required fields:", missingFields.join(", "));
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(", ")}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 4. Send email
    try {
      console.log("Sending email with code:", code);
      const emailResult = await sendEmail(requestData);
      
      console.log("Email sent result:", emailResult);
      
      return new Response(
        JSON.stringify({ 
          message: "Email sent successfully", 
          id: emailResult.id,
          productionMode: emailResult.productionMode !== false
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (error) {
      console.error("Error sending email:", error);
      console.error("Error type:", typeof error);
      console.error("Error properties:", Object.keys(error));
      
      if (error.response) {
        console.error("API response status:", error.response.status);
        console.error("API response data:", error.response.data);
      }
      
      // 5. Return more detailed error message
      let statusCode = 500;
      let errorDetail = "Unknown error";
      
      if (error instanceof Error) {
        errorDetail = error.message;
        
        // Specific error handling
        if (error.message.includes("rate limit") || error.message.includes("Too many requests")) {
          statusCode = 429; // Rate limiting
        } else if (error.message.includes("invalid") || error.message.includes("not found")) {
          statusCode = 400; // Bad request
        } else if (error.message.includes("API key")) {
          statusCode = 401; // Auth issue
          errorDetail = "Email service configuration error (API key)";
        }
      }
      
      return new Response(
        JSON.stringify({ 
          error: `Failed to send email: ${errorDetail}`,
          timestamp: new Date().toISOString(),
          details: error instanceof Error ? error.stack : undefined
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: statusCode
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in requestHandler:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
}
