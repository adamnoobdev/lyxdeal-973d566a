
import { useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useTokenRefresh = (session: Session | null, setSession: (session: Session | null) => void) => {
  const refreshTimerRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  // Clear any timers on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Refresh token helper function
  const scheduleRefresh = (expiresIn: number) => {
    // Clear any existing timers
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    // Schedule refresh 5 minutes before expiry
    const refreshTime = Math.max(expiresIn - 5 * 60 * 1000, 10000);
    
    refreshTimerRef.current = window.setTimeout(async () => {
      try {
        console.log("Auto-refreshing authentication token...");
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error("Token refresh error:", error);
          if (isMountedRef.current) {
            setSession(null);
          }
          return;
        }

        if (data.session && isMountedRef.current) {
          console.log("Token refreshed successfully");
          setSession(data.session);
          // Schedule next refresh
          const newExpiresIn = new Date(data.session.expires_at || 0).getTime() - Date.now();
          scheduleRefresh(newExpiresIn);
        }
      } catch (error) {
        console.error("Unexpected error during token refresh:", error);
      }
    }, refreshTime);

    console.log(`Token refresh scheduled in ${(refreshTime / 1000 / 60).toFixed(1)} minutes`);
  };

  // Set up token refresh
  useEffect(() => {
    if (session) {
      const expiresAt = new Date(session.expires_at || 0).getTime();
      const expiresIn = expiresAt - Date.now();
      
      // Only set up refresh if token expires in the future
      if (expiresIn > 0) {
        scheduleRefresh(expiresIn);
      }
    }
  }, [session, setSession]);

  return {
    refreshTimerRef
  };
};
