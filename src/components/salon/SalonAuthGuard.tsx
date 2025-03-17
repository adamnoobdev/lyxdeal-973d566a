
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

      try {
        // Kolla om användaren är kopplad till en salong
        const { data, error } = await supabase
          .from("salons")
          .select("id, role")
          .eq("user_id", session.user.id)
          .single();

        if (error || !data) {
          // Om användaren inte är kopplad till en salong, logga ut dem
          console.error("Ingen salongdata hittades:", error);
          await supabase.auth.signOut();
          navigate("/salon/login");
          return;
        }

        if (data.role !== "salon_owner" && data.role !== "admin") {
          // Om användaren inte har rätt roll, logga ut dem
          console.error("Användaren har inte behörighet:", data.role);
          await supabase.auth.signOut();
          navigate("/salon/login");
          return;
        }

        // Om användaren har korrekt roll, kontrollera om det är första inloggningen
        // för att säkerställa att vi har en status-rad för användaren
        const { data: statusData, error: statusError } = await supabase
          .from("salon_user_status")
          .select("first_login")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (statusError && statusError.code !== "PGRST116") {
          console.error("Fel vid kontroll av användarstatus:", statusError);
        }

        // Om vi inte har en status-rad för användaren, skapa en med first_login=true
        if (!statusData) {
          await supabase
            .from("salon_user_status")
            .insert([{ user_id: session.user.id, first_login: true }]);
        }
      } catch (error) {
        console.error("Fel vid kontroll av salongsrättigheter:", error);
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
