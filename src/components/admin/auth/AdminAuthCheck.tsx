
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminAuthCheckProps {
  children: React.ReactNode;
}

export const AdminAuthCheck = ({ children }: AdminAuthCheckProps) => {
  const { session, user, isLoading: sessionLoading } = useSession();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const checkPerformed = useRef(false);
  const isCheckingRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set up isMountedRef to handle cleanup correctly
    isMountedRef.current = true;
    
    const checkAdminStatus = async () => {
      // Avoid double checks or parallel calls
      if (checkPerformed.current || isCheckingRef.current || !isMountedRef.current || sessionLoading) return;
      
      // Set a flag to show that the check is in progress
      isCheckingRef.current = true;
      
      try {
        if (!user?.id) {
          console.log("AdminAuthCheck: No user session found, redirecting to login...");
          navigate("/auth");
          return;
        }

        console.log("AdminAuthCheck: Checking admin status for user:", user.id);
        checkPerformed.current = true;

        const { data: salon, error } = await supabase
          .from('salons')
          .select('role')
          .eq('user_id', user.id)
          .single();

        console.log("AdminAuthCheck: Salon query result:", { salon, error });

        if (error) {
          console.error('AdminAuthCheck: Error checking admin status:', error);
          if (isMountedRef.current) {
            toast.error("Ett fel uppstod vid behörighetskontroll");
            navigate("/auth");
          }
          return;
        }

        if (!salon || salon.role !== 'admin') {
          console.log("AdminAuthCheck: User is not admin. Role:", salon?.role);
          if (isMountedRef.current) {
            toast.error("Du har inte behörighet till denna sida");
            navigate("/auth");
          }
          return;
        }

        console.log("AdminAuthCheck: Admin status confirmed");
        if (isMountedRef.current) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('AdminAuthCheck: Error in checkAdminStatus:', error);
        if (isMountedRef.current) {
          toast.error("Ett fel uppstod");
          navigate("/auth");
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        isCheckingRef.current = false;
      }
    };

    checkAdminStatus();
    
    // Cleanup function that prevents state updates after unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [user?.id, navigate, sessionLoading]);

  // If the user's session disappears, reset the status
  useEffect(() => {
    if (!session && !sessionLoading) {
      checkPerformed.current = false;
      isCheckingRef.current = false;
      if (isMountedRef.current) {
        setIsAdmin(null);
        navigate("/auth");
      }
    }
  }, [session, sessionLoading, navigate]);

  if (isLoading || sessionLoading) {
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
