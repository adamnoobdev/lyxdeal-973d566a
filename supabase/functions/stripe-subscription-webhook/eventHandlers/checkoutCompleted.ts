
import { getStripeClient } from "../stripeClient.ts";
import { getSupabaseAdmin } from "../supabaseClient.ts";
import { createSalonAccount } from "./createSalonAccount.ts";
import { updatePartnerRequestStatus } from "./updatePartnerRequest.ts";
import { sendWelcomeEmail } from "./sendWelcomeEmail.ts";

export async function handleCheckoutCompleted(session: any) {
  console.log("Checkout session completed:", session.id);
  
  if (!session.metadata || !session.metadata.email || !session.metadata.business_name) {
    console.error("Missing required metadata in session:", JSON.stringify(session.metadata));
    throw new Error("Missing required metadata in session");
  }
  
  const stripe = getStripeClient();
  const supabaseAdmin = getSupabaseAdmin();
  
  // Retrieve subscription information from Stripe
  let subscription;
  try {
    subscription = await stripe.subscriptions.retrieve(session.subscription);
    console.log("Subscription details retrieved:", subscription.id);
  } catch (subscriptionError) {
    console.error("Error retrieving subscription:", subscriptionError);
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
  console.log(`Generated password of length: ${password.length}`);
  
  try {
    // Create a new salon account
    console.log("Creating salon account for:", session.metadata.email);
    const userData = await createSalonAccount(supabaseAdmin, session, password);
    
    if (!userData || !userData.user) {
      throw new Error("Failed to create salon account: No user data returned");
    }
    
    console.log("User account created with ID:", userData.user.id);
    
    // Get subscription data
    const subscriptionData = {
      stripe_subscription_id: subscription?.id || "",
      stripe_customer_id: session.customer,
      plan_title: session.metadata.plan_title,
      plan_type: session.metadata.plan_type,
      status: subscription?.status || "active",
      current_period_end: subscription?.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString() 
        : null,
      cancel_at_period_end: subscription?.cancel_at_period_end || false
    };
    
    // Create salon record
    console.log("Creating salon record for:", session.metadata.business_name);
    const { data: salonData, error: salonError } = await supabaseAdmin
      .from("salons")
      .insert([
        {
          name: session.metadata.business_name,
          email: session.metadata.email,
          role: "salon_owner",
          user_id: userData.user.id,
          subscription_plan: session.metadata.plan_title,
          subscription_type: session.metadata.plan_type,
          stripe_customer_id: session.customer,
          ...subscriptionData
        }
      ])
      .select();

    if (salonError) {
      console.error("Error creating salon:", salonError);
      throw new Error(`Failed to create salon record: ${salonError.message}`);
    }
    
    if (!salonData || salonData.length === 0) {
      console.error("No salon data returned after creation");
      throw new Error("Failed to create salon record: No data returned");
    }
    
    console.log("Salon record created successfully:", salonData[0].id);
    
    // Update partner request status
    await updatePartnerRequestStatus(supabaseAdmin, session.metadata.email);
    
    // Send welcome email with temporary password
    console.log("Sending welcome email to:", session.metadata.email);
    const emailResult = await sendWelcomeEmail(session, password, subscription);
    
    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
      // Log but continue with account creation
    } else {
      console.log("Welcome email sent successfully");
    }
    
    return { 
      success: true, 
      userId: userData.user.id,
      salonId: salonData[0].id,
      salonCreated: true,
      emailSent: emailResult.success 
    };
  } catch (error) {
    console.error("Error in handleCheckoutCompleted:", error);
    throw error;
  }
}
