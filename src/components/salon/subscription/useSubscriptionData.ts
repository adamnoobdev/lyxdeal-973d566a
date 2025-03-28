
import { useState, useEffect } from "react";
import { SubscriptionInfo } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const useSubscriptionData = () => {
  const [loading, setLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return { subscriptionInfo, loading, error };
};
