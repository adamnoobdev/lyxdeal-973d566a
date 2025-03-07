
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Users, Tag, CheckCircle2 } from "lucide-react";

interface DealStats {
  deal_id: number;
  deal_title: string;
  total_codes: number;
  used_codes: number;
  customer_signups: number;
}

interface DealStatisticsProps {
  dealId?: string;
  salonId?: number;
}

export const DealStatistics = ({ dealId, salonId }: DealStatisticsProps) => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["deal-statistics", dealId, salonId],
    queryFn: async () => {
      let query = supabase.from("deal_statistics").select("*");
      
      if (dealId) {
        query = query.eq("deal_id", dealId);
      } 
      
      if (salonId) {
        query = query.eq("salon_id", salonId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as DealStats[];
    },
    enabled: !!dealId || !!salonId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Kunde inte hämta statistik: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  // Om vi visar statistik för en specifik deal
  if (dealId && stats && stats.length === 1) {
    const dealStat = stats[0];
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Intresserade kunder" 
          value={dealStat.customer_signups}
          icon={<Users className="h-5 w-5 text-blue-500" />}
        />
        <StatCard 
          title="Skapade rabattkoder" 
          value={dealStat.total_codes}
          icon={<Tag className="h-5 w-5 text-purple-500" />}
        />
        <StatCard 
          title="Använda rabattkoder" 
          value={dealStat.used_codes}
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
        />
      </div>
    );
  }

  // Om vi visar statistik för alla deals i en salong
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard 
        title="Totalt intresserade kunder" 
        value={stats?.reduce((sum, stat) => sum + stat.customer_signups, 0) || 0}
        icon={<Users className="h-5 w-5 text-blue-500" />}
      />
      <StatCard 
        title="Totalt skapade rabattkoder" 
        value={stats?.reduce((sum, stat) => sum + stat.total_codes, 0) || 0}
        icon={<Tag className="h-5 w-5 text-purple-500" />}
      />
      <StatCard 
        title="Totalt använda rabattkoder" 
        value={stats?.reduce((sum, stat) => sum + stat.used_codes, 0) || 0}
        icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
