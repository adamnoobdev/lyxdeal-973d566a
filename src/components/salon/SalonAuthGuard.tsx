
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { PasswordChangeDialog } from "./password-change/PasswordChangeDialog";
import { useFirstLogin } from "@/hooks/useFirstLogin";
import { toast } from "sonner";

interface SalonAuthGuardProps {
  children: React.ReactNode;
}

export const SalonAuthGuard = ({ children }: SalonAuthGuardProps) => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isFirstLogin, isLoading: isFirstLoginLoading } = useFirstLogin();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const checkSalonPermission = useCallback(async () => {
    if (isLoading) return;
    
    if (!session?.user) {
      console.log("No authenticated session found, redirecting to login");
      navigate("/salon/login");
      return;
    }

    try {
      console.log("Checking salon permissions for user:", session.user.id);
      // Check if user is linked to a salon
      const { data, error } = await supabase
        .from("salons")
        .select("id, role")
        .eq("user_id", session.user.id)
        .single();

      if (error || !data) {
        console.error("No salon data found:", error);
        toast.error("Din användare är inte kopplad till någon salong");
        await supabase.auth.signOut();
        navigate("/salon/login");
        return;
      }

      if (data.role !== "salon_owner" && data.role !== "admin") {
        console.error("User doesn't have permission:", data.role);
        toast.error("Du har inte behörighet för denna sida");
        await supabase.auth.signOut();
        navigate("/salon/login");
        return;
      }

      console.log("User has valid salon permissions");
      
      // Create a new salon_user_status row if needed
      const { data: statusData, error: statusError } = await supabase
        .from("salon_user_status")
        .select("first_login")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (statusError && statusError.code !== "PGRST116") {
        console.error("Error checking user status:", statusError);
      }

      // If no status row exists for the user, create one with first_login=true
      if (!statusData) {
        console.log("Creating new salon_user_status row for user");
        await supabase
          .from("salon_user_status")
          .insert([{ user_id: session.user.id, first_login: true }]);
      }
      
      setIsAuthorized(true);
    } catch (error) {
      console.error("Error checking salon permissions:", error);
      toast.error("Ett fel uppstod vid kontroll av behörighet");
      navigate("/salon/login");
    } finally {
      setIsCheckingAuth(false);
    }
  }, [session, isLoading, navigate]);

  useEffect(() => {
    checkSalonPermission();
  }, [checkSalonPermission]);

  // Uppdatera visning av dialogrutan baserat på isFirstLogin
  useEffect(() => {
    if (!isFirstLoginLoading && isFirstLogin === true) {
      console.log('Setting showPasswordDialog to true based on isFirstLogin:', isFirstLogin);
      setShowPasswordDialog(true);
    } else if (!isFirstLoginLoading && isFirstLogin === false) {
      console.log('First login is completed, not showing dialog');
      setShowPasswordDialog(false);
    }
  }, [isFirstLogin, isFirstLoginLoading]);

  // Hantera stängning av lösenordsdialogrutan
  const handleClosePasswordDialog = () => {
    // Tillåt stängning endast om det inte längre är första inloggning
    if (isFirstLogin === false) {
      console.log('Closing password dialog, first login completed');
      setShowPasswordDialog(false);
    } else {
      // Kontrollera om det finns en localStorage-inställning
      const localStatus = localStorage.getItem(`salon_first_login_${session?.user?.id}`);
      if (localStatus === 'false') {
        console.log('Closing password dialog based on localStorage status');
        setShowPasswordDialog(false);
        // Tvinga fram en uppdatering av isFirstLogin
        checkSalonPermission();
      }
    }
  };

  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Verifierar behörighet...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      {children}
      <PasswordChangeDialog 
        isOpen={showPasswordDialog} 
        onClose={handleClosePasswordDialog}
        isFirstLogin={isFirstLogin === true} 
      />
    </>
  );
};
