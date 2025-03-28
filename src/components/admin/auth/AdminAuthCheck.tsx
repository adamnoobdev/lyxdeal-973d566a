
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
  const lastCheckTimeRef = useRef<number>(0);

  // Security measure: re-verify admin status periodically
  useEffect(() => {
    const RECHECK_INTERVAL = 15 * 60 * 1000; // 15 minutes
    
    const intervalCheck = setInterval(() => {
      const now = Date.now();
      // Only recheck if enough time has passed and we're not already checking
      if (now - lastCheckTimeRef.current > RECHECK_INTERVAL && !isCheckingRef.current && user?.id) {
        console.log("Periodic re-verification of admin status");
        verifyAdminStatus(user.id);
      }
    }, 60000); // Check every minute if recheck is needed
    
    return () => clearInterval(intervalCheck);
  }, [user?.id]);

  // Secure verification of admin status
  const verifyAdminStatus = async (userId: string) => {
    if (isCheckingRef.current) return;
    
    isCheckingRef.current = true;
    try {
      console.log("Verifying admin status for user:", userId);
      
      const { data: salon, error } = await supabase
        .from('salons')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Admin status verification error:', error);
        if (isMountedRef.current) {
          setIsAdmin(false);
          toast.error("Behörighetskontroll misslyckades");
          navigate("/salon/login");
        }
        return;
      }
      
      const hasAdminRole = salon?.role === 'admin';
      
      if (!hasAdminRole) {
        console.log("User does not have admin role:", salon?.role);
        if (isMountedRef.current) {
          setIsAdmin(false);
          toast.error("Du har inte behörighet till administrationssidan");
          navigate("/salon/login");
        }
        return;
      }
      
      lastCheckTimeRef.current = Date.now();
      if (isMountedRef.current) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error in admin verification:', error);
      if (isMountedRef.current) {
        setIsAdmin(false);
        toast.error("Ett säkerhetsfel uppstod");
        navigate("/salon/login");
      }
    } finally {
      isCheckingRef.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Set up isMountedRef to handle cleanup correctly
    isMountedRef.current = true;
    
    const checkAdminStatus = async () => {
      // Avoid double checks or parallel calls
      if (checkPerformed.current || isCheckingRef.current || !isMountedRef.current || sessionLoading) return;
      
      if (!user?.id) {
        console.log("AdminAuthCheck: No user session found, redirecting to login...");
        navigate("/salon/login");
        return;
      }

      checkPerformed.current = true;
      await verifyAdminStatus(user.id);
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
        navigate("/salon/login");
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
