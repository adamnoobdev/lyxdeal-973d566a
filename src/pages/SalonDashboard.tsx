import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { useState, useEffect } from "react";
import { Deal } from "@/types/deal";
import { useNavigate } from "react-router-dom";
import { useSalonDeals } from "@/hooks/useSalonDeals";
import { useFirstLogin } from "@/hooks/useFirstLogin";
import { DealStatistics } from "@/components/salon/DealStatistics";
import { DashboardHeader } from "@/components/salon/dashboard/Header";
import { WelcomeAlert } from "@/components/salon/dashboard/WelcomeAlert";
import { MainTabs } from "@/components/salon/dashboard/MainTabs";
import { SalonLayout } from "@/components/salon/layout/SalonLayout";
import { Helmet } from "react-helmet";

export default function SalonDashboard() {
  const { session } = useSession();
  const { isFirstLogin, isLoading: checkingFirstLogin } = useFirstLogin();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const navigate = useNavigate();

  const { data: salonData } = useQuery({
    queryKey: ['salon', session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('salons')
        .select('*')
        .eq('user_id', session?.user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  useEffect(() => {
    if (!checkingFirstLogin && isFirstLogin === false && showPasswordDialog) {
      setShowPasswordDialog(false);
    }
  }, [isFirstLogin, checkingFirstLogin, showPasswordDialog]);

  const handleClosePasswordDialog = () => {
    const localStatus = localStorage.getItem(`salon_first_login_${session?.user?.id}`);
    if (localStatus === 'false' || isFirstLogin === false) {
      setShowPasswordDialog(false);
    }
  };

  const handleViewDealDetails = (deal: Deal) => {
    navigate(`/salon/deal/${deal.id}`);
  };

  return (
    <SalonLayout>
      <Helmet>
        <title>Översikt | Lyxdeal</title>
      </Helmet>
      <div className="space-y-4 sm:space-y-6">
        <DashboardHeader />
        <WelcomeAlert />

        {/* Statistiksektion */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-semibold">Statistik översikt</h2>
          <DealStatistics salonId={salonData?.id} />
        </div>

        {/* MainTabs component */}
        <MainTabs />
      </div>
    </SalonLayout>
  );
};
