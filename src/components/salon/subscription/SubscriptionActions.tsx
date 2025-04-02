
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { XCircle, CreditCard } from "lucide-react";
import { SubscriptionInfo } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-button";

interface SubscriptionActionsProps {
  subscriptionInfo: SubscriptionInfo;
  onSubscriptionUpdate: (updated: Partial<SubscriptionInfo>) => void;
}

export function SubscriptionActions({
  subscriptionInfo,
  onSubscriptionUpdate,
}: SubscriptionActionsProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCreatingPortal, setIsCreatingPortal] = useState(false);

  // Open Stripe billing portal
  const handleOpenBillingPortal = async () => {
    setIsCreatingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-billing-portal-session",
        {
          body: {
            customer_id: subscriptionInfo.stripe_customer_id,
            return_url: window.location.href,
          },
        }
      );

      if (error) {
        console.error("Error creating portal session:", error);
        toast.error("Kunde inte öppna betalningsportalen");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error opening billing portal:", err);
      toast.error("Kunde inte öppna betalningsportalen");
    } finally {
      setIsCreatingPortal(false);
    }
  };

  // Cancel subscription at period end
  const handleCancelSubscription = async () => {
    if (!subscriptionInfo.stripe_subscription_id) {
      toast.error("Ingen prenumeration att avsluta");
      return;
    }

    setIsCancelling(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "cancel-subscription",
        {
          body: {
            subscription_id: subscriptionInfo.stripe_subscription_id,
          },
        }
      );

      if (error) {
        console.error("Error cancelling subscription:", error);
        toast.error("Kunde inte avsluta prenumerationen");
        return;
      }

      toast.success("Prenumerationen kommer att avslutas vid nuvarande periods slut");
      onSubscriptionUpdate({ cancel_at_period_end: true });
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      toast.error("Kunde inte avsluta prenumerationen");
    } finally {
      setIsCancelling(false);
    }
  };

  // Render different actions based on subscription status
  return (
    <>
      <LoadingButton
        variant="outline"
        onClick={handleOpenBillingPortal}
        loading={isCreatingPortal}
        className="w-full"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Hantera fakturor
      </LoadingButton>

      {!subscriptionInfo.cancel_at_period_end && (
        <LoadingButton
          variant="destructive"
          onClick={handleCancelSubscription}
          loading={isCancelling}
          className="w-full"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Avsluta prenumeration
        </LoadingButton>
      )}
    </>
  );
}
