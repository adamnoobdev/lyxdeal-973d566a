
import { useDeals } from "@/hooks/useDeals";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DealsGrid } from "@/components/DealsGrid";
import { memo } from "react";

interface CityDealsProps {
  city: string;
  selectedCategory: string;
}

const CityDealsComponent = ({
  city,
  selectedCategory
}: CityDealsProps) => {
  const {
    data: deals,
    isLoading,
    error
  } = useDeals(selectedCategory, city);
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Det gick inte att hämta erbjudanden för {city}. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (isLoading) {
    return <CityDealsLoadingSkeleton />;
  }
  
  if (!deals || deals.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          Inga erbjudanden hittades i {city}.
        </p>
      </div>
    );
  }
  
  return <DealsGrid deals={deals} scrollable={true} compact={true} />;
};

export const CityDealsLoadingSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-56 md:h-64 lg:h-72 bg-accent/5 rounded-lg animate-pulse" />
    ))}
  </div>
);

export const CityDeals = memo(CityDealsComponent);
