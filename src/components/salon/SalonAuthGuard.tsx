
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

interface SalonAuthGuardProps {
  children: React.ReactNode;
}

export const SalonAuthGuard = ({ children }: SalonAuthGuardProps) => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSalonPermission = async () => {
      if (isLoading) return;
      
      if (!session?.user) {
        navigate("/salon/login");
        return;
      }

      try {
        // Check if user is linked to a salon
        const { data, error } = await supabase
          .from("salons")
          .select("id, role")
          .eq("user_id", session.user.id)
          .single();

        if (error || !data) {
          console.error("No salon data found:", error);
          await supabase.auth.signOut();
          navigate("/salon/login");
          return;
        }

        if (data.role !== "salon_owner" && data.role !== "admin") {
          console.error("User doesn't have permission:", data.role);
          await supabase.auth.signOut();
          navigate("/salon/login");
          return;
        }

        // Check if it's the first login
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
          await supabase
            .from("salon_user_status")
            .insert([{ user_id: session.user.id, first_login: true }]);
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking salon permissions:", error);
        navigate("/salon/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkSalonPermission();
  }, [session, isLoading, navigate]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
