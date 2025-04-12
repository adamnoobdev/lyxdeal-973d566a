
import { corsHeaders } from "./corsConfig.ts";
import { ResetPasswordRequest } from "./types.ts";
import { sendResetPasswordEmail } from "./emailSender.ts";

/**
 * Handles the reset password request
 */
export async function handleResetPasswordRequest(req: Request): Promise<Response> {
  try {
    console.log("Reset password function called");
    
    // Parse the request body
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
    console.log(`Original reset URL: ${data.resetUrl}`);
    
    // Ensure the resetUrl is correctly formatted and points to the update-password page
    try {
      const resetUrlObj = new URL(data.resetUrl);
      
      // Make sure URL points to the correct update-password page path
      const pathname = resetUrlObj.pathname;
      
      // If path doesn't include /update-password, fix it
      if (!pathname.includes("update-password")) {
        resetUrlObj.pathname = "/update-password";
        data.resetUrl = resetUrlObj.toString();
        console.log("URL adjusted to point to /update-password:", data.resetUrl);
      }
      
      // Make sure we're not adding duplicate tokens or parameters
      // Let Supabase auth handle the token part in their own flow
    } catch (urlError) {
      console.error("Invalid URL format:", urlError);
      // Fallback if URL can't be parsed
      const domain = req.headers.get("origin") || "https://www.lyxdeal.se";
      data.resetUrl = `${domain}/update-password`;
      console.log("Using fallback URL:", data.resetUrl);
    }

    // Send email using Resend
    console.log("Sending reset email with final URL:", data.resetUrl);
    const emailResponse = await sendResetPasswordEmail(data.email, data.resetUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Recovery instructions sent",
        data: emailResponse,
        resetUrl: data.resetUrl
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
