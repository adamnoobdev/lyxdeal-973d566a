import { useParams, useNavigate } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { useReviews } from "@/hooks/useReviews";
import { DealInfo } from "@/components/DealInfo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Star } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ReviewForm } from "@/components/ReviewForm";
import { RelatedDeals } from "@/components/deal/RelatedDeals";
import { DealFeatures } from "@/components/deal/DealFeatures";
import { useEffect } from "react";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading, isError } = useDeal(id);
  const { data: reviews, isLoading: isLoadingReviews } = useReviews(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isNew = (created_at: string) => {
    const createdDate = new Date(created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-accent/20 animate-fade-up">
              <ResponsiveImage
                src={deal.imageUrl}
                alt={deal.title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute right-3 top-3">
                {isNew(deal.created_at) && (
                  <CategoryBadge>
                    <Star className="mr-1 h-3.5 w-3.5" />
                    Ny
                  </CategoryBadge>
                )}
              </div>
            </div>

            <DealFeatures />

            {!isLoadingReviews && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Recensioner</h2>
                <ReviewForm dealId={deal.id} />
              </div>
            )}
          </div>

          <div>
            <DealInfo
              id={deal.id}
              title={deal.title}
              description={deal.description}
              category={deal.category}
              originalPrice={deal.original_price}
              discountedPrice={deal.discounted_price}
              timeRemaining={deal.time_remaining}
              city={deal.city}
              quantityLeft={deal.quantity_left}
              salon={deal.salons}
            />
          </div>
        </div>

        <div className="mt-16">
          <RelatedDeals
            currentDealId={deal.id}
            category={deal.category}
            city={deal.city}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;