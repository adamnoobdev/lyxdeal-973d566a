
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEnvironmentDetection } from "./useEnvironmentDetection";

export const useSignOut = () => {
  const { isSandboxEnvironment } = useEnvironmentDetection();
  
  // Hjälpfunktion för att tvinga utloggning utan API-anrop
  const forceSignOut = async () => {
    try {
      console.log("Executing aggressive force sign-out procedure");
      
      try {
        // Explicit rensa auth-token för att säkerställa att autentiseringen inte återupptas
        localStorage.removeItem('sb-gmqeqhlhqhyrjquzhuzg-auth-token');
        sessionStorage.removeItem('sb-gmqeqhlhqhyrjquzhuzg-auth-token');
        
        // Rensa allt i local och session storage
        localStorage.clear();
        sessionStorage.clear();
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
        // I sandbox, rensa alltid sessionen omedelbart och forcera omladdning
        const success = await forceSignOut();
        
        if (success) {
          // Ändrat: Omdirigera till startsidan istället för login
          setTimeout(() => {
            console.log("Forcing complete page reload to homepage");
            window.location.href = '/';
          }, 100);
          return true;
        } else {
          // Även om forcerad utloggning misslyckas fortsätter vi och tvingar en sidomladdning
          setTimeout(() => {
            window.location.href = '/';
          }, 100);
          return true;
        }
      }
      
      // Standardutloggningsflöde för produktion
      console.log("Running standard logout flow");
      
      // Kör force logout först för att säkerställa att all state rensas
      await forceSignOut();
      
      // Ändrat: Omdirigera till startsidan istället för login
      setTimeout(() => {
        console.log("Redirecting to homepage after logout");
        window.location.href = '/';
      }, 100);
      
      return true;
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      
      // Sista utväg - tvinga utloggningen och sidomladdning
      await forceSignOut();
      
      // Ändrat: Omdirigera till startsidan istället för login
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
      // Returnera true ändå för att fortsätta UI-flödet
      return true;
    }
  };

  return {
    signOut,
    forceSignOut
  };
};

