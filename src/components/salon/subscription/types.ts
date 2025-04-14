
export interface SubscriptionInfo {
  id?: string;
  status: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  plan_title: string;
  subscription_type: string;
  current_period_end: string | null;
  current_period_start: string | null;
  cancel_at_period_end: boolean;
  created_at?: string;
  expirationDate?: string | null;
}

export interface PlanDetails {
  dealCount: number;
  allowsDiscountCodes: boolean;
  features: string[];
}

export interface SubscriptionPlan {
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearSavings: number;
  dealCount: number;
  features: string[];
  isPopular?: boolean;
}

export interface SubscriptionDetailsHook {
  purchaseDetails: PurchaseDetails | null;
  salonAccount: SalonAccount | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  isRetrying: boolean;
  timeElapsed: number;
  manualRetry: () => void;
  maxRetries: number;
}

export interface PurchaseDetails {
  id?: string;
  business_name: string;
  email: string;
  plan_title?: string;
  plan_payment_type?: string;
  status?: string;
  created_at?: string;
  stripe_session_id?: string;
}

export interface SalonAccount {
  id: number;
  email: string;
  name?: string;
}

// Now let's define our subscription plans with the actual pricing and features
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  "Baspaket": {
    title: "Baspaket",
    monthlyPrice: 399,
    yearlyPrice: 3588,
    yearSavings: 1200,
    dealCount: 1,
    features: [
      "1 erbjudande åt gången",
      "Direktbokning (utan rabattkod)",
      "Personligt dashboard",
      "Statistik och överblick",
      "Kundtjänst via e-post"
    ],
    isPopular: false
  },
  "Premiumpaket": {
    title: "Premiumpaket",
    monthlyPrice: 699,
    yearlyPrice: 6288,
    yearSavings: 2100,
    dealCount: 3,
    features: [
      "Direktbokning och rabattkoder",
      "Avancerad statistik och överblick",
      "Prioriterad kundtjänst",
      "Tillgång till beta-funktioner"
    ],
    isPopular: true
  }
};
