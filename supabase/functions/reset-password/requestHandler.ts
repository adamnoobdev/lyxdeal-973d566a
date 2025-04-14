
import { corsHeaders } from "./corsConfig.ts";
import { ResetPasswordRequest } from "./types.ts";
import { sendResetPasswordEmail } from "./emailSender.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Handles the reset password request
 */
export async function handleResetPasswordRequest(req: Request): Promise<Response> {
  try {
    // Parse request body
    const data: ResetPasswordRequest = await req.json();
    
    if (!data.email || !data.resetUrl) {
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

    console.log(`Processing password reset for: ${data.email}`);
    console.log(`Reset base URL: ${data.resetUrl}`);
    
    // Create Supabase client to generate a reset token
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase environment variables are missing");
      console.error(`SUPABASE_URL: ${supabaseUrl ? "set" : "missing"}`);
      console.error(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? "set" : "missing"}`);
      throw new Error("Configuration error: Supabase environment variables are missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if the user exists before attempting to reset password
    const { data: userCheck, error: userCheckError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', data.email)
      .maybeSingle();

    if (userCheckError) {
      console.error("Error checking if user exists:", userCheckError);
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

    // Determine production vs development environment
    const isProduction = data.resetUrl.includes("lyxdeal.se");
    
    // Use correct reset URL based on environment
    const redirectBase = isProduction ? "https://lyxdeal.se" : data.resetUrl;
    const redirectUrl = new URL("/salon/update-password", redirectBase).href;
    
    console.log("Using redirect URL:", redirectUrl);
    
    // Generate a token for the user's email without sending Supabase's email
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
      console.error("No action_link was generated:", tokenData);
      return new Response(
        JSON.stringify({ 
          error: "Could not generate reset token", 
          details: "No action_link was generated" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Extract actionLink which contains the recovery token
    const actionLink = tokenData.properties.action_link;
    console.log("Reset token link generated:", actionLink);
    
    // Send custom email with the reset link
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (!resendApiKey) {
        console.error("RESEND_API_KEY is not configured");
        return new Response(
          JSON.stringify({ 
            error: "Email service configuration error", 
            hint: "RESEND_API_KEY is missing"
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      const emailResponse = await sendResetPasswordEmail(data.email, actionLink);
      console.log("Email sending response:", emailResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Reset instructions sent",
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
    console.error("Error in reset-password function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}
