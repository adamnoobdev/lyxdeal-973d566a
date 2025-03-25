
export async function sendWelcomeEmail(session: any, password: string, subscription: any) {
  try {
    if (!session || !session.metadata || !session.metadata.email) {
      console.error("Missing required session data for email:", JSON.stringify(session || {}, null, 2));
      return { success: false, error: "Missing required session data" };
    }
    
    if (!password) {
      console.error("Missing required password for welcome email");
      return { success: false, error: "Missing required password" };
    }
    
    console.log("Sending welcome email to:", session.metadata.email);
    console.log("Data to be sent:", {
      email: session.metadata.email,
      business_name: session.metadata.business_name,
      passwordLength: password ? password.length : 0,
      hasSubscription: Boolean(subscription)
    });
    
    // Get the Supabase URL and anon key from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase URL or anon key in environment variables");
      return { success: false, error: "Missing Supabase configuration" };
    }
    
    // Prepare the payload with all required data
    const emailPayload = {
      email: session.metadata.email,
      business_name: session.metadata.business_name,
      temporary_password: password,
      subscription_info: {
        plan: session.metadata.plan_title || "Standardplan",
        type: session.metadata.plan_payment_type || "monthly",
        start_date: new Date().toISOString(),
        next_billing_date: subscription?.current_period_end 
          ? new Date(subscription.current_period_end * 1000).toISOString() 
          : null
      }
    };
    
    console.log("Calling send-salon-welcome edge function with payload:", JSON.stringify(emailPayload, null, 2));
    
    // Call the send-salon-welcome edge function
    try {
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-salon-welcome`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(emailPayload),
      });
      
      // Log the complete response for debugging
      const emailResponseStatus = emailResponse.status;
      console.log(`Welcome email API response status: ${emailResponseStatus}`);
      
      // Get response text
      let emailResponseText;
      try {
        emailResponseText = await emailResponse.text();
        console.log(`Welcome email API response: ${emailResponseText}`);
      } catch (textError) {
        console.error("Error getting response text:", textError);
        return { success: false, error: "Failed to read email response" };
      }
      
      // Try to parse the response as JSON if possible
      let emailResponseData;
      try {
        emailResponseData = JSON.parse(emailResponseText);
      } catch (parseError) {
        console.error("Error parsing email response:", parseError);
        // Continue without parsed data
      }
      
      if (!emailResponse.ok) {
        console.error("Email API error:", emailResponseData || emailResponseText);
        return { 
          success: false, 
          error: `Failed to send welcome email: ${emailResponseText}`,
          status: emailResponseStatus
        };
      }
      
      console.log("Welcome email sent successfully");
      return { 
        success: true, 
        message: "Welcome email sent successfully",
        data: emailResponseData
      };
    } catch (fetchError) {
      console.error("Fetch error sending welcome email:", fetchError);
      console.error("Fetch error message:", fetchError.message);
      console.error("Fetch error stack:", fetchError.stack);
      return { success: false, error: `Fetch error: ${fetchError.message}` };
    }
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
    console.error("Email error stack:", emailError.stack);
    // Non-blocking error - log but don't throw
    return { 
      success: false, 
      error: emailError.message, 
      timestamp: new Date().toISOString()
    };
  }
}
