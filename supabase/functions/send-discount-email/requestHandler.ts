
import { sendDiscountEmail } from "./emailSender.ts";
import { RequestPayload } from "./types.ts";
import { corsHeaders } from "./corsConfig.ts";

export async function handleRequest(req: Request) {
  console.log("Received request to send-discount-email function");
  
  try {
    const payload: RequestPayload = await req.json();
    const { email, name, code, dealTitle, phone, bookingUrl } = payload;

    // Validate required fields
    if (!email || !name || !code || !dealTitle) {
      console.error("Missing required fields", { email, name, code, dealTitle });
      return new Response(
        JSON.stringify({ error: "Missing required fields", fields: { email, name, code, dealTitle } }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email and return response
    return await sendDiscountEmail(payload);
    
  } catch (error) {
    console.error("Request parsing error:", error);
    return new Response(
      JSON.stringify({ error: "Invalid request format", message: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
}
