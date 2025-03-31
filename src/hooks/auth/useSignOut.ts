
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEnvironmentDetection } from "./useEnvironmentDetection";

export const useSignOut = (refreshTimerRef: React.MutableRefObject<number | null>) => {
  const { isSandboxEnvironment } = useEnvironmentDetection();
  
  // Helper for forcing a sign out without API call
  const forceSignOut = () => {
    try {
      // Clear any refresh timers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // Clear browser storage
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Force client to clear its state
      supabase.auth.signOut({ scope: 'local' }).catch(e => {
        console.log("Ignoring error during force sign-out:", e);
      });
      
      console.log("Force sign-out completed");
      return true;
    } catch (err) {
      console.error("Error during force sign-out:", err);
      return false;
    }
  };

  // Helper for signing out securely
  const signOut = async () => {
    try {
      // Always check for sandbox environment first
      if (isSandboxEnvironment()) {
        console.log("Sandbox environment detected, using special logout handling");
        // In sandbox, force clear the session immediately
        const success = forceSignOut();
        if (success) {
          toast.success("Du har loggat ut");
        }
        return success;
      }
      
      // Standard logout flow for production
      console.log("Running standard logout flow");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Det gick inte att logga ut. Försöker med alternativ metod...");
        
        // Even if the API call fails, force clear the session
        const forcedSuccess = forceSignOut();
        if (forcedSuccess) {
          toast.success("Du har loggat ut");
        }
        return forcedSuccess;
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
      const forcedSuccess = forceSignOut();
      if (forcedSuccess) {
        toast.success("Du har loggat ut trots fel");
      }
      return forcedSuccess;
    }
  };

  return {
    signOut,
    forceSignOut
  };
};
