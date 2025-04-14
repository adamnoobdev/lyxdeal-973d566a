
import { SUBSCRIPTION_PLANS } from "./types";

export const SUBSCRIPTION_PLANS_ORIGINAL = {
  "Baspaket": {
    title: "Baspaket",
    description: "Grundläggande funktioner för din salong",
    features: [
      "Upp till 5 erbjudanden samtidigt",
      "Grundläggande statistik",
      "Kundhantering",
      "E-poststöd"
    ],
    limitDeals: 5,
    price: 299,
    yearly_price: 2990
  },
  "Premium": {
    title: "Premium",
    description: "Utökad funktionalitet för växande verksamheter",
    features: [
      "Upp till 15 erbjudanden samtidigt",
      "Utökad statistik och rapporter",
      "Prioriterat e-poststöd",
      "Reklamfri upplevelse"
    ],
    limitDeals: 15,
    price: 599,
    yearly_price: 5990
  },
  "Ultimate": {
    title: "Ultimate",
    description: "Allt för den seriösa salongsverksamheten",
    features: [
      "Obegränsat antal erbjudanden",
      "Avancerad statistik och insikter",
      "Prioriterat telefonsupport",
      "Kundundersökningsverktyg",
      "Reklamfri upplevelse"
    ],
    limitDeals: 999999, // Essentially unlimited
    price: 999,
    yearly_price: 9990
  }
};

/**
 * Kontrollera om ett datum har passerats
 * @param dateString Ett datumformat som kan tolkas av Date-konstruktorn
 * @returns true om datumet har passerats, annars false
 */
export const isPastDate = (dateString?: string | null): boolean => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    return date < now;
  } catch (error) {
    console.error("Error parsing date:", error);
    return false;
  }
};

/**
 * Kontrollera om en prenumeration är aktiv baserat på status och utgångsdatum
 * @param status Prenumerationsstatus
 * @param expirationDate Utgångsdatum för prenumerationen
 * @returns true om prenumerationen är aktiv, annars false
 */
export const isSubscriptionActive = (status?: string, expirationDate?: string | null): boolean => {
  // Prenumerationen måste ha status "active"
  if (status !== "active") return false;
  
  // Om det inte finns något utgångsdatum, anta att prenumerationen är aktiv
  if (!expirationDate) return true;
  
  // Kontrollera om utgångsdatumet har passerats
  return !isPastDate(expirationDate);
};

/**
 * Beräknar antal dagar kvar till ett specifikt datum
 * @param dateString Ett datumformat som kan tolkas av Date-konstruktorn
 * @returns Antal dagar kvar eller null om datumet inte kan tolkas
 */
export const daysUntil = (dateString?: string | null): number | null => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    // Om datumet redan har passerats, returnera 0
    if (date < now) return 0;
    
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.error("Error calculating days until:", error);
    return null;
  }
};

/**
 * Formatterar ett datum till svenskt format
 * @param date Datum att formatera
 * @returns Formaterat datum som sträng
 */
export const formatDate = (date: Date | string | null) => {
  if (!date) return "Okänt datum";
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('sv-SE');
};

/**
 * Kontrollerar om en salong kan skapa ett nytt erbjudande
 * @param subscriptionInfo Prenumerationsinformation
 * @param activeDealsCount Antal aktiva erbjudanden
 * @returns Objekt med allowed (boolean) och reason (string eller null)
 */
export const canCreateDeal = (subscriptionInfo: any, activeDealsCount: number) => {
  if (!subscriptionInfo || subscriptionInfo.status !== "active") {
    return { 
      allowed: false, 
      reason: "Du behöver en aktiv prenumeration för att skapa erbjudanden."
    };
  }

  const planDetails = getPlanDetails(subscriptionInfo.plan_title);
  
  if (activeDealsCount >= planDetails.dealCount) {
    return { 
      allowed: false, 
      reason: `Du har nått din gräns på ${planDetails.dealCount} erbjudanden med ditt ${subscriptionInfo.plan_title}. Uppgradera din prenumeration för att skapa fler erbjudanden.`
    };
  }

  if (activeDealsCount >= planDetails.dealCount - 1) {
    return { 
      allowed: true, 
      reason: `Varning: Detta är ditt sista tillgängliga erbjudande med ditt ${subscriptionInfo.plan_title}.`
    };
  }

  return { allowed: true, reason: null };
};

/**
 * Hämtar detaljerad information om en prenumerationsplan
 * @param planTitle Planens titel
 * @returns Plandetaljer
 */
export const getPlanDetails = (planTitle: string): PlanDetails => {
  // Default values if plan not found
  const defaultPlan = {
    dealCount: 1,
    allowsDiscountCodes: false,
    features: []
  };

  if (!planTitle) return defaultPlan;

  switch (planTitle) {
    case "Baspaket":
      return {
        dealCount: 1,
        allowsDiscountCodes: false,
        features: SUBSCRIPTION_PLANS["Baspaket"].features
      };
    case "Premiumpaket":
      return {
        dealCount: 3,
        allowsDiscountCodes: true,
        features: SUBSCRIPTION_PLANS["Premiumpaket"].features
      };
    default:
      return defaultPlan;
  }
};

/**
 * Hämtar aktuellt pris för en prenumerationsplan
 * @param planTitle Planens titel
 * @param subscriptionType Typ av prenumeration (monthly/yearly)
 * @returns Pris som nummer
 */
export const getCurrentPrice = (planTitle: string, subscriptionType: string): number => {
  const plan = SUBSCRIPTION_PLANS[planTitle];
  if (!plan) return 0;
  
  return subscriptionType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
};

/**
 * Returnerar en formaterad etikett för prenumerationstypen
 * @param subscriptionType Typ av prenumeration
 * @returns Formaterad etikett
 */
export const getSubscriptionTypeLabel = (subscriptionType: string): string => {
  switch (subscriptionType) {
    case 'yearly':
      return 'per år';
    case 'monthly':
      return 'per månad';
    default:
      return 'per månad';
  }
};

// Interface declaration for PlanDetails to avoid TypeScript errors
interface PlanDetails {
  dealCount: number;
  allowsDiscountCodes: boolean;
  features: string[];
}
