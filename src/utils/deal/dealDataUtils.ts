
/**
 * Calculates days remaining until expiration
 */
export const calculateDaysRemaining = (
  expirationDate: string | null | undefined, 
  timeRemaining: string | null | undefined
): number => {
  // If no expiration date, parse days from time_remaining or default to 30
  if (!expirationDate) {
    if (timeRemaining && timeRemaining.includes("dag")) {
      const daysText = timeRemaining.split(" ")[0];
      return parseInt(daysText) || 30;
    }
    return 30;
  }
  
  const expDate = new Date(expirationDate);
  const now = new Date();
  
  // Set both dates to midnight to avoid time differences
  expDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = expDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

/**
 * Determines if a deal is free
 */
export const isDealFree = (isFree: boolean | null | undefined, discountedPrice: number | null | undefined): boolean => {
  return !!isFree || discountedPrice === 0;
};

/**
 * Formats a deal object with calculated properties
 */
export interface RawDealData {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  expiration_date?: string | null;
  time_remaining?: string;
  category: string;
  city: string;
  created_at: string;
  quantity_left: number;
  is_free?: boolean | null;
  salon_id?: number | null;
  booking_url?: string | null;
}

export interface FormattedDealData {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  daysRemaining: number;
  expirationDate: string;
  category: string;
  city: string;
  created_at: string;
  quantityLeft: number;
  isFree: boolean;
  salon: {
    id: number | null;
    name: string;
    address: string | null;
    phone: string | null;
  };
  booking_url?: string;
}

export const formatDealData = (
  rawDeal: RawDealData, 
  salonData: { id: number | null; name: string; address: string | null; phone: string | null; }
): FormattedDealData => {
  const daysRemaining = calculateDaysRemaining(rawDeal.expiration_date, rawDeal.time_remaining);
  const isFree = isDealFree(rawDeal.is_free, rawDeal.discounted_price);

  return {
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
    salon: salonData,
    booking_url: rawDeal.booking_url,
  };
};
