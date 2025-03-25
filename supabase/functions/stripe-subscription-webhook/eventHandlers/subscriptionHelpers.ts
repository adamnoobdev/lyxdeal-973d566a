
import { getStripeClient } from "../stripeClient.ts";

export async function getSubscriptionDetails(stripeSubscriptionId: string) {
  if (!stripeSubscriptionId) {
    console.warn("No subscription ID provided, skipping subscription retrieval");
    return null;
  }

  try {
    const stripe = getStripeClient();
    console.log("Retrieving subscription details for:", stripeSubscriptionId);
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    
    console.log("Subscription details retrieved:", subscription.id);
    console.log("Subscription status:", subscription.status);
    
    return subscription;
  } catch (subscriptionError) {
    console.error("Error retrieving subscription:", subscriptionError);
    console.error("Subscription error message:", subscriptionError.message);
    return null;
  }
}

export function formatSubscriptionData(session: any, subscription: any) {
  return {
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
}

export function generateRandomPassword() {
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
}
