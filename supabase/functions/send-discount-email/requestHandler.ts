
import { corsHeaders } from "./corsConfig.ts";
import { sendDiscountEmail } from "./emailSender.ts";
import { createEmailContent } from "./emailTemplates/template.ts";

export async function requestHandler(req: Request) {
  try {
    // Parse the JSON body
    const requestBody = await req.json();
    console.log("Received request body:", JSON.stringify(requestBody));
    
    const { email, name, code, dealTitle, phone, subscribedToNewsletter, bookingUrl } = requestBody;

    // Validate required fields
    if (!email || !code || !dealTitle) {
      console.error("Missing required fields:", { email, code, dealTitle });
      return new Response(
        JSON.stringify({
          error: "Missing required fields: email, code, and dealTitle are required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Processing email request for ${email}, deal "${dealTitle}", code: ${code}`);
    
    // Use the sendDiscountEmail function which handles the actual email sending
    return await sendDiscountEmail({
      email,
      name: name || "Kund", // Default if name is not provided
      phone: phone || "",
      code,
      dealTitle,
      bookingUrl
    });
    
  } catch (error) {
    console.error("Error processing request:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
