
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEnvironmentDetection } from "./useEnvironmentDetection";

export const useSignOut = (refreshTimerRef: React.MutableRefObject<number | null>) => {
  const { isSandboxEnvironment } = useEnvironmentDetection();
  
  // Helper for forcing a sign out without API call
  const forceSignOut = async () => {
    try {
      console.log("Executing aggressive force sign-out procedure");
      
      // Clear any refresh timers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // Aggressive storage clearing - be thorough
      try {
        // Clear all potentially auth-related items
        for (const key of Object.keys(localStorage)) {
          if (key.includes('supabase') || key.includes('auth') || key.includes('session')) {
            console.log(`Clearing localStorage item: ${key}`);
            localStorage.removeItem(key);
          }
        }
        
        for (const key of Object.keys(sessionStorage)) {
          if (key.includes('supabase') || key.includes('auth') || key.includes('session')) {
            console.log(`Clearing sessionStorage item: ${key}`);
            sessionStorage.removeItem(key);
          }
        }
        
        // Explicitly clear the main auth token
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.removeItem('supabase.auth.token');
      } catch (storageErr) {
        console.error("Error clearing storage during force sign-out:", storageErr);
      }
      
      // Force client to clear its state - with additional error handling
      try {
        await supabase.auth.signOut({ scope: 'global' }); // Try global scope first
      } catch (e) {
        console.log("Error during global signOut, trying local:", e);
        try {
          await supabase.auth.signOut({ scope: 'local' });
        } catch (e2) {
          console.log("Error during local signOut as well, continuing:", e2);
        }
      }
      
      console.log("Force sign-out completed");
      return true;
    } catch (err) {
      console.error("Error during force sign-out:", err);
      return false;
    }
  };

  // Helper for signing out securely - with improved sandbox handling
  const signOut = async () => {
    try {
      console.log("Starting signOut process");
      
      // Always check for sandbox environment first and apply special handling
      if (isSandboxEnvironment()) {
        console.log("Sandbox environment detected, using aggressive logout handling");
        // In sandbox, always force clear the session immediately
        const success = await forceSignOut();
        
        if (success) {
          toast.success("Du har loggat ut");
          return true;
        } else {
          // Even if force signout fails, we'll return true to continue the UI flow
          console.log("Force signout had issues but continuing logout flow");
          return true;
        }
      }
      
      // Standard logout flow for production
      console.log("Running standard logout flow");
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Sign out API error:", error);
        toast.error("Problem vid utloggning. Försöker med alternativ metod...");
        
        // Even if the API call fails, force clear the session
        const forcedSuccess = await forceSignOut();
        if (forcedSuccess) {
          toast.success("Du har loggat ut");
        }
        return true; // Return true anyway to continue the UI flow
      }
      
      // Clear any refresh timers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      toast.success("Du har loggat ut");
      return true;
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("Ett oväntat fel uppstod vid utloggning");
      
      // Last resort - force the logout
      await forceSignOut();
      
      // Return true anyway to continue the UI flow
      return true;
    }
  };

  return {
    signOut,
    forceSignOut
  };
};
