import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react"; // Added Star import here
import { Link } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { useReviews } from "@/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";
import { DealInfo } from "@/components/DealInfo";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ReviewForm } from "@/components/ReviewForm";
import { useEffect } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading, isError } = useDeal(id);
  const { data: reviews, isLoading: isLoadingReviews } = useReviews(id);

  // Scroll to top when component mounts
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Erbjudandet kunde inte hittas
            </h2>
            <Button
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Gå tillbaka till startsidan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full rounded-lg" />
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
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 py-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          Tillbaka till erbjudanden
        </Link>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="relative">
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="aspect-[4/3] w-full rounded-lg object-cover shadow-lg"
              />
              <div className="absolute right-3 top-3 flex gap-2">
                <CategoryBadge 
                  category={`${discountPercentage}% RABATT`} 
                  variant="default"
                  className="bg-gradient-to-r from-[#D946EF]/40 to-[#9b87f5]/40 text-white font-semibold shadow-sm backdrop-blur-md bg-white/10"
                />
                {isNew(deal.created_at) && (
                  <CategoryBadge
                    category="NYTT"
                    variant="default"
                    className="bg-yellow-500/90 text-yellow-950 font-semibold shadow-sm backdrop-blur-md"
                  />
                )}
              </div>
            </div>
          </div>
          
          <DealInfo {...deal} />
        </div>

        <div className="mt-12">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Recensioner</h2>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Skriv en recension</h3>
              <ReviewForm dealId={deal.id} />
            </div>

            <div className="space-y-6">
              {isLoadingReviews ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg shadow p-6">
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
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  Inga recensioner än. Var först med att recensera!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;