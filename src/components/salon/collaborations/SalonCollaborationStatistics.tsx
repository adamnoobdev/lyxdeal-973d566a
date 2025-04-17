
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollaborationStats } from "@/hooks/useCollaborationStats";
import { ActiveCollaboration } from "@/types/collaboration";
import { Eye, Users, CheckCircle, Clock, RefreshCw, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface SalonCollaborationStatisticsProps {
  salonId: number | undefined;
  collaborations: ActiveCollaboration[];
}

export function SalonCollaborationStatistics({ salonId, collaborations }: SalonCollaborationStatisticsProps) {
  const { stats, isLoading, error, refetch } = useCollaborationStats(salonId, collaborations);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  useEffect(() => {
    if (!isLoading) {
      setLastUpdated(new Date());
    }
  }, [isLoading, stats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('Statistik har uppdaterats');
      setLastUpdated(new Date());
    } catch (err) {
      toast.error('Kunde inte uppdatera statistik');
      console.error('Error refreshing stats:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return <StatisticsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col gap-2">
          <span>Det gick inte att ladda statistiken. {error instanceof Error ? error.message : 'Försök igen senare.'}</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="self-start mt-1"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Uppdaterar...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Försök igen
              </>
            )}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Find best performing collaboration
  const bestPerforming = collaborations.reduce((best, current) => {
    const bestRate = best.views > 0 ? (best.redemptions / best.views) : 0;
    const currentRate = current.views > 0 ? (current.redemptions / current.views) : 0;
    return currentRate > bestRate ? current : best;
  }, collaborations[0] || null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {lastUpdated && `Senast uppdaterad: ${lastUpdated.toLocaleTimeString('sv-SE')}`}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Uppdaterar...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Uppdatera
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Visningar" 
          value={stats.totalViews.toString()} 
          icon={<Eye className="h-5 w-5 text-blue-500" />} 
          description="Totala visningar"
        />
        <StatCard 
          title="Inlösta" 
          value={stats.totalRedemptions.toString()} 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />} 
          description="Antal inlösta rabatter"
        />
        <StatCard 
          title="Aktiva kreatörer" 
          value={stats.activeCollaborators.toString()} 
          icon={<Users className="h-5 w-5 text-purple-500" />}
          description="Samarbeten med kreatörer"
        />
        <StatCard 
          title="Väntande ansökningar" 
          value={stats.pendingApplications.toString()} 
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          description="Ansökningar att hantera"
        />
      </div>

      {bestPerforming && collaborations.length > 1 && (
        <Card className="border-green-100 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Bäst presterande samarbete</CardTitle>
            <Award className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm text-green-700">
              <span className="font-bold">{bestPerforming.discount_code}</span>
              <span className="text-xs ml-2 text-green-600">
                Konverteringsgrad: {bestPerforming.views > 0 ? 
                  `${((bestPerforming.redemptions / bestPerforming.views) * 100).toFixed(1)}%` : 
                  'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  description 
}: { 
  title: string, 
  value: string, 
  icon: React.ReactNode,
  description?: string
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatisticsLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-24 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
