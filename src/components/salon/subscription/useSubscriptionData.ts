
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
        
        // Ensure we have actual data before trying to set subscription info
        if (salons) {
          setSubscriptionInfo({
            plan_title: salons.subscription_plan || 'Baspaket',
            subscription_type: salons.subscription_type || 'monthly',
            stripe_customer_id: salons.stripe_customer_id || '',
            stripe_subscription_id: salons.stripe_subscription_id || '',
            current_period_end: salons.current_period_end,
            current_period_start: null, // Since this column doesn't exist in the database yet
            status: salons.status || 'inactive',
            cancel_at_period_end: salons.cancel_at_period_end || false,
            // Map current_period_end to expirationDate for compatibility
            expirationDate: salons.current_period_end
          });
        } else {
          setError("Ingen salongsdata hittades");
        }
        
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
