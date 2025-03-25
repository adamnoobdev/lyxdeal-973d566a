
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useSession hook initialized or dependencies changed");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`Auth state changed: ${event}`, currentSession ? "Session exists" : "No session");
        setSession(currentSession);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    const initSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session initialization error:", error);
        } else {
          console.log("Session check complete:", data.session ? "Session found" : "No session found");
          setSession(data.session);
        }
      } catch (error) {
        console.error("Session initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    isLoading,
    user: session?.user || null
  };
};
