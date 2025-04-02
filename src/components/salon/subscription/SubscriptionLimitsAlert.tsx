
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoCircle, AlertTriangle } from "lucide-react";
import { SubscriptionInfo } from "./types";
import { canCreateDeal } from "./utils";

interface SubscriptionLimitsAlertProps {
  subscriptionInfo: SubscriptionInfo | null;
  activeDealsCount: number;
}

export const SubscriptionLimitsAlert = ({ 
  subscriptionInfo, 
  activeDealsCount 
}: SubscriptionLimitsAlertProps) => {
  if (!subscriptionInfo) return null;
  
  const { allowed, reason } = canCreateDeal(subscriptionInfo, activeDealsCount);
  
  // If allowed with no warnings, show the standard limits info
  if (allowed && !reason) {
    const isBasic = subscriptionInfo.plan_title === "Baspaket";
    const maxDeals = isBasic ? 1 : 3;
    const remainingDeals = maxDeals - activeDealsCount;
    
    return (
      <Alert variant="default" className="bg-blue-50 border-blue-200 shadow-sm">
        <InfoCircle className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-800 text-base font-medium mb-1">
          Prenumerationsinformation
        </AlertTitle>
        <AlertDescription className="text-blue-700 text-sm">
          <p>
            Du har paketet <strong className="font-medium">{subscriptionInfo.plan_title}</strong> med {' '}
            {subscriptionInfo.subscription_type === 'yearly' ? 'årsbetalning' : 'månadsbetalning'}.
          </p>
          <p className="mt-1">
            Du har använt {activeDealsCount} av {maxDeals} tillgängliga erbjudanden 
            ({remainingDeals} återstår).
          </p>
          {isBasic && (
            <p className="mt-1">
              <strong>OBS:</strong> Med Baspaket kan du endast använda direkt bokning, inte rabattkoder.
            </p>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  // If allowed but with a warning, show warning
  if (allowed && reason) {
    return (
      <Alert variant="warning" className="bg-amber-50 border-amber-200 shadow-sm">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800 text-base font-medium mb-1">
          Viktig information
        </AlertTitle>
        <AlertDescription className="text-amber-700 text-sm">
          {reason}
        </AlertDescription>
      </Alert>
    );
  }
  
  // If not allowed, show error
  return (
    <Alert variant="destructive" className="bg-red-50 border-red-200 shadow-sm">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <AlertTitle className="text-red-800 text-base font-medium mb-1">
        Begränsning
      </AlertTitle>
      <AlertDescription className="text-red-700 text-sm">
        {reason}
      </AlertDescription>
    </Alert>
  );
};
