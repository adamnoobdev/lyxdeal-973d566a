
/**
 * Utility functions for deal time calculations
 */

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
