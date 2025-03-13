
import { useEffect, useState, useRef } from "react";
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

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async () => {
      // Undvik dubbla kontroller om vi redan har kontrollerat
      if (checkPerformed.current) return;
      
      try {
        if (!user?.id) {
          console.log("Waiting for session...");
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
          if (isMounted) {
            toast.error("Ett fel uppstod vid behörighetskontroll");
            navigate("/");
          }
          return;
        }

        if (!salon || salon.role !== 'admin') {
          console.log("User is not admin. Role:", salon?.role);
          if (isMounted) {
            toast.error("Du har inte behörighet till denna sida");
            navigate("/");
          }
          return;
        }

        console.log("Admin status confirmed");
        if (isMounted) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        if (isMounted) {
          toast.error("Ett fel uppstod");
          navigate("/");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Återställ kontrollflaggan om användaren ändras
    if (user?.id) {
      checkAdminStatus();
    } else {
      checkPerformed.current = false;
      setIsLoading(true);
      setIsAdmin(null);
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id, navigate]);

  // Om användarens session försvinner, återställ status
  useEffect(() => {
    if (!session) {
      checkPerformed.current = false;
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
