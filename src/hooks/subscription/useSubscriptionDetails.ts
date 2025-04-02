
import { useElapsedTime } from "./useElapsedTime";
import { useSubscriptionPolling } from "./useSubscriptionPolling";
import { formatDate } from "./formatUtils";
import { SubscriptionDetailsHook } from "./types";

export const useSubscriptionDetails = (sessionId: string | null): SubscriptionDetailsHook => {
  const timeElapsed = useElapsedTime();
  
  const {
    purchaseDetails,
    salonAccount,
    loading,
    error,
    retryCount,
    isRetrying,
    manualRetry,
    maxRetries
  } = useSubscriptionPolling({ 
    sessionId,
    initialLoading: true,
    maxRetries: 20,
    retryDelay: 3000
  });

  return {
    purchaseDetails,
    salonAccount,
    loading,
    error,
    retryCount,
    isRetrying,
    timeElapsed,
    manualRetry,
    maxRetries
  };
};

// Export formatDate from the hook for backwards compatibility
export { formatDate };
