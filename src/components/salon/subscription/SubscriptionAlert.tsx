
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clock } from "lucide-react";
import { SubscriptionInfo } from "./types";
import { formatDate } from "./utils";

interface SubscriptionAlertProps {
  subscriptionInfo: SubscriptionInfo;
}

export const SubscriptionAlert = ({ subscriptionInfo }: SubscriptionAlertProps) => {
  if (subscriptionInfo.cancel_at_period_end) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Prenumeration avslutas</AlertTitle>
        <AlertDescription className="flex items-center mt-2">
          <Clock className="h-4 w-4 mr-2" />
          <span>
            Din prenumeration är uppsagd och kommer att avslutas {formatDate(subscriptionInfo.current_period_end)}.
            Efter detta datum kommer du inte längre att kunna skapa nya erbjudanden.
          </span>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
