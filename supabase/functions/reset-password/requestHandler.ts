
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

    console.log(`Sending password reset to: ${data.email}`);
    
    // Create Supabase client to generate a reset token
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase environment variables are missing");
      throw new Error("Configuration error: Supabase environment variables are missing");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Determine production vs development environment
    const isProductionDomain = data.resetUrl.includes("lyxdeal.se");
    
    // Use correct reset URL based on environment - direct browser to update-password with token
    const redirectBase = isProductionDomain ? "https://lyxdeal.se" : data.resetUrl;
    
    console.log("Using redirect base:", redirectBase);
    
    // Generate a token for the user's email without sending Supabase's email
    const { data: tokenData, error: tokenError } = await supabase
      .auth
      .admin
      .generateLink({
        type: "recovery",
        email: data.email,
        options: {
          // IMPORTANT: Redirect to domain root to let client-side handle the redirect
          // This ensures the hash fragment with the token remains intact
          redirectTo: redirectBase
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
    const emailResponse = await sendResetPasswordEmail(data.email, actionLink);

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
