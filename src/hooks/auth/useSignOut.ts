
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEnvironmentDetection } from "./useEnvironmentDetection";

export const useSignOut = (refreshTimerRef: React.MutableRefObject<number | null>) => {
  const { isSandboxEnvironment } = useEnvironmentDetection();
  
  // Hjälpfunktion för att tvinga utloggning utan API-anrop
  const forceSignOut = async () => {
    try {
      console.log("Executing aggressive force sign-out procedure");
      
      // Rensa eventuella uppdateringstimers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // Aggressiv rensning av lagring - var grundlig
      try {
        // Rensa allt i local och session storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Explicit rensa auth-token
        localStorage.removeItem('sb-gmqeqhlhqhyrjquzhuzg-auth-token');
        sessionStorage.removeItem('sb-gmqeqhlhqhyrjquzhuzg-auth-token');
      } catch (storageErr) {
        console.error("Error clearing storage during force sign-out:", storageErr);
      }
      
      // Tvinga klienten att rensa sitt tillstånd - med ytterligare felhantering
      try {
        await supabase.auth.signOut({ scope: 'global' }); // Prova global omfattning först
      } catch (e) {
        console.log("Error during global signOut, trying local:", e);
        try {
          await supabase.auth.signOut({ scope: 'local' });
        } catch (e2) {
          console.log("Error during local signOut as well, continuing:", e2);
        }
      }
      
      // Manuellt utlösa ett SIGNED_OUT-event för att säkerställa att listeners hör det
      try {
        const event = new CustomEvent('supabase.auth.signout', { detail: { event: 'SIGNED_OUT' } });
        window.dispatchEvent(event);
      } catch (e) {
        console.log("Error triggering custom event:", e);
      }
      
      console.log("Force sign-out completed");
      return true;
    } catch (err) {
      console.error("Error during force sign-out:", err);
      return false;
    }
  };

  // Hjälpfunktion för säker utloggning - med förbättrad sandbox-hantering
  const signOut = async () => {
    try {
      console.log("Starting signOut process");
      
      // Kontrollera alltid först om det är en sandbox-miljö och tillämpa särskild hantering
      if (isSandboxEnvironment()) {
        console.log("Sandbox environment detected, using aggressive logout handling");
        // I sandbox, rensa alltid sessionen omedelbart
        const success = await forceSignOut();
        
        if (success) {
          return true;
        } else {
          // Även om forcerad utloggning misslyckas kommer vi att fortsätta flödet i UI
          console.log("Force signout had issues but continuing logout flow");
          return true;
        }
      }
      
      // Standardutloggningsflöde för produktion
      console.log("Running standard logout flow");
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Sign out API error:", error);
        toast.error("Problem vid utloggning. Försöker med alternativ metod...");
        
        // Även om API-anropet misslyckas, tvinga rensning av sessionen
        const forcedSuccess = await forceSignOut();
        return true; // Returnera true ändå för att fortsätta UI-flödet
      }
      
      // Rensa eventuella uppdateringstimers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // Extra åtgärd för att säkerställa att alla tokens är borttagna
      localStorage.clear();
      sessionStorage.clear();
      
      return true;
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      
      // Sista utväg - tvinga utloggningen
      await forceSignOut();
      
      // Returnera true ändå för att fortsätta UI-flödet
      return true;
    }
  };

  return {
    signOut,
    forceSignOut
  };
};
