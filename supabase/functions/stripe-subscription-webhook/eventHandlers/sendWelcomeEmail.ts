
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
    
    if (!emailResponse.ok) {
      const emailErrorData = await emailResponse.json();
      console.error("Email API error:", emailErrorData);
      throw new Error("Failed to send welcome email");
    }
    
    console.log("Welcome email sent successfully");
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
    // Non-blocking error - log but don't throw
  }
}
