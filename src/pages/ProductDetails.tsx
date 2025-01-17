import { useParams } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RelatedDeals } from "@/components/deal/RelatedDeals";
import { useEffect } from "react";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { DealInfo } from "@/components/DealInfo";
import { PurchaseSteps } from "@/components/deal/PurchaseSteps";

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Vänster kolumn med bilder och detaljer */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ResponsiveImage
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              <PurchaseSteps />
              
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-semibold">Det här ingår</h2>
                <ul className="space-y-3">
                  {deal.description.split('\n').map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {deal.salon && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Om {deal.salon.name}</h2>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p>{deal.salon.address}</p>
                    {deal.salon.phone && <p>Tel: {deal.salon.phone}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Höger kolumn med pris och köpinfo */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-8">
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
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Andra som såg på denna deal tittade även på</h2>
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