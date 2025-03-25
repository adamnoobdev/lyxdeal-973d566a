
import { getStripeClient } from "../stripeClient.ts";
import { getSupabaseAdmin } from "../supabaseClient.ts";
import { createSalonAccount } from "./createSalonAccount.ts";
import { updatePartnerRequestStatus } from "./updatePartnerRequest.ts";
import { sendWelcomeEmail } from "./sendWelcomeEmail.ts";

export async function handleCheckoutCompleted(session: any) {
  console.log("Checkout session completed:", session.id);
  console.log("Full session object:", JSON.stringify(session, null, 2));
  
  if (!session.metadata || !session.metadata.email || !session.metadata.business_name) {
    console.error("Missing required metadata in session:", JSON.stringify(session.metadata || {}, null, 2));
    throw new Error("Missing required metadata in session");
  }
  
  const stripe = getStripeClient();
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
    let subscription;
    try {
      if (session.subscription) {
        console.log("Retrieving subscription details for:", session.subscription);
        subscription = await stripe.subscriptions.retrieve(session.subscription);
        console.log("Subscription details retrieved:", subscription.id);
        console.log("Subscription status:", subscription.status);
      } else {
        console.warn("No subscription ID in session, skipping subscription retrieval");
      }
    } catch (subscriptionError) {
      console.error("Error retrieving subscription:", subscriptionError);
      console.error("Subscription error message:", subscriptionError.message);
      // Continue without subscription details
    }
    
    // Generate a secure random password
    const generatePassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let password = "";
      const length = 12; // Ensure constant length
      
      // Use crypto random for better security if available
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      
      for (let i = 0; i < length; i++) {
        password += chars.charAt(array[i] % chars.length);
      }
      
      return password;
    };
    
    const password = generatePassword();
    console.log(`Generated secure password of length: ${password.length}`);
    
    // Begin transaction - we'll try to create everything in a consistent manner
    console.log("Beginning account creation process for:", session.metadata.email);
    
    // Create a new salon account
    console.log("Creating salon account for:", session.metadata.email);
    const userData = await createSalonAccount(supabaseAdmin, session, password);
    
    if (!userData || !userData.user) {
      console.error("Failed to create salon account: No user data returned");
      throw new Error("Failed to create salon account: No user data returned");
    }
    
    console.log("User account created successfully with ID:", userData.user.id);
    
    // Get subscription data
    const subscriptionData = {
      stripe_subscription_id: subscription?.id || "",
      stripe_customer_id: session.customer,
      plan_title: session.metadata.plan_title || "Standard",
      plan_type: session.metadata.plan_type || "monthly",
      status: subscription?.status || "active",
      current_period_end: subscription?.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null,
      cancel_at_period_end: subscription?.cancel_at_period_end || false
    };
    
    // Create salon record
    console.log("Creating salon record for:", session.metadata.business_name);
    console.log("Salon data to insert:", {
      name: session.metadata.business_name,
      email: session.metadata.email,
      role: "salon_owner",
      user_id: userData.user.id,
      subscription_plan: session.metadata.plan_title,
      ...subscriptionData
    });
    
    try {
      const { data: salonData, error: salonError } = await supabaseAdmin
        .from("salons")
        .insert([
          {
            name: session.metadata.business_name,
            email: session.metadata.email,
            role: "salon_owner",
            user_id: userData.user.id,
            subscription_plan: session.metadata.plan_title || "Standard",
            subscription_type: session.metadata.plan_type || "monthly",
            stripe_customer_id: session.customer,
            ...subscriptionData
          }
        ])
        .select();

      if (salonError) {
        console.error("Error creating salon:", salonError);
        console.error("Salon error message:", salonError.message);
        console.error("Salon error details:", salonError.details);
        throw new Error(`Failed to create salon record: ${salonError.message}`);
      }
      
      if (!salonData || salonData.length === 0) {
        console.error("No salon data returned after creation");
        throw new Error("Failed to create salon record: No data returned");
      }
      
      console.log("Salon record created successfully:", salonData[0].id);
      
      // Verify the salon was actually created and has the right user_id
      const { data: verifyData, error: verifyError } = await supabaseAdmin
        .from("salons")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();
        
      if (verifyError) {
        console.error("Error verifying salon creation:", verifyError);
      } else if (verifyData) {
        console.log("Salon verification successful:", verifyData.id);
      } else {
        console.error("Salon verification failed: No salon found with user_id:", userData.user.id);
      }
      
    } catch (salonCreationError) {
      console.error("Exception during salon creation:", salonCreationError);
      console.error("Salon creation error stack:", salonCreationError.stack);
      throw salonCreationError;
    }
    
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
    try {
      console.log("Setting up first login tracking for user:", userData.user.id);
      const { error: firstLoginError } = await supabaseAdmin
        .from("salon_user_status")
        .insert([{ user_id: userData.user.id, first_login: true }]);
        
      if (firstLoginError) {
        console.error("Error setting first login status:", firstLoginError);
      } else {
        console.log("First login status set successfully");
      }
    } catch (firstLoginError) {
      console.error("Exception setting first login status:", firstLoginError);
      // Non-blocking - continue with account creation
    }
    
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
