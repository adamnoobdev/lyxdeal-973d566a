
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollaborationStats } from "@/hooks/useCollaborationStats";
import { ActiveCollaboration } from "@/types/collaboration";
import { Eye, Users, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface SalonCollaborationStatisticsProps {
  salonId: number | undefined;
  collaborations: ActiveCollaboration[];
}

export function SalonCollaborationStatistics({ salonId, collaborations }: SalonCollaborationStatisticsProps) {
  const { stats, isLoading, error } = useCollaborationStats(salonId, collaborations);

  if (isLoading) {
    return <StatisticsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Det gick inte att ladda statistiken. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Visningar" 
        value={stats.totalViews.toString()} 
        icon={<Eye className="h-5 w-5 text-blue-500" />} 
      />
      <StatCard 
        title="Inlösta" 
        value={stats.totalRedemptions.toString()} 
        icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
      />
      <StatCard 
        title="Aktiva kreatörer" 
        value={stats.activeCollaborators.toString()} 
        icon={<Users className="h-5 w-5 text-purple-500" />}
      />
      <StatCard 
        title="Väntande ansökningar" 
        value={stats.pendingApplications.toString()} 
        icon={<Clock className="h-5 w-5 text-amber-500" />}
      />
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
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
}

function StatisticsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <Card key={item}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
