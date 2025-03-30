
/**
 * Utility functions for deal price calculations
 */

/**
 * Determines if a deal is free
 */
export const isDealFree = (isFree: boolean | null | undefined, discountedPrice: number | null | undefined): boolean => {
  return !!isFree || discountedPrice === 0;
};

/**
 * Calculates discount percentage for a deal
 */
export const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number): number => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Formats a price in SEK currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0
  }).format(price);
};
