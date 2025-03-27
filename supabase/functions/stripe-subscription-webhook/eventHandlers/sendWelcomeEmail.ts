
import { generateWelcomeEmailHtml } from "./emailTemplates.ts";
import { sendEmail } from "./emailSender.ts";

export async function sendWelcomeEmail(session: any, password: string, subscription: any) {
  try {
    if (!session.metadata || !session.metadata.email || !session.metadata.business_name) {
      console.error("Missing required metadata for email:", JSON.stringify(session.metadata || {}, null, 2));
      return { success: false, error: "Missing required metadata for email" };
    }
    
    console.log(`Preparing to send welcome email to ${session.metadata.email}`);
    
    // Format the current date as day month year
    const formattedDate = new Date().toLocaleDateString('sv-SE');
    
    // Determine subscription end date if available
    let subscriptionEndDate = "Not available";
    if (subscription && subscription.current_period_end) {
      subscriptionEndDate = new Date(subscription.current_period_end * 1000).toLocaleDateString('sv-SE');
    }
    
    // Format subscription details
    const planTitle = session.metadata.plan_title || "Standard";
    const planType = session.metadata.plan_type === 'yearly' ? 'Årsvis' : 'Månadsvis';
    
    // Generate the email HTML
    const emailHtml = generateWelcomeEmailHtml(
      session.metadata.business_name,
      session.metadata.email,
      password,
      planTitle,
      planType,
      formattedDate,
      subscriptionEndDate
    );
    
    // Send the email
    const emailResult = await sendEmail(
      session.metadata.email,
      "Välkommen till Lyxdeal - Din salonginformation",
      emailHtml
    );
    
    return emailResult;
  } catch (error) {
    console.error("Exception in sendWelcomeEmail:", error);
    console.error("Error stack:", error.stack);
    return { success: false, error: `Exception: ${error.message}` };
  }
}
