import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DealsList } from "@/components/admin/DealsList";
import { SalonsList } from "@/components/admin/salons/SalonsList";
import { SalonDeals } from "@/components/admin/salons/SalonDeals";
import { Dashboard } from "@/components/admin/Dashboard";
import { toast } from "sonner";

export default function Admin() {
  const session = useSession();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async () => {
      try {
        if (!session?.user?.id) {
          console.log("Waiting for session...");
          return;
        }

        console.log("Checking admin status for user:", session.user.id);

        const { data: salon, error } = await supabase
          .from('salons')
          .select('role')
          .eq('user_id', session.user.id)
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

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [session, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAdmin === null) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full pt-16">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/deals" element={<DealsList />} />
            <Route path="/salons" element={<SalonsList />} />
            <Route path="/salons/:salonId/deals" element={<SalonDeals />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}