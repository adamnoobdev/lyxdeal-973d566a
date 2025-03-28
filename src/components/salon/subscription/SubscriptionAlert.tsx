
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatDate } from "./utils";
import { SubscriptionInfo } from "./types";

interface SubscriptionAlertProps {
  subscriptionInfo: SubscriptionInfo;
}

export const SubscriptionAlert = ({ subscriptionInfo }: SubscriptionAlertProps) => {
  if (!subscriptionInfo.cancel_at_period_end) {
    return null;
  }
  
  return (
    <Alert variant="warning" className="bg-amber-50 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-700">
        Din prenumeration är uppsagd och kommer att avslutas {formatDate(subscriptionInfo.current_period_end)}.
      </AlertDescription>
    </Alert>
  );
};
