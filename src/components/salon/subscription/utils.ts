
import { SubscriptionInfo, PlanDetails, SUBSCRIPTION_PLANS } from "./types";
import { format } from "date-fns";

/**
 * Kontrollerar om ett datum är i det förflutna
 */
export const isPastDate = (dateString: string | null): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  
  return date < now;
};

/**
 * Formaterar ett datum till en läsbar sträng
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Ogiltigt datum";
  }
};

/**
 * Returnerar information om användaren kan skapa erbjudanden och eventuell anledning
 */
export const canCreateDeal = (
  subscriptionInfo: SubscriptionInfo | null,
  activeDealsCount: number = 0
): { allowed: boolean; reason: string | null } => {
  if (!subscriptionInfo) {
    return { allowed: false, reason: "Ingen aktiv prenumeration hittades" };
  }
  
  // Kontrollera om prenumerationen är inaktiv
  if (subscriptionInfo.status !== "active") {
    return { allowed: false, reason: "Din prenumeration är inte aktiv" };
  }
  
  // Kontrollera om prenumerationen har gått ut
  if (isPastDate(subscriptionInfo.current_period_end)) {
    return { allowed: false, reason: "Din prenumeration har gått ut" };
  }
  
  const maxDeals = subscriptionInfo.plan_title === "Baspaket" ? 1 : 3;
  
  // Kontrollera om användaren redan har nått max antal erbjudanden
  if (activeDealsCount >= maxDeals) {
    return { 
      allowed: false, 
      reason: `Du har nått max antal erbjudanden (${maxDeals}) för din plan. Uppgradera för fler.` 
    };
  }
  
  // Om prenumerationen går ut snart, visa en varning men tillåt fortfarande användaren
  if (subscriptionInfo.current_period_end) {
    const expirationDate = new Date(subscriptionInfo.current_period_end);
    const daysUntilExpiration = Math.floor((expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration <= 7) {
      return { 
        allowed: true, 
        reason: `Din prenumeration går ut om ${daysUntilExpiration} dagar. Förnya för att undvika avbrott.` 
      };
    }
  }
  
  // Allt är OK
  return { allowed: true, reason: null };
};

/**
 * Kontrollerar om användaren har en Premium-prenumeration
 */
export const hasPremiumSubscription = (subscriptionInfo: SubscriptionInfo | null): boolean => {
  if (!subscriptionInfo) return false;
  
  return subscriptionInfo.plan_title === "Premiumpaket" && subscriptionInfo.status === "active";
};

/**
 * Beräknar hur många erbjudanden användaren kan skapa baserat på planen
 */
export const allowedDealCount = (subscriptionInfo: SubscriptionInfo | null): number => {
  if (!subscriptionInfo) return 0;
  if (subscriptionInfo.status !== "active") return 0;
  
  switch (subscriptionInfo.plan_title) {
    case "Baspaket":
      return 1;
    case "Premiumpaket":
      return 3;
    default:
      return 0;
  }
};

/**
 * Hämtar prisdetaljer för en prenumerationsplan
 */
export const getPlanDetails = (planTitle: string): PlanDetails => {
  const plan = SUBSCRIPTION_PLANS[planTitle] || SUBSCRIPTION_PLANS["Baspaket"];
  
  return {
    dealCount: plan.dealCount,
    allowsDiscountCodes: planTitle === "Premiumpaket",
    features: plan.features
  };
};

/**
 * Hämtar det aktuella priset för en prenumerationsplan baserat på typ (månadsvis/årsvis)
 */
export const getCurrentPrice = (planTitle: string, subscriptionType: string): number => {
  const plan = SUBSCRIPTION_PLANS[planTitle] || SUBSCRIPTION_PLANS["Baspaket"];
  
  return subscriptionType === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
};

/**
 * Konverterar prenumerationstyp till en läsbar etikett
 */
export const getSubscriptionTypeLabel = (subscriptionType: string): string => {
  return subscriptionType === "yearly" ? "Per år" : "Per månad";
};
