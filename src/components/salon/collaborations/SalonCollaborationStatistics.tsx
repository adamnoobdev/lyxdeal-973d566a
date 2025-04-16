
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, ShoppingBag, Award } from "lucide-react";
import { ActiveCollaboration } from "@/types/collaboration";
import { useCollaborationStats } from "@/hooks/useCollaborationStats";

interface SalonCollaborationStatisticsProps {
  salonId: number | undefined;
  collaborations: ActiveCollaboration[];
}

export function SalonCollaborationStatistics({ salonId, collaborations }: SalonCollaborationStatisticsProps) {
  const { stats, isLoading } = useCollaborationStats(salonId, collaborations);
  
  // Om vi inte har någon statistik eller laddar, visa bara tomma kort
  const totalViews = isLoading ? "..." : stats.totalViews;
  const totalRedemptions = isLoading ? "..." : stats.totalRedemptions;
  const activeCollaborators = isLoading ? "..." : stats.activeCollaborators;
  const pendingApplications = isLoading ? "..." : stats.pendingApplications;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aktiva kreatörer</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeCollaborators}</div>
          <p className="text-xs text-muted-foreground">Kreatörer som samarbetar med dig</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visningar</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalViews}</div>
          <p className="text-xs text-muted-foreground">Totalt antal visningar</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inlösta erbjudanden</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRedemptions}</div>
          <p className="text-xs text-muted-foreground">Antal inlösta rabattkoder</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Väntande ansökningar</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingApplications}</div>
          <p className="text-xs text-muted-foreground">Ansökningar som väntar på svar</p>
        </CardContent>
      </Card>
    </div>
  );
}
