
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
      console.log("Raw request body length:", rawBody?.length || 0);
      
      // Enhanced error handling for empty body
      if (!rawBody || rawBody.trim() === '') {
        console.error("Empty request body received in requestHandler");
        return new Response(
          JSON.stringify({ 
            error: "Empty request body received", 
            message: "The function received an empty body. Check that the request is properly formatted."
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
      
      console.log("Raw request body preview:", rawBody.substring(0, 100) + (rawBody.length > 100 ? '...' : ''));
      
      try {
        requestData = JSON.parse(rawBody);
        console.log("Successfully parsed JSON body");
        
        // Check if the parsed object is empty
        if (!requestData || (typeof requestData === 'object' && Object.keys(requestData).length === 0)) {
          console.error("Empty JSON object received after parsing");
          return new Response(
            JSON.stringify({ error: "Empty JSON object in request body" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
          );
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError.message);
        return new Response(
          JSON.stringify({ 
            error: "Invalid JSON format", 
            details: parseError.message, 
            receivedBody: rawBody.substring(0, 200) + (rawBody.length > 200 ? '...' : '') 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
        );
      }
    } catch (error) {
      console.error("Error processing request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request body", rawErrorMessage: error.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 3. Validate required fields with detailed logging
    console.log("Checking required fields in the request data");
    console.log("Fields received:", Object.keys(requestData || {}).join(", "));
    
    const { email, name, code, dealTitle } = requestData;
    console.log("Critical fields check:", {
      hasEmail: !!email,
      hasName: !!name,
      hasCode: !!code,
      hasDealTitle: !!dealTitle
    });
    
    // More detailed logging of incoming data
    console.log("Incoming email request:", {
      email: email ? `${email.substring(0, 3)}***` : undefined,
      name,
      hasPhone: !!requestData.phone,
      codeLength: code?.length,
      dealTitleLength: dealTitle?.length,
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
        JSON.stringify({ 
          error: `Missing required fields: ${missingFields.join(", ")}`,
          receivedFields: Object.keys(requestData || {}),
          receivedData: {
            email: email ? `${email.substring(0, 3)}***` : undefined,
            name: name || undefined,
            code: code ? `${code.substring(0, 2)}***` : undefined,
            dealTitle: dealTitle ? `${dealTitle.substring(0, 20)}${dealTitle?.length > 20 ? '...' : ''}` : undefined
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // 4. Send email
    try {
      console.log("All validations passed, sending email with code:", code);
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
      
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      
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
