
export const SUBSCRIPTION_PLANS = {
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
