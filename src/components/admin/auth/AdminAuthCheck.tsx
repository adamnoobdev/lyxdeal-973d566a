
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminAuthCheckProps {
  children: React.ReactNode;
}

export const AdminAuthCheck = ({ children }: AdminAuthCheckProps) => {
  const { session, user } = useSession();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const checkPerformed = useRef(false);
  const isCheckingRef = useRef(false);

  // Använd useCallback för att förhindra onödiga re-renders
  const checkAdminStatus = useCallback(async () => {
    // Undvik dubbla kontroller eller parallella anrop
    if (checkPerformed.current || isCheckingRef.current) return;
    
    // Sätt en flagga för att visa att kontrollen pågår
    isCheckingRef.current = true;
    
    try {
      if (!user?.id) {
        console.log("Waiting for session...");
        isCheckingRef.current = false;
        return;
      }

      console.log("Checking admin status for user:", user.id);
      checkPerformed.current = true;

      const { data: salon, error } = await supabase
        .from('salons')
        .select('role')
        .eq('user_id', user.id)
        .single();

      console.log("Salon query result:", { salon, error });

      if (error) {
        console.error('Error checking admin status:', error);
        toast.error("Ett fel uppstod vid behörighetskontroll");
        navigate("/");
        return;
      }

      if (!salon || salon.role !== 'admin') {
        console.log("User is not admin. Role:", salon?.role);
        toast.error("Du har inte behörighet till denna sida");
        navigate("/");
        return;
      }

      console.log("Admin status confirmed");
      setIsAdmin(true);
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      toast.error("Ett fel uppstod");
      navigate("/");
    } finally {
      setIsLoading(false);
      isCheckingRef.current = false;
    }
  }, [user?.id, navigate]);

  useEffect(() => {
    // Återställ kontrollflaggan om användaren ändras
    if (user?.id) {
      checkAdminStatus();
    } else {
      checkPerformed.current = false;
      isCheckingRef.current = false;
      setIsLoading(true);
      setIsAdmin(null);
    }

    // Ingen cleanup funktion som sätter isMounted = false då denna kan orsaka state-uppdateringar efter unmount
  }, [user?.id, checkAdminStatus]);

  // Om användarens session försvinner, återställ status
  useEffect(() => {
    if (!session) {
      checkPerformed.current = false;
      isCheckingRef.current = false;
      setIsAdmin(null);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAdmin === null || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
