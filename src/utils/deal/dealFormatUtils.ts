
/**
 * Utility functions for formatting deal data
 */

import { calculateDaysRemaining } from "./dealTimeUtils";
import { isDealFree } from "./dealPriceUtils";
import { FormattedDealData, RawDealData } from "./dealTypes";

/**
 * Formats a deal object with calculated properties
 */
export const formatDealData = (
  rawDeal: RawDealData, 
  salonData: { id: number | null; name: string; address: string | null; phone: string | null; }
): FormattedDealData => {
  console.log("Formatting deal data:", { 
    dealId: rawDeal.id,
    salonId: rawDeal.salon_id,
    dealTitle: rawDeal.title
  });
  console.log("Salon data for formatting:", salonData);
  
  const daysRemaining = calculateDaysRemaining(rawDeal.expiration_date, rawDeal.time_remaining);
  const isFree = isDealFree(rawDeal.is_free, rawDeal.discounted_price);

  // Säkerställ att vi alltid har ett salongsnamn
  const salonName = salonData?.name || 
                   (rawDeal.city ? `Salong i ${rawDeal.city}` : 'Okänd salong');
  
  console.log("Final salon name to use:", salonName);

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
    salon: {
      ...salonData,
      name: salonName
    },
    booking_url: rawDeal.booking_url,
  };
  
  console.log("Formatted deal data:", formattedDeal);
  return formattedDeal;
};
