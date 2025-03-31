
import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    console.log("useSession hook initialized or dependencies changed");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`Auth state changed: ${event}`, currentSession ? "Session exists" : "No session");
        
        if (isMountedRef.current) {
          // Om vi får en SIGNED_OUT händelse, säkerställ att vi rensar sessionen
          if (event === 'SIGNED_OUT') {
            setSession(null);
          } else {
            setSession(currentSession);
          }
          
          setIsLoading(false);
          
          // If we have a session, set up token refresh
          if (currentSession) {
            const expiresAt = new Date(currentSession.expires_at || 0).getTime();
            const expiresIn = expiresAt - Date.now();
            
            // Only set up refresh if token expires in the future
            if (expiresIn > 0) {
              scheduleRefresh(expiresIn);
            }
          }
        }
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session initialization error:", error);
          if (isMountedRef.current) {
            setSession(null);
          }
        } else {
          console.log("Session check complete:", data.session ? "Session found" : "No session found");
          
          if (isMountedRef.current) {
            setSession(data.session);
            
            // If we have a session, set up token refresh
            if (data.session) {
              const expiresAt = new Date(data.session.expires_at || 0).getTime();
              const expiresIn = expiresAt - Date.now();
              
              // Only set up refresh if token expires in the future
              if (expiresIn > 0) {
                scheduleRefresh(expiresIn);
              }
            }
          }
        }
      } catch (error) {
        console.error("Session initialization error:", error);
        if (isMountedRef.current) {
          setSession(null);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    // Cleanup subscription and any timers
    return () => {
      subscription.unsubscribe();
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Helper for signing out securely
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Det gick inte att logga ut. Försök igen.");
        return false;
      }
      // Clear any refresh timers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // Explicit reset av session för att säkerställa att UI uppdateras korrekt
      if (isMountedRef.current) {
        setSession(null);
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("Ett oväntat fel uppstod vid utloggning.");
      return false;
    }
  };

  return {
    session,
    isLoading,
    user: session?.user || null,
    signOut
  };
};
