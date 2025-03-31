
import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useSessionState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Clear any timers on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Set up auth state listener
  useEffect(() => {
    console.log("useSessionState hook initialized");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log(`Auth state changed: ${event}`, currentSession ? "Session exists" : "No session");
        
        if (isMountedRef.current) {
          // If we get a SIGNED_OUT event, ensure we clear the session
          if (event === 'SIGNED_OUT') {
            setSession(null);
          } else {
            setSession(currentSession);
          }
          
          setIsLoading(false);
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

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    isLoading,
    user: session?.user || null,
    setSession
  };
};
