import { useParams } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { useReviews } from "@/hooks/useReviews";
import { DealInfo } from "@/components/DealInfo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ReviewForm } from "@/components/ReviewForm";
import { RelatedDeals } from "@/components/deal/RelatedDeals";
import { useEffect } from "react";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: deal, isLoading, isError } = useDeal(id);
  const { data: reviews, isLoading: isLoadingReviews } = useReviews(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Kunde inte hitta erbjudandet. Det kan ha tagits bort eller så har ett fel uppstått.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading || !deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
          <div className="h-96 bg-accent/5 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-accent/5 rounded w-3/4" />
            <div className="h-4 bg-accent/5 rounded w-1/2" />
            <div className="h-4 bg-accent/5 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="overflow-hidden rounded-lg">
                <ResponsiveImage
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>

              {!isLoadingReviews && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold">
                    Recensioner
                  </h2>
                  <ReviewForm dealId={deal.id} />
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-8 lg:self-start">
              <DealInfo
                id={deal.id}
                title={deal.title}
                description={deal.description}
                category={deal.category}
                originalPrice={deal.originalPrice}
                discountedPrice={deal.discountedPrice}
                timeRemaining={deal.timeRemaining}
                city={deal.city}
                quantityLeft={deal.quantityLeft}
                salon={deal.salon}
              />
            </div>
          </div>

          <div className="mt-16">
            <RelatedDeals
              currentDealId={deal.id}
              category={deal.category}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;