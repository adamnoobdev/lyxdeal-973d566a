
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";

interface SalonAuthGuardProps {
  children: React.ReactNode;
}

export const SalonAuthGuard = ({ children }: SalonAuthGuardProps) => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSalonPermission = async () => {
      if (!session?.user) {
        navigate("/salon/login");
        return;
      }

      // Kolla om användaren är kopplad till en salong
      const { data, error } = await supabase
        .from("salons")
        .select("id, role")
        .eq("user_id", session.user.id)
        .single();

      if (error || !data || data.role !== "salon_owner") {
        // Om användaren inte är en salongsägare, logga ut dem och skicka till inloggningssidan
        await supabase.auth.signOut();
        navigate("/salon/login");
      }
    };

    if (!isLoading) {
      checkSalonPermission();
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
