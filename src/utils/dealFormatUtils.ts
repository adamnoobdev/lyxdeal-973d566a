
/**
 * Utility functions for formatting deal data
 */

import { calculateDaysRemaining } from "./deal/dealTimeUtils";
import { isDealFree } from "./deal/dealPriceUtils";
import { FormattedDealData, RawDealData } from "./deal/types";

/**
 * Formats a deal object with calculated properties
 */
export const formatDealData = (
  rawDeal: RawDealData, 
  salonData: { id: number | null; name: string; address: string | null; phone: string | null; rating?: number | null; } | null
): FormattedDealData => {
  console.log("[formatDealData] Börjar formatera erbjudandedata", { 
    dealId: rawDeal.id,
    salonId: rawDeal.salon_id,
    dealTitle: rawDeal.title,
    bookingUrl: rawDeal.booking_url,
    city: rawDeal.city,
    requiresDiscountCode: rawDeal.requires_discount_code
  });
  
  // Extra loggning för att spåra salongsdata-parametern
  console.log("[formatDealData] Inkommande salongsdata:", 
    salonData ? JSON.stringify(salonData) : "null");
  
  const daysRemaining = calculateDaysRemaining(rawDeal.expiration_date, rawDeal.time_remaining);
  const isFree = isDealFree(rawDeal.is_free, rawDeal.discounted_price);

  // Säkerställ att vi alltid har ett giltigt salon-objekt
  // Om salongsdata är null eller har ett tomt namn, använd city som fallback
  const fallbackSalonName = rawDeal.city 
    ? `Salong i ${rawDeal.city}` 
    : 'Okänd salong';
  
  // Använd nullish coalescing för att hantera både null och undefined
  const effectiveSalonData = salonData ?? {
    id: rawDeal.salon_id ?? null,
    name: fallbackSalonName,
    address: rawDeal.city ?? null,
    phone: null,
    rating: null
  };
  
  // Ytterligare säkerhetskontroll för tomma namn
  if (!effectiveSalonData.name || effectiveSalonData.name.trim() === '') {
    effectiveSalonData.name = fallbackSalonName;
  }
  
  console.log("[formatDealData] Slutgiltigt salongobjekt:", effectiveSalonData);

  const formattedDeal = {
    id: rawDeal.id,
    title: rawDeal.title,
    description: rawDeal.description,
    imageUrl: rawDeal.image_url,
    originalPrice: rawDeal.original_price,
    discountedPrice: rawDeal.discounted_price,
    daysRemaining,
    expirationDate: rawDeal.expiration_date || new Date().toISOString(),
    category: rawDeal.category,
    city: rawDeal.city,
    created_at: rawDeal.created_at,
    quantityLeft: rawDeal.quantity_left,
    isFree,
    salon: effectiveSalonData,
    booking_url: rawDeal.booking_url || null,
    requires_discount_code: rawDeal.requires_discount_code !== false,
    salon_rating: effectiveSalonData.rating || null
  };
  
  console.log("[formatDealData] Slutgiltigt formaterat erbjudande:", {
    id: formattedDeal.id,
    title: formattedDeal.title,
    city: formattedDeal.city,
    salon: formattedDeal.salon,
    salon_rating: formattedDeal.salon_rating,
    requiresDiscountCode: formattedDeal.requires_discount_code
  });
  
  return formattedDeal;
};
