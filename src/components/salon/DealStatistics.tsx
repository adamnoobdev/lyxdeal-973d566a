
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
        query = query.eq("deal_id", parseInt(dealId));
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
          icon={<Users className="h-5 w-5 text-white" />}
          color="primary"
        />
        <StatCard 
          title="Skapade rabattkoder" 
          value={dealStat.total_codes}
          icon={<Tag className="h-5 w-5 text-white" />}
          color="secondary"
        />
        <StatCard 
          title="Använda rabattkoder" 
          value={dealStat.used_codes}
          icon={<CheckCircle2 className="h-5 w-5 text-white" />}
          color="success"
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
        icon={<Users className="h-5 w-5 text-white" />}
        color="primary"
      />
      <StatCard 
        title="Totalt skapade rabattkoder" 
        value={stats?.reduce((sum, stat) => sum + stat.total_codes, 0) || 0}
        icon={<Tag className="h-5 w-5 text-white" />}
        color="secondary"
      />
      <StatCard 
        title="Totalt använda rabattkoder" 
        value={stats?.reduce((sum, stat) => sum + stat.used_codes, 0) || 0}
        icon={<CheckCircle2 className="h-5 w-5 text-white" />}
        color="success"
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "success";
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const bgColorMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    success: "bg-success-500"
  };
  
  const bgColor = bgColorMap[color];
  
  return (
    <Card className="border border-secondary/20 overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white">
        <CardTitle className="text-sm xs:text-base font-medium text-primary">
          {title}
        </CardTitle>
        <div className={`${bgColor} p-2`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-3xl xs:text-4xl font-bold text-primary">{value}</div>
      </CardContent>
    </Card>
  );
};
