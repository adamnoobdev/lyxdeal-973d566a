
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Tag, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { memo } from "react";

export const Dashboard = memo(() => {
  const isMobile = useIsMobile();
  
  // Optimera React Query med stale time och gcTime (tidigare cacheTime)
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('Fetching admin stats data');
      
      // Parallella förfrågningar till Supabase för bättre prestanda
      const [salonsCount, dealsCount] = await Promise.all([
        supabase.from('salons').select('id', { count: 'exact', head: true }),
        supabase.from('deals').select('id', { count: 'exact', head: true })
      ]);

      return {
        salons: salonsCount.count || 0,
        deals: dealsCount.count || 0
      };
    },
    staleTime: 30000, // 30 sekunder innan data anses inaktuell
    gcTime: 300000, // Cache data i 5 minuter (ersätter cacheTime)
    refetchOnWindowFocus: false, // Förhindra omfrågor vid fönsterfokus
  });

  if (isLoading) {
    return (
      <div className="w-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-3 w-1/3 bg-gray-200 rounded" />
              <div className="h-6 w-1/2 bg-gray-200 rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Totalt antal salonger",
      value: stats?.salons || 0,
      icon: Store,
      description: "Aktiva salonger i systemet"
    },
    {
      title: "Aktiva erbjudanden",
      value: stats?.deals || 0,
      icon: Tag,
      description: "Publicerade erbjudanden"
    },
    {
      title: "Denna månad",
      value: "+5",
      icon: TrendingUp,
      description: "Nya salonger denna månad"
    }
  ];

  return (
    <div className="space-y-4 px-1 xs:px-2 sm:px-3">
      <div>
        <h1 className="text-xl xs:text-2xl font-bold tracking-tight text-primary">Översikt</h1>
        <p className="text-muted-foreground text-sm">
          Välkommen till adminpanelen. Här ser du en översikt över systemet.
        </p>
      </div>

      <div className="w-full grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden border border-secondary/20 shadow-sm hover:shadow transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-white">
              <CardTitle className="text-sm xs:text-base font-medium text-primary">
                {stat.title}
              </CardTitle>
              <div className="bg-primary p-2">
                <stat.icon className="h-3.5 w-3.5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="text-2xl xs:text-3xl font-bold text-primary">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";
