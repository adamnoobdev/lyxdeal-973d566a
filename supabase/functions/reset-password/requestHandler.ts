
import { corsHeaders } from "./corsConfig.ts";
import { ResetPasswordRequest } from "./types.ts";
import { sendResetPasswordEmail } from "./emailSender.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Handles the reset password request
 */
export async function handleResetPasswordRequest(req: Request): Promise<Response> {
  console.log("=== Starting handleResetPasswordRequest function ===");
  
  try {
    // Parse request body
    let data: ResetPasswordRequest;
    try {
      data = await req.json();
      console.log("Request data received:", JSON.stringify(data));
    } catch (parseError) {
      console.error("Failed to parse request JSON:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid JSON in request body",
          details: parseError instanceof Error ? parseError.message : String(parseError)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Validate request data
    if (!data.email) {
      console.error("Missing email in request");
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: email",
          received: JSON.stringify(data)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!data.resetUrl) {
      console.error("Missing resetUrl in request");
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: resetUrl",
          received: JSON.stringify(data)
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Processing password reset for email: ${data.email}`);
    console.log(`Reset base URL: ${data.resetUrl}`);
    
    // Get Supabase environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    // Log environment variable status (without revealing actual values)
    console.log(`SUPABASE_URL status: ${supabaseUrl ? "Set" : "MISSING"}`);
    console.log(`SUPABASE_SERVICE_ROLE_KEY status: ${supabaseServiceKey ? "Set" : "MISSING"}`);
    console.log(`RESEND_API_KEY status: ${Deno.env.get("RESEND_API_KEY") ? "Set" : "MISSING"}`);

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("CRITICAL ERROR: Supabase environment variables are missing");
      throw new Error("Configuration error: Supabase environment variables are missing");
    }

    // Initialize Supabase client
    console.log("Initializing Supabase client");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if user exists in the salons table instead of profiles
    console.log(`Checking if user with email ${data.email} exists in salons table`);
    const { data: userCheck, error: userCheckError } = await supabase
      .from('salons')
      .select('id, email')
      .eq('email', data.email)
      .maybeSingle();

    if (userCheckError) {
      console.error("Error checking if salon exists:", userCheckError);
      // Don't reveal if user exists or not for security reasons
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Reset instructions sent if email exists"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    if (!userCheck) {
      console.log("Salon not found, returning success response for security");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Reset instructions sent if email exists"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Salon found, proceeding with password reset");
    
    // Determine production vs development environment from the reset URL
    const isProduction = data.resetUrl.includes("lyxdeal.se");
    console.log(`Environment detected as: ${isProduction ? "Production" : "Development"}`);
    
    // Create the redirect URL for the password reset link
    const redirectBase = isProduction ? "https://lyxdeal.se" : data.resetUrl;
    // Use full path instead of just /salon/update-password
    const redirectUrl = new URL("/salon/update-password", redirectBase).href;
    
    console.log("Using redirect URL for password reset:", redirectUrl);
    
    // Generate a token for the user's email
    console.log("Generating password reset token");
    const { data: tokenData, error: tokenError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: data.email,
      options: {
        redirectTo: redirectUrl
      }
    });
    
    if (tokenError) {
      console.error("Error generating reset token:", tokenError);
      return new Response(
        JSON.stringify({ 
          error: "Could not generate reset token", 
          details: tokenError 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    if (!tokenData || !tokenData.properties || !tokenData.properties.action_link) {
      console.error("No action_link was generated in token data:", JSON.stringify(tokenData));
      return new Response(
        JSON.stringify({ 
          error: "Could not generate reset token", 
          details: "No action_link was generated",
          tokenData: tokenData
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Extract the action link with the token
    const actionLink = tokenData.properties.action_link;
    console.log("Reset token link generated:", actionLink);
    
    // Send the custom email with the reset link
    try {
      console.log("Preparing to send email");
      const emailResponse = await sendResetPasswordEmail(data.email, actionLink);
      console.log("Email sent successfully:", emailResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Reset instructions sent to email",
          data: emailResponse
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email", 
          details: emailError instanceof Error ? emailError.message : String(emailError)
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("Unhandled error in reset-password function:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } finally {
    console.log("=== Completed handleResetPasswordRequest function ===");
  }
}
