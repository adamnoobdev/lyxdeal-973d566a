
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { SubscriptionInfo } from "./types";
import { formatDate, isPastDate } from "./utils";

interface SubscriptionAlertProps {
  subscriptionInfo: SubscriptionInfo;
}

export function SubscriptionAlert({ subscriptionInfo }: SubscriptionAlertProps) {
  // Kontrollera om prenumerationen har gått ut eller håller på att gå ut
  const isExpired = isPastDate(subscriptionInfo.current_period_end);
  const isExpiringWithin30Days = subscriptionInfo.status === "active" && 
    subscriptionInfo.current_period_end && 
    new Date(subscriptionInfo.current_period_end).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

  if (subscriptionInfo.status === "active" && !isExpired) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Aktiv prenumeration</AlertTitle>
        <AlertDescription className="text-green-700 text-sm">
          Din prenumeration är aktiv och alla funktioner är tillgängliga.
          {subscriptionInfo.current_period_end && (
            <div className="mt-1">
              <span className="font-medium">Förnyas/Avslutas:</span> {formatDate(subscriptionInfo.current_period_end)}
            </div>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (isExpiringWithin30Days && !isExpired) {
    return (
      <Alert variant="warning" className="bg-amber-50 border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Prenumeration går snart ut</AlertTitle>
        <AlertDescription className="text-amber-700 text-sm">
          Din prenumeration upphör snart den {formatDate(subscriptionInfo.current_period_end!)}. 
          För att undvika avbrott i tjänsten, vänligen förnya din prenumeration.
        </AlertDescription>
      </Alert>
    );
  }

  if (isExpired || subscriptionInfo.status !== "active") {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Inaktiv prenumeration</AlertTitle>
        <AlertDescription className="text-sm">
          Din prenumeration har gått ut eller är inaktiv. 
          {subscriptionInfo.current_period_end && (
            <span> Utgångsdatum: {formatDate(subscriptionInfo.current_period_end)}</span>
          )}
          <div className="mt-2">
            För att återaktivera alla funktioner, vänligen förnya din prenumeration.
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
