
import { useSubscriptionPolling } from "./useSubscriptionPolling";
import { useElapsedTime } from "./useElapsedTime";
import { SubscriptionDetailsHook } from "./types";

// Exportera typerna på ett sätt som stöds av TypeScript med isolatedModules
export type { PurchaseDetails, SalonAccount } from "./types";
export { formatDate } from "./formatUtils";

export const useSubscriptionDetails = (sessionId: string | null): SubscriptionDetailsHook => {
  // Använd de refaktorerade hooks för att få grundfunktionalitet
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
  
  // Lägg till timer för att spåra förfluten tid
  const timeElapsed = useElapsedTime();
  
  // Returnera alla nödvändiga värden och funktioner
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
