
import { getStripeClient } from "../stripeClient.ts";
import { getSupabaseAdmin } from "../supabaseClient.ts";
import { createSalonAccount } from "./createSalonAccount.ts";
import { updatePartnerRequestStatus } from "./updatePartnerRequest.ts";
import { sendWelcomeEmail } from "./sendWelcomeEmail.ts";

export async function handleCheckoutCompleted(session: any) {
  console.log("Checkout session completed:", session);
  
  const stripe = getStripeClient();
  const supabaseAdmin = getSupabaseAdmin();
  
  // Retrieve subscription information from Stripe
  let subscription;
  try {
    subscription = await stripe.subscriptions.retrieve(session.subscription);
    console.log("Subscription details:", subscription);
  } catch (subscriptionError) {
    console.error("Error retrieving subscription:", subscriptionError);
  }
  
  // Generate a random password
  const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  
  // Create a new salon account
  const userData = await createSalonAccount(supabaseAdmin, session, password);
  
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
    throw new Error("Failed to create salon record");
  }
  
  // Update partner request status
  await updatePartnerRequestStatus(supabaseAdmin, session.metadata.email);
  
  // Send welcome email with temporary password
  await sendWelcomeEmail(session, password, subscription);
  
  return { success: true };
}
