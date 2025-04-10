
import { Resend } from "npm:resend@2.0.0";
import type { EmailRequest } from "./types.ts";
import { generateEmailTemplate } from "./emailTemplate.ts";

// Initialize Resend client with API key
let resend: Resend | null = null;

try {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
  } else {
    console.log(`Initializing Resend with API key starting with: ${apiKey.substring(0, 3)}...`);
    resend = new Resend(apiKey);
  }
} catch (error) {
  console.error("Error initializing Resend client:", error);
}

export async function sendEmail(data: EmailRequest) {
  try {
    // Validera och formatera indata
    if (!data || typeof data !== 'object') {
      throw new Error(`Invalid request data: ${JSON.stringify(data)}`);
    }

    // Ensure all text fields are trimmed and properly formatted
    const email = data.email?.trim().toLowerCase();
    const name = data.name?.trim() || "Kund";
    const code = data.code?.trim().toUpperCase() || "";
    const dealTitle = data.dealTitle?.trim() || "";
    const phone = data.phone?.trim() || "";
    const bookingUrl = data.bookingUrl || null;
    
    console.log(`Preparing to send email to ${email} with discount code ${code}`);
    console.log(`Deal title: "${dealTitle}", booking URL: ${bookingUrl || 'none'}`);
    console.log("Input validation check:", { 
      hasEmail: !!email, 
      hasName: !!name, 
      hasCode: !!code, 
      hasDealTitle: !!dealTitle
    });

    // Deep validation of required fields
    if (!email || !email.includes('@')) {
      throw new Error(`Invalid email format: ${email}`);
    }
    
    if (!code) {
      throw new Error("Discount code is required");
    }
    
    if (!dealTitle) {
      throw new Error("Deal title is required");
    }

    // 1. Generate email content
    const { html, subject } = generateEmailTemplate({ 
      ...data, 
      email, 
      name, 
      code, 
      dealTitle, 
      phone,
      bookingUrl
    });

    console.log(`Email content generated with length: ${html.length} characters`);
    console.log(`Email subject: "${subject}"`);

    // 2. Configure production mode
    const isProduction = Deno.env.get("ENVIRONMENT") !== "development";
    
    // For test environment, redirect emails to test address
    let toEmail = email;
    let productionMode = true;
    
    if (!isProduction) {
      console.log("Running in development mode, redirecting email");
      toEmail = "test@example.com";
      productionMode = false;
    }

    // 3. Send email
    if (!resend) {
      throw new Error("Resend client is not initialized - API key may be missing");
    }
    
    // Logging before email dispatch
    console.log(`Sending email to: ${toEmail} (original recipient: ${email})`);
    console.log(`Subject: ${subject}`);
    console.log(`Production mode: ${productionMode}`);
    console.log(`Has booking URL: ${bookingUrl ? "Yes" : "No"}`);
    
    // Send email with Resend
    try {
      console.log("Calling Resend API...");
      
      const result = await resend.emails.send({
        from: "Lyxdeal <noreply@lyxdeal.se>",
        to: [toEmail],
        subject: subject,
        html: html,
        headers: {
          "X-Entity-Ref-ID": `discount-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        }
      });

      console.log("Raw Resend API response:", JSON.stringify(result));
      
      // Fix: Properly check the response structure
      // The response could be { data: { id: "some-id" }, error: null }
      // or it could have an error property
      if (result && result.error) {
        console.error("Resend API error object:", result.error);
        throw new Error(result.error.message || "Unknown error from Resend API");
      }
      
      // Check if we have a data object with an ID
      if (result && result.data && result.data.id) {
        console.log("Email sent successfully, Resend message ID:", result.data.id);
        return { id: result.data.id, productionMode };
      }
      
      // If we don't have an error and don't have a valid data.id, log and throw
      console.error("Unexpected response format from Resend:", result);
      throw new Error("Received invalid response format from Resend API");
      
    } catch (sendError: any) {
      console.error("Resend API error:", sendError);
      console.error("Error name:", sendError.name);
      console.error("Error message:", sendError.message);
      
      if (sendError.response) {
        console.error("API response status:", sendError.response.status);
        console.error("API response data:", sendError.response.data);
      }
      
      throw sendError;
    }
  } catch (error: any) {
    console.error("Error in sendEmail function:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}
