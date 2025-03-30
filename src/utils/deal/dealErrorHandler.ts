
/**
 * Handlers for deal-related errors
 */

import { toast } from "sonner";

/**
 * Handles errors in the deal fetching process
 */
export const handleDealError = (error: unknown): void => {
  console.error("Error in deal fetching:", error);
  
  if (error instanceof Error) {
    const errorMap: Record<string, string> = {
      'No deal ID provided': "Inget erbjudande-ID angivet",
      'Invalid deal ID': "Ogiltigt erbjudande-ID",
      'Deal not found': "Erbjudandet kunde inte hittas"
    };
    
    toast.error(errorMap[error.message] || "Ett fel uppstod");
  } else {
    toast.error("Ett oväntat fel uppstod");
  }
};
