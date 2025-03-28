
import { SubscriptionInfo } from "./types";
import { formatDate } from "./utils";
import { Calendar, CheckCircle, XCircle, CreditCard } from "lucide-react";

interface SubscriptionMetadataProps {
  subscriptionInfo: SubscriptionInfo;
}

export const SubscriptionMetadata = ({ subscriptionInfo }: SubscriptionMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          Plan
        </p>
        <p className="font-medium">{subscriptionInfo.plan_title || "Standard"}</p>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Fakturaperiod
        </p>
        <p className="font-medium">
          {subscriptionInfo.subscription_type === "yearly" ? "Årsvis" : "Månadsvis"}
        </p>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Nästa fakturadatum
        </p>
        <p className="font-medium">
          {formatDate(subscriptionInfo.current_period_end)}
        </p>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground flex items-center">
          {subscriptionInfo.cancel_at_period_end ? (
            <XCircle className="mr-2 h-4 w-4 text-destructive" />
          ) : (
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          )}
          Förnyas automatiskt
        </p>
        <p className="font-medium">
          {subscriptionInfo.cancel_at_period_end ? "Nej" : "Ja"}
        </p>
      </div>
    </div>
  );
};
