
/**
 * Utility functions for formatting deal data
 */

import { calculateDaysRemaining } from "./dealTimeUtils";
import { isDealFree } from "./dealPriceUtils";
import { FormattedDealData, RawDealData } from "./types";

/**
 * Formats a deal object with calculated properties
 */
export const formatDealData = (
  rawDeal: RawDealData, 
  salonData: { id: number | null; name: string; address: string | null; phone: string | null; } | null
): FormattedDealData => {
  console.log("[formatDealData] Börjar formatera erbjudandedata", { 
    dealId: rawDeal.id,
    salonId: rawDeal.salon_id,
    dealTitle: rawDeal.title,
    bookingUrl: rawDeal.booking_url,
    city: rawDeal.city
  });
  console.log("[formatDealData] Salongsdata att använda:", salonData);
  
  const daysRemaining = calculateDaysRemaining(rawDeal.expiration_date, rawDeal.time_remaining);
  const isFree = isDealFree(rawDeal.is_free, rawDeal.discounted_price);

  // Säkerställ att vi alltid har ett salongsnamn, även om inget salongsdata finns
  const salonName = salonData?.name && salonData.name.trim() !== '' 
                   ? salonData.name 
                   : (rawDeal.city ? `Salong i ${rawDeal.city}` : 'Okänd salong');
  
  console.log("[formatDealData] Slutgiltigt salongsnamn:", salonName);
  
  // Skapa ett standard-salongobjekt om inget hittades
  const finalSalonData = salonData ? {
    ...salonData,
    name: salonName // Använd det säkra namnet
  } : {
    id: rawDeal.salon_id,
    name: salonName,
    address: rawDeal.city ? `${rawDeal.city}` : null,
    phone: null
  };

  console.log("[formatDealData] Slutgiltigt salongsobjekt:", finalSalonData);

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
    salon: finalSalonData,
    booking_url: rawDeal.booking_url || null
  };
  
  console.log("[formatDealData] Slutgiltigt formaterat erbjudande:", {
    id: formattedDeal.id,
    title: formattedDeal.title,
    city: formattedDeal.city,
    salon: formattedDeal.salon
  });
  
  return formattedDeal;
};
