
import { useSubscriptionPolling } from "./useSubscriptionPolling";
import { useElapsedTime } from "./useElapsedTime";
import { SubscriptionDetailsHook } from "./types";

// Export types in a way that's supported by TypeScript with isolatedModules
export type { PurchaseDetails, SalonAccount } from "./types";
export { formatDate } from "./formatUtils";

export const useSubscriptionDetails = (sessionId: string | null): SubscriptionDetailsHook => {
  // Use the refactored hooks to get core functionality
  const {
    purchaseDetails,
    salonAccount,
    loading,
    error,
    retryCount,
    isRetrying,
    manualRetry
  } = useSubscriptionPolling({
    sessionId,
    maxRetries: 20,
    retryDelay: 3000
  });
  
  // Add timer to track elapsed time
  const timeElapsed = useElapsedTime();
  
  // Return all necessary values and functions
  return {
    purchaseDetails,
    salonAccount,
    loading,
    error,
    retryCount,
    isRetrying,
    timeElapsed,
    manualRetry,
    maxRetries: 20
  };
};
