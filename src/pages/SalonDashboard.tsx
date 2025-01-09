import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/salon-dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/salon-dashboard/DashboardTabs";
import { toast } from "sonner";

interface SalonData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

export default function SalonDashboard() {
  const navigate = useNavigate();
  const [salonData, setSalonData] = useState<SalonData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    fetchSalonData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/salon/login");
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (user?.user?.email === 'admin@example.com') {
      setIsAdmin(true);
    }
  };

  const fetchSalonData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: salon, error } = await supabase
        .from("salons")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      setSalonData(salon);
    } catch (error) {
      console.error("Error fetching salon data:", error);
      toast.error("Det gick inte att hämta salongens information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <DashboardHeader 
        title={isAdmin ? "Admin Dashboard" : salonData?.name || ""}
        subtitle={isAdmin ? "Hantera salonger och erbjudanden" : salonData?.email || ""}
      />
      <DashboardTabs isAdmin={isAdmin} />
    </div>
  );
}