
import { getSupabaseAdmin } from "../supabaseClient.ts";
import { createSalonAccount } from "./createSalonAccount.ts";
import { updatePartnerRequestStatus } from "./updatePartnerRequest.ts";
import { sendWelcomeEmail } from "./sendWelcomeEmail.ts";
import { createSalonRecord, setupFirstLoginTracking } from "./salonCreation.ts";
import { 
  getSubscriptionDetails, 
  formatSubscriptionData, 
  generateRandomPassword 
} from "./subscriptionHelpers.ts";

export async function handleCheckoutCompleted(session: any) {
  console.log("Checkout session completed:", session.id);
  console.log("Full session object:", JSON.stringify(session, null, 2));
  
  if (!session.metadata || !session.metadata.email || !session.metadata.business_name) {
    console.error("Missing required metadata in session:", JSON.stringify(session.metadata || {}, null, 2));
    throw new Error("Missing required metadata in session");
  }
  
  const supabaseAdmin = getSupabaseAdmin();
  
  try {
    // First, update the partner request with the session ID
    try {
      console.log("Updating partner request with session ID:", session.id);
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from("partner_requests")
        .update({ 
          stripe_session_id: session.id,
          status: "approved"
        })
        .eq("email", session.metadata.email)
        .select();
        
      if (updateError) {
        console.error("Error updating partner request with session ID:", updateError);
      } else {
        console.log("Partner request updated with session ID:", updateData);
      }
    } catch (updateError) {
      console.error("Exception updating partner request:", updateError);
      // Continue despite error
    }
    
    // Retrieve subscription information from Stripe
    const subscription = session.subscription 
      ? await getSubscriptionDetails(session.subscription) 
      : null;
    
    // Generate a secure random password
    const password = generateRandomPassword();
    console.log(`Generated secure password of length: ${password.length}`);
    
    // Begin transaction - we'll try to create everything in a consistent manner
    console.log("Beginning account creation process for:", session.metadata.email);
    
    // Create a new salon account with simplified approach
    console.log("Creating salon account for:", session.metadata.email);
    const userData = await createSalonAccount(supabaseAdmin, session, password);
    
    if (!userData || !userData.user) {
      console.error("Failed to create salon account: No user data returned");
      throw new Error("Failed to create salon account: No user data returned");
    }
    
    console.log("User/salon account processed successfully with ID:", userData.user.id);
    
    // Get subscription data
    const subscriptionData = formatSubscriptionData(session, subscription);
    
    // Create/update salon record
    const salonData = await createSalonRecord(supabaseAdmin, session, userData, subscriptionData);
    
    // Update partner request status
    try {
      console.log("Updating partner request status for:", session.metadata.email);
      const partnerResult = await updatePartnerRequestStatus(supabaseAdmin, session.metadata.email);
      console.log("Partner request update result:", partnerResult);
    } catch (partnerError) {
      console.error("Error updating partner request:", partnerError);
      // Non-blocking - continue with account creation
    }
    
    // Send welcome email with temporary password
    console.log("Sending welcome email to:", session.metadata.email);
    let emailResult;
    try {
      emailResult = await sendWelcomeEmail(session, password, subscription);
      
      if (!emailResult.success) {
        console.error("Failed to send welcome email:", emailResult.error);
        // Log but continue with account creation
      } else {
        console.log("Welcome email sent successfully");
      }
    } catch (emailError) {
      console.error("Exception sending welcome email:", emailError);
      emailResult = { success: false, error: emailError.message };
      // Non-blocking - continue with account creation
    }
    
    // Check for first login tracking
    const loginTrackingResult = await setupFirstLoginTracking(supabaseAdmin, userData.user.id);
    
    return { 
      success: true, 
      userId: userData.user.id,
      salonCreated: true,
      emailSent: emailResult?.success || false,
      email: session.metadata.email
    };
  } catch (error) {
    console.error("Critical error in handleCheckoutCompleted:", error);
    console.error("Error stack:", error.stack);
    // Rethrow to ensure webhook processing fails and can be retried
    throw error;
  }
}
