
import { SUBSCRIPTION_PLANS } from "./types";

export const formatDate = (date: string | null): string => {
  if (!date) return "Okänt datum";
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('sv-SE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const getPlanDetails = (planTitle: string | undefined) => {
  if (!planTitle || !SUBSCRIPTION_PLANS[planTitle]) {
    return SUBSCRIPTION_PLANS["Baspaket"]; // Default to basic package
  }
  
  return SUBSCRIPTION_PLANS[planTitle];
};

export const getSubscriptionTypeLabel = (type: string): string => {
  switch (type?.toLowerCase()) {
    case 'yearly':
      return 'Årsvis';
    case 'monthly':
    default:
      return 'Månadsvis';
  }
};

export const getCurrentPrice = (planTitle: string | undefined, subscriptionType: string | undefined): number => {
  const plan = getPlanDetails(planTitle);
  
  if (subscriptionType?.toLowerCase() === 'yearly') {
    return plan.yearlyPrice;
  }
  
  return plan.monthlyPrice;
};
