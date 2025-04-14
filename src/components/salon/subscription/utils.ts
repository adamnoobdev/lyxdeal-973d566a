
import { SubscriptionInfo } from "./types";
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
 * Kontrollerar om en användare kan skapa erbjudanden baserat på prenumerationsstatus
 */
export const canCreateDeal = (subscriptionInfo: SubscriptionInfo | null): boolean => {
  if (!subscriptionInfo) return false;
  
  // Om prenumerationen är aktiv och inte har gått ut
  return subscriptionInfo.status === "active" && !isPastDate(subscriptionInfo.current_period_end);
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
