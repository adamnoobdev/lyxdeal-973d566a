
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
      <Alert variant="warning" className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Prenumerationen avslutas</AlertTitle>
        <AlertDescription className="text-amber-700">
          Din prenumeration är uppsagd och kommer att avslutas den {formatDate(subscriptionInfo.current_period_end)}.
          Du kan fortsätta använda alla funktioner till detta datum.
        </AlertDescription>
      </Alert>
    );
  }

  // Alert for active subscription
  return (
    <Alert variant="default" className="bg-green-50 border-green-200">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Aktiv prenumeration</AlertTitle>
      <AlertDescription className="text-green-700">
        <p>
          Du har paketet <strong>{subscriptionInfo.plan_title}</strong> med {' '}
          {subscriptionInfo.subscription_type === 'yearly' ? 'årsbetalning' : 'månadsbetalning'}.
        </p>
        <p className="mt-1">
          Detta ger dig tillgång till {planDetails.dealCount} {planDetails.dealCount === 1 ? 'erbjudande' : 'erbjudanden'} åt gången.
        </p>
      </AlertDescription>
    </Alert>
  );
};
