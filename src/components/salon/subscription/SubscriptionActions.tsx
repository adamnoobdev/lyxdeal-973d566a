
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import { SubscriptionInfo } from "./types";

interface SubscriptionActionsProps {
  subscriptionInfo: SubscriptionInfo;
  onSubscriptionUpdate: (updated: Partial<SubscriptionInfo>) => void;
}

export const SubscriptionActions = ({ 
  subscriptionInfo, 
  onSubscriptionUpdate 
}: SubscriptionActionsProps) => {
  const { toast } = useToast();
  const [isReactivating, setIsReactivating] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isManagingBilling, setIsManagingBilling] = useState(false);

  // Hantera avslut av prenumeration
  const handleCancelSubscription = async () => {
    if (!subscriptionInfo?.stripe_subscription_id) {
      toast({
        title: "Fel",
        description: "Kunde inte hitta prenumerationsinformation",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCancelling(true);
      
      // Anropa en edge-funktion för att avsluta prenumerationen
      const { data, error } = await supabase.functions.invoke("cancel-subscription", {
        body: {
          subscription_id: subscriptionInfo.stripe_subscription_id
        }
      });
      
      if (error) {
        throw new Error(error.message || "Kunde inte avsluta prenumerationen");
      }
      
      // Uppdatera prenumerationsstatus lokalt
      onSubscriptionUpdate({ cancel_at_period_end: true });
      
      toast({
        title: "Prenumeration uppsagd",
        description: "Din prenumeration kommer att avslutas vid nästa betalningsperiod",
        variant: "default"
      });
      
    } catch (err) {
      console.error("Fel vid avslut av prenumeration:", err);
      toast({
        title: "Fel vid avslut",
        description: err instanceof Error ? err.message : "Ett fel uppstod när prenumerationen skulle avslutas",
        variant: "destructive"
      });
    } finally {
      setIsCancelling(false);
    }
  };

  // Hantera återaktivering av prenumeration
  const handleReactivateSubscription = async () => {
    if (!subscriptionInfo?.stripe_subscription_id) {
      toast({
        title: "Fel",
        description: "Kunde inte hitta prenumerationsinformation",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsReactivating(true);
      
      // Anropa en edge-funktion för att återaktivera prenumerationen
      const { data, error } = await supabase.functions.invoke("reactivate-subscription", {
        body: {
          subscription_id: subscriptionInfo.stripe_subscription_id
        }
      });
      
      if (error) {
        throw new Error(error.message || "Kunde inte återaktivera prenumerationen");
      }
      
      // Uppdatera prenumerationsstatus lokalt
      onSubscriptionUpdate({ cancel_at_period_end: false });
      
      toast({
        title: "Prenumeration återaktiverad",
        description: "Din prenumeration kommer att fortsätta vid nästa betalningsperiod",
        variant: "default"
      });
      
    } catch (err) {
      console.error("Fel vid återaktivering av prenumeration:", err);
      toast({
        title: "Fel vid återaktivering",
        description: err instanceof Error ? err.message : "Ett fel uppstod när prenumerationen skulle återaktiveras",
        variant: "destructive"
      });
    } finally {
      setIsReactivating(false);
    }
  };

  // Öppna kundportalen för att hantera fakturor
  const handleManageBilling = async () => {
    if (!subscriptionInfo?.stripe_customer_id) {
      toast({
        title: "Fel",
        description: "Kunde inte hitta kundinformation",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsManagingBilling(true);
      
      // Anropa en edge-funktion för att skapa en session till Stripe kundportal
      const { data, error } = await supabase.functions.invoke("create-billing-portal-session", {
        body: {
          customer_id: subscriptionInfo.stripe_customer_id
        }
      });
      
      if (error) {
        throw new Error(error.message || "Kunde inte öppna fakturahantering");
      }
      
      // Omdirigera till Stripe kundportal
      window.location.href = data.url;
      
    } catch (err) {
      console.error("Fel vid öppning av fakturahantering:", err);
      toast({
        title: "Fel",
        description: err instanceof Error ? err.message : "Ett fel uppstod när fakturahanteringen skulle öppnas",
        variant: "destructive"
      });
    } finally {
      setIsManagingBilling(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 pt-4">
      <LoadingButton 
        onClick={handleManageBilling}
        variant="outline"
        className="flex-1"
        loading={isManagingBilling}
        disabled={isManagingBilling}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Hantera fakturor
      </LoadingButton>
      
      {subscriptionInfo.cancel_at_period_end ? (
        <LoadingButton 
          onClick={handleReactivateSubscription}
          className="flex-1"
          loading={isReactivating}
          disabled={isReactivating}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Återaktivera prenumeration
        </LoadingButton>
      ) : (
        <LoadingButton 
          onClick={handleCancelSubscription}
          variant="destructive"
          className="flex-1"
          loading={isCancelling}
          disabled={isCancelling}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Avsluta prenumeration
        </LoadingButton>
      )}
    </div>
  );
};
