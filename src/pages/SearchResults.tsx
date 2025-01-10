import { useSearchParams, Link } from "react-router-dom";
import { useSearchDeals } from "@/hooks/useSearchDeals";
import { DealsGrid } from "@/components/DealsGrid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const { deals, isLoading } = useSearchDeals(searchParams);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-accent/50 rounded-xl animate-pulse" />
          ))}
        </div>
      );
    }

    if (!deals?.length) {
      return (
        <Alert>
          <AlertDescription>
            Inga erbjudanden hittades med valda filter.
          </AlertDescription>
        </Alert>
      );
    }

    return <DealsGrid deals={deals} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="gap-2"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </Link>
        </Button>
      </div>

      {renderContent()}
    </div>
  );
}