
export interface SubscriptionInfo {
  plan_title: string;
  subscription_type: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_end: string | null;
  status: string;
  cancel_at_period_end: boolean;
}

export interface SubscriptionPlan {
  title: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearSavings: number;
  dealCount: number;
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  "Baspaket": {
    title: "Baspaket",
    monthlyPrice: 399,
    yearlyPrice: 2788,
    yearSavings: 2000,
    dealCount: 1,
    features: [
      "Tillgång till administratörspanel",
      "Synlighet på Lyxdeal.se",
      "Grundläggande statistik",
      "Kundhantering",
      "Direkt bokningslänk till din hemsida"
    ],
    limitations: [
      "Max 1 erbjudande åt gången",
      "Endast direkt bokning (inga rabattkoder)"
    ]
  },
  "Premiumpaket": {
    title: "Premiumpaket",
    monthlyPrice: 699,
    yearlyPrice: 5388,
    yearSavings: 3000,
    dealCount: 3,
    features: [
      "Tillgång till administratörspanel",
      "Synlighet på Lyxdeal.se",
      "Kundhantering",
      "Stöd för både rabattkoder och direkt bokning",
      "1 utvalt erbjudande i månaden",
      "Tillgång till beta-funktioner",
      "Prioriterad support"
    ],
    isPopular: true
  }
};
