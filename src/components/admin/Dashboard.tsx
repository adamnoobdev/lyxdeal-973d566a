import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Tag, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [salonsCount, dealsCount] = await Promise.all([
        supabase.from('salons').select('id', { count: 'exact', head: true }),
        supabase.from('deals').select('id', { count: 'exact', head: true })
      ]);

      return {
        salons: salonsCount.count || 0,
        deals: dealsCount.count || 0
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-8 w-1/2 bg-gray-200 rounded" />
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Översikt</h1>
        <p className="text-muted-foreground">
          Välkommen till adminpanelen. Här ser du en översikt över systemet.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};