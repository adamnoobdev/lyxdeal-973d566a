
import { format } from "date-fns";
import { SubscriptionInfo, SUBSCRIPTION_PLANS } from "./types";

export const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return "N/A";
  
  try {
    const date = new Date(dateStr);
    return format(date, "yyyy-MM-dd");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Ogiltigt datum";
  }
};

export const getSubscriptionTypeLabel = (type: string | null | undefined): string => {
  if (!type) return "Månadsvis";
  
  switch (type.toLowerCase()) {
    case "yearly":
      return "Årsvis";
    case "monthly":
    default:
      return "Månadsvis";
  }
};

export const getCurrentPrice = (planTitle: string, subscriptionType: string | null | undefined): number => {
  const plan = SUBSCRIPTION_PLANS[planTitle || "Baspaket"];
  if (!plan) return 0;
  
  return subscriptionType?.toLowerCase() === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
};

export const getPlanDetails = (planTitle: string): {
  dealCount: number;
  allowsDiscountCodes: boolean;
  features: string[];
} => {
  const planKey = planTitle in SUBSCRIPTION_PLANS ? planTitle : "Baspaket";
  const plan = SUBSCRIPTION_PLANS[planKey];
  
  return {
    dealCount: plan.dealCount || 1,
    allowsDiscountCodes: planKey !== "Baspaket", // Only Premium allows discount codes
    features: plan.features
  };
};

// Evaluate if a salon can create a new deal based on their subscription
export const canCreateDeal = (
  subscriptionInfo: SubscriptionInfo, 
  activeDealsCount: number
): { allowed: boolean; reason?: string } => {
  // First check if subscription is active
  if (subscriptionInfo.status !== 'active') {
    return {
      allowed: false,
      reason: "Din prenumeration är inte aktiv. Vänligen aktivera din prenumeration för att skapa erbjudanden."
    };
  }
  
  // Check if subscription is being canceled
  if (subscriptionInfo.cancel_at_period_end) {
    const endDate = subscriptionInfo.current_period_end 
      ? formatDate(subscriptionInfo.current_period_end) 
      : "slutdatum";
      
    return {
      allowed: true, // Still allowed until end date
      reason: `OBS: Din prenumeration är uppsagd och avslutas ${endDate}. Du kan fortsätta använda funktionerna tills dess.`
    };
  }
  
  // Check deal limits based on plan
  const planDetails = getPlanDetails(subscriptionInfo.plan_title);
  if (activeDealsCount >= planDetails.dealCount) {
    return {
      allowed: false,
      reason: `Du har redan nått maxgränsen på ${planDetails.dealCount} aktiva erbjudanden för din prenumerationsnivå.`
    };
  }
  
  return { allowed: true };
};
