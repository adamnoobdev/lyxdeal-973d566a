
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubscriptionInfo } from "./types";
import { formatDate, getPlanDetails } from "./utils";
import { AlertCircle, CheckCircle } from "lucide-react";

interface SubscriptionAlertProps {
  subscriptionInfo: SubscriptionInfo;
}

export const SubscriptionAlert = ({ subscriptionInfo }: SubscriptionAlertProps) => {
  const planDetails = getPlanDetails(subscriptionInfo.plan_title);
  
  // Alert for expiring subscription
  if (subscriptionInfo.cancel_at_period_end) {
    return (
      <Alert variant="warning" className="bg-amber-50 border-amber-200 shadow-sm">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800 text-base font-medium mb-1">Prenumerationen avslutas</AlertTitle>
        <AlertDescription className="text-amber-700 text-sm">
          Din prenumeration är uppsagd och kommer att avslutas den {formatDate(subscriptionInfo.current_period_end)}.
          Du kan fortsätta använda alla funktioner till detta datum.
        </AlertDescription>
      </Alert>
    );
  }

  // Alert for active subscription
  return (
    <Alert variant="default" className="bg-green-50 border-green-200 shadow-sm">
      <CheckCircle className="h-5 w-5 text-green-600" />
      <AlertTitle className="text-green-800 text-base font-medium mb-1">Aktiv prenumeration</AlertTitle>
      <AlertDescription className="text-green-700 text-sm">
        <p>
          Du har paketet <strong className="font-medium">{subscriptionInfo.plan_title}</strong> med {' '}
          {subscriptionInfo.subscription_type === 'yearly' ? 'årsbetalning' : 'månadsbetalning'}.
        </p>
        <p className="mt-1">
          Detta ger dig tillgång till {planDetails.dealCount} {planDetails.dealCount === 1 ? 'erbjudande' : 'erbjudanden'} åt gången.
        </p>
      </AlertDescription>
    </Alert>
  );
};
