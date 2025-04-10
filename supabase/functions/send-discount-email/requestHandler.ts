
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

    // 2. Get the raw request body and validate it exists
    const rawBody = await req.text();
    console.log("Raw request body length:", rawBody?.length || 0);
    console.log("Raw request body sample:", rawBody.substring(0, 200));
    
    if (!rawBody || rawBody.trim() === '') {
      console.error("Empty request body received");
      return new Response(
        JSON.stringify({ error: "Empty request body" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 3. Parse the JSON body
    let requestData: EmailRequest;
    try {
      requestData = JSON.parse(rawBody);
      console.log("Request data parsed successfully:", JSON.stringify(requestData, null, 2));
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON format", 
          details: parseError.message, 
          receivedBody: rawBody.substring(0, 200) 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 4. Validate required fields
    const { email, name, code, dealTitle } = requestData;
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

    // 5. Send email
    try {
      console.log("Sending email...");
      const emailResult = await sendEmail(requestData);
      
      console.log("Email sent successfully:", emailResult);
      
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
      
      return new Response(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : "Unknown error sending email",
          timestamp: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
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
