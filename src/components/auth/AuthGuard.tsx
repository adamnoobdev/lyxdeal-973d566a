import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole } from "@/utils/auth";
import { isAuthorizedForRoute } from "@/utils/auth/redirects";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/salon/login");
        return;
      }

      const userRole = await getUserRole();
      const authorized = isAuthorizedForRoute(userRole, location.pathname);

      if (!authorized) {
        toast.error("Du har inte behörighet till denna sida");
        navigate("/salon/login");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [location.pathname, navigate]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};