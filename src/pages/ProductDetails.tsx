import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { useReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { DealInfo } from "@/components/DealInfo";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ReviewForm } from "@/components/ReviewForm";
import { RelatedDeals } from "@/components/deal/RelatedDeals";
import { DealFeatures } from "@/components/deal/DealFeatures";
import { useEffect } from "react";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Erbjudandet kunde inte hittas
            </h2>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Gå tillbaka till startsidan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !deal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const discountPercentage = Math.round(
    ((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-12">
      <div className="container mx-auto px-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 py-6 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Tillbaka till erbjudanden
        </Link>
        
        <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-accent/20 animate-fade-up">
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute right-3 top-3">
                {isNew(deal.created_at) && (
                  <CategoryBadge
                    category="NYTT"
                    variant="default"
                    className="bg-yellow-500/90 text-yellow-950 font-semibold shadow-lg backdrop-blur-md"
                  />
                )}
              </div>
            </div>

            <DealInfo {...deal} />

            <div className="border-t border-accent/10 pt-8">
              <DealFeatures 
                discountPercentage={discountPercentage}
                timeRemaining={deal.timeRemaining}
                quantityLeft={deal.quantityLeft}
              />
            </div>

            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Recensioner
              </h2>
              
              <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-accent/20 p-6 mb-8 animate-fade-up">
                <h3 className="text-lg font-semibold mb-4">Skriv en recension</h3>
                <ReviewForm dealId={deal.id} />
              </div>

              <div className="space-y-6">
                {isLoadingReviews ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="bg-white rounded-xl shadow-sm p-6 border border-accent/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-up"
                    >
                      <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-5 w-5 ${
                              index < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground mb-2">{review.comment}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    Inga recensioner än. Var först med att recensera!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 space-y-6 h-fit">
            <RelatedDeals currentDealId={deal.id} category={deal.category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
