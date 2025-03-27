
import { getStripeClient } from "../stripeClient.ts";

export function generateRandomPassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const stripe = getStripeClient();
    
    console.log(`Retrieving subscription details for: ${subscriptionId}`);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log(`Subscription details retrieved: ${subscription.id}`);
    
    console.log(`Subscription status: ${subscription.status}`);
    
    return subscription;
  } catch (error) {
    console.error("Error retrieving subscription:", error);
    throw error;
  }
}

export function formatSubscriptionData(session: any, subscription: any) {
  // Extract metadata from session and subscription
  const metadata = session.metadata || {};
  
  return {
    stripe_subscription_id: session.subscription,
    // Do not include plan_title or subscription_plan here
    status: subscription ? subscription.status : 'active',
    current_period_end: subscription ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: subscription ? subscription.cancel_at_period_end : false
  };
}
