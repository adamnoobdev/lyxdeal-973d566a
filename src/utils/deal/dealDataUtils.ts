
/**
 * Main export file for deal data utilities
 */

// Re-export everything from the utility files
export { calculateDaysRemaining } from "./dealTimeUtils";
export { isDealFree, calculateDiscountPercentage, formatPrice } from "./dealPriceUtils";
export { formatDealData } from "./dealFormatUtils";
export type { RawDealData, FormattedDealData } from "./dealTypes";
