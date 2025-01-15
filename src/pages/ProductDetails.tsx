import { useParams } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RelatedDeals } from "@/components/deal/RelatedDeals";
import { useEffect } from "react";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { DealInfo } from "@/components/DealInfo";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: deal, isLoading, isError } = useDeal(id);

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
          <div className="h-[400px] bg-accent/5 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-accent/5 rounded-xl w-3/4" />
            <div className="h-4 bg-accent/5 rounded-xl w-1/2" />
            <div className="h-4 bg-accent/5 rounded-xl w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-primary-50/20">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl shadow-lg bg-white p-2 transition-all duration-300 hover:shadow-xl">
                <ResponsiveImage
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="aspect-[4/3] w-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
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

          <div className="mt-16 lg:mt-24">
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