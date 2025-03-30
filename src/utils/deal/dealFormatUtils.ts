
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
  console.log(`💡 Formatting deal data for ID: ${rawDeal.id} - Salon ID: ${rawDeal.salon_id}`);
  console.log("💡 Deal data for formatting:", { 
    dealId: rawDeal.id,
    salonId: rawDeal.salon_id,
    dealTitle: rawDeal.title
  });
  console.log("💡 Salon data for formatting:", salonData);
  
  const daysRemaining = calculateDaysRemaining(rawDeal.expiration_date, rawDeal.time_remaining);
  const isFree = isDealFree(rawDeal.is_free, rawDeal.discounted_price);

  // Special case for hardcoded salon data - expanded for more deals if needed
  const hardcodedSalons: Record<number, { name: string, address: string | null }> = {
    38: { name: "Belle Hair Studio", address: "Stockholm centrum" },
    // Add more special cases as needed
  };
  
  // Check if this deal has hardcoded salon data
  const hardcodedSalon = hardcodedSalons[rawDeal.id];
  if (hardcodedSalon) {
    console.log(`💡 Using hardcoded salon data for deal ID ${rawDeal.id}:`, hardcodedSalon);
    
    // Merge hardcoded data with any existing salon data
    const enhancedSalonData = {
      id: salonData?.id || null,
      name: hardcodedSalon.name,
      address: hardcodedSalon.address || salonData?.address,
      phone: salonData?.phone || null
    };
    
    console.log("💡 Enhanced salon data:", enhancedSalonData);
    
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
      salon: enhancedSalonData,
      booking_url: rawDeal.booking_url,
    };
    
    console.log(`💡 Formatted deal data for ID ${rawDeal.id}:`, formattedDeal);
    return formattedDeal;
  }

  // Regular case - ensure we have valid salon data with proper fallbacks
  // Prefer actual salon name if available, fallback to city-based name
  const normalizedSalonData = {
    id: salonData?.id || null,
    name: salonData?.name || (rawDeal.city ? `Salong i ${rawDeal.city}` : 'Okänd salong'),
    address: salonData?.address || (rawDeal.city ? `${rawDeal.city} centrum` : null),
    phone: salonData?.phone || null
  };
  
  console.log("💡 Normalized salon data:", normalizedSalonData);

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
    salon: normalizedSalonData,
    booking_url: rawDeal.booking_url,
  };
  
  console.log("💡 Formatted deal data final:", formattedDeal);
  return formattedDeal;
};
