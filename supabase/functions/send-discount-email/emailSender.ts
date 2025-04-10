
import { Resend } from "npm:resend@2.0.0";
import { generateEmailTemplate } from "./emailTemplate.ts";
import type { EmailRequest } from "./types.ts";

// Initiera Resend-klienten med API-nyckel
let resend: Resend;

try {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
  } else {
    resend = new Resend(apiKey);
  }
} catch (error) {
  console.error("Error initializing Resend client:", error);
}

export async function sendEmail(data: EmailRequest) {
  try {
    // Säkerställ att alla texter är trimmade och korrekt formaterade
    const email = data.email.trim().toLowerCase();
    const name = data.name.trim();
    const code = data.code ? data.code.trim().toUpperCase() : ""; // Hantera fall där kod kan vara undefined
    const dealTitle = data.dealTitle.trim();
    const phone = data.phone ? data.phone.trim() : "";
    const bookingUrl = data.bookingUrl || null;
    
    console.log(`Preparing to send email to ${email} with discount code ${code}`);
    console.log(`Deal title: "${dealTitle}", booking URL: ${bookingUrl || 'none'}`);

    // Validera obligatoriska fält
    if (!email || !name || (!code && code !== "DIRECT_BOOKING") || !dealTitle) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!name) missingFields.push("name");
      if (!code && code !== "DIRECT_BOOKING") missingFields.push("code");
      if (!dealTitle) missingFields.push("dealTitle");
      
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // 1. Generera e-postinnehåll
    const { html, subject } = generateEmailTemplate({ 
      ...data, 
      email, 
      name, 
      code, 
      dealTitle, 
      phone,
      bookingUrl
    });

    // 2. Konfigurera produktionsläge
    const isProduction = Deno.env.get("ENVIRONMENT") !== "development";
    
    // För testmiljö, dirigera om e-post till testadress
    let toEmail = email;
    let productionMode = true;
    
    if (!isProduction) {
      console.log("Running in development mode, redirecting email");
      toEmail = "test@example.com";
      productionMode = false;
    }

    // 3. Skicka e-post
    if (!resend) {
      throw new Error("Resend client is not initialized - API key may be missing");
    }
    
    // Loggning före e-postutskick
    console.log(`Sending email to: ${toEmail} (original recipient: ${email})`);
    console.log(`Subject: ${subject}`);
    console.log(`Production mode: ${productionMode}`);
    console.log(`Has booking URL: ${bookingUrl ? "Yes" : "No"}`);
    console.log(`Email length: ${html.length} characters`);
    
    // Skicka e-post med Resend
    try {
      const result = await resend.emails.send({
        from: "Beauty Deals <noreply@beautydeals.se>",
        to: [toEmail],
        subject: subject,
        html: html,
      });

      console.log("Email sent successfully:", result.id);
      
      return { id: result.id, productionMode };
    } catch (sendError) {
      console.error("Resend API error:", sendError);
      if (sendError instanceof Error) {
        console.error("Error message:", sendError.message);
        console.error("Error stack:", sendError.stack);
      }
      throw sendError;
    }
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}
