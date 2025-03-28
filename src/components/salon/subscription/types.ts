
export interface SubscriptionInfo {
  plan_title: string;
  subscription_type: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_end: string | null;
  status: string;
  cancel_at_period_end: boolean;
}
