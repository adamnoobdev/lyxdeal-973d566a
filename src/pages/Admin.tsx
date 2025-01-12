import { useEffect, useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DealsList } from "@/components/admin/DealsList";
import { SalonsList } from "@/components/admin/salons/SalonsList";
import { toast } from "sonner";

export default function Admin() {
  const session = useSession();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user) {
        console.log("No session found, redirecting to home");
        toast.error("Du måste vara inloggad");
        navigate("/");
        return;
      }

      try {
        const { data: salon, error } = await supabase
          .from('salons')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        console.log("Salon data:", salon); // Debug log

        if (error) {
          console.error('Error checking admin status:', error);
          toast.error("Ett fel uppstod vid behörighetskontroll");
          navigate("/");
          return;
        }

        if (!salon || salon.role !== 'admin') {
          console.log("User is not admin:", salon?.role); // Debug log
          toast.error("Du har inte behörighet till denna sida");
          navigate("/");
          return;
        }

        console.log("User confirmed as admin"); // Debug log
        setIsAdmin(true);
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        toast.error("Ett fel uppstod");
        navigate("/");
      }
    };

    checkAdminStatus();
  }, [session, navigate]);

  // Show nothing while checking admin status
  if (isAdmin === null) {
    return null;
  }

  // Only render admin content if user is confirmed admin
  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DealsList />} />
            <Route path="/salons" element={<SalonsList />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}