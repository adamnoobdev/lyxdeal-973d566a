
import { corsHeaders } from "./corsConfig.ts";
import { emailSender } from "./emailSender.ts";
import { generateEmailHtml } from "./emailTemplate.ts";

export async function requestHandler(req: Request) {
  try {
    // Parse the JSON body
    const { email, name, code, dealTitle, phone, subscribedToNewsletter } = await req.json();

    // Validate required fields
    if (!email || !code || !dealTitle) {
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

    const testMode = Deno.env.get("ENVIRONMENT") !== "production";
    const recipientEmail = testMode ? "test@example.com" : email;
    
    // Generate HTML content for the email
    const htmlContent = generateEmailHtml({
      name: name || "Kund",
      code,
      dealTitle,
      subscribedToNewsletter,
    });

    // Send the email
    const emailResponse = await emailSender({
      to: recipientEmail,
      subject: `Din rabattkod för: ${dealTitle}`,
      html: htmlContent,
    });

    // Return the response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        emailId: emailResponse.id,
        productionMode: !testMode,
        redirectedTo: testMode ? recipientEmail : null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
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
