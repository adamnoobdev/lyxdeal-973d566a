
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CreditCard, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useState as useLoadingState } from "react";

interface SubscriptionInfo {
  plan_title: string;
  subscription_type: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_end: string | null;
  status: string;
  cancel_at_period_end: boolean;
}

export function ManageSubscription() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReactivating, setIsReactivating] = useLoadingState(false);
  const [isCancelling, setIsCancelling] = useLoadingState(false);
  const [isManagingBilling, setIsManagingBilling] = useLoadingState(false);

  // Hämta användarens prenumerationsinformation
  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setError("Du måste vara inloggad för att se din prenumeration");
          setLoading(false);
          return;
        }
        
        // Hämta salongsdata inklusive prenumerationsinformation
        const { data: salons, error: salonError } = await supabase
          .from("salons")
          .select("subscription_plan, subscription_type, stripe_customer_id, stripe_subscription_id, current_period_end, status, cancel_at_period_end")
          .eq("user_id", session.user.id)
          .single();
        
        if (salonError) {
          console.error("Fel vid hämtning av salongsdata:", salonError);
          setError("Kunde inte hämta prenumerationsinformation");
          setLoading(false);
          return;
        }
        
        setSubscriptionInfo({
          plan_title: salons.subscription_plan || 'Standard',
          subscription_type: salons.subscription_type || 'monthly',
          stripe_customer_id: salons.stripe_customer_id || '',
          stripe_subscription_id: salons.stripe_subscription_id || '',
          current_period_end: salons.current_period_end,
          status: salons.status || 'inactive',
          cancel_at_period_end: salons.cancel_at_period_end || false
        });
        
      } catch (err) {
        console.error("Fel vid hämtning av prenumerationsinformation:", err);
        setError("Ett fel uppstod när prenumerationsinformation skulle hämtas");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionInfo();
  }, []);

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
      setSubscriptionInfo({
        ...subscriptionInfo,
        cancel_at_period_end: true
      });
      
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
      setSubscriptionInfo({
        ...subscriptionInfo,
        cancel_at_period_end: false
      });
      
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

  // Formatera datum för visning
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Okänt datum";
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE');
  };

  // Visa laddningsskelett medan data hämtas
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Visa felmeddelande om något gick fel
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hantera prenumeration</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Visa meddelande om ingen prenumeration hittades
  if (!subscriptionInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hantera prenumeration</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Ingen aktiv prenumeration hittades.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Renderera prenumerationsuppgifter och knappar för hantering
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Din prenumeration</span>
          <Badge 
            variant={subscriptionInfo.status === "active" ? "default" : "destructive"}
            className="ml-2"
          >
            {subscriptionInfo.status === "active" ? "Aktiv" : "Inaktiv"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {subscriptionInfo.cancel_at_period_end && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Din prenumeration är uppsagd och kommer att avslutas {formatDate(subscriptionInfo.current_period_end)}.
            </AlertDescription>
          </Alert>
        )}
        
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
        
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button 
            onClick={handleManageBilling}
            variant="outline"
            className="flex-1"
            disabled={isManagingBilling}
          >
            {isManagingBilling ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Laddar...
              </span>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Hantera fakturor
              </>
            )}
          </Button>
          
          {subscriptionInfo.cancel_at_period_end ? (
            <Button 
              onClick={handleReactivateSubscription}
              className="flex-1"
              disabled={isReactivating}
            >
              {isReactivating ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Laddar...
                </span>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Återaktivera prenumeration
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleCancelSubscription}
              variant="destructive"
              className="flex-1"
              disabled={isCancelling}
            >
              {isCancelling ? (
                <span className="flex items-center">
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Laddar...
                </span>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Avsluta prenumeration
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
