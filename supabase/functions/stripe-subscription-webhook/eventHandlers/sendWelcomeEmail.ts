
export async function sendWelcomeEmail(session: any, password: string, subscription: any) {
  try {
    console.log("Sending welcome email to:", session.metadata.email);
    const emailResponse = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-salon-welcome`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
      },
      body: JSON.stringify({
        email: session.metadata.email,
        business_name: session.metadata.business_name,
        temporary_password: password,
        subscription_info: {
          plan: session.metadata.plan_title,
          type: session.metadata.plan_type,
          start_date: new Date().toISOString(),
          next_billing_date: subscription?.current_period_end 
            ? new Date(subscription.current_period_end * 1000).toISOString() 
            : null
        }
      }),
    });
    
    // Log the complete response for debugging
    const emailResponseStatus = emailResponse.status;
    const emailResponseText = await emailResponse.text();
    console.log(`Welcome email API response status: ${emailResponseStatus}`);
    console.log(`Welcome email API response: ${emailResponseText}`);
    
    // Try to parse the response as JSON if possible
    let emailResponseData;
    try {
      emailResponseData = JSON.parse(emailResponseText);
    } catch (parseError) {
      console.error("Error parsing email response:", parseError);
    }
    
    if (!emailResponse.ok) {
      console.error("Email API error:", emailResponseData || emailResponseText);
      throw new Error(`Failed to send welcome email: ${emailResponseText}`);
    }
    
    console.log("Welcome email sent successfully");
    return { success: true, message: "Welcome email sent successfully" };
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
    // Non-blocking error - log but don't throw
    return { success: false, error: emailError.message };
  }
}
