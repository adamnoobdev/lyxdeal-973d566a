
import { useParams } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RelatedDeals } from "@/components/deal/RelatedDeals";
import { useEffect } from "react";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { DealInfo } from "@/components/deal/DealInfo";
import { PurchaseSteps } from "@/components/deal/PurchaseSteps";
import { SalonLocationMap } from "@/components/deal/SalonLocationMap";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: deal, isLoading, isError } = useDeal(id);

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]); // Added id as dependency to ensure scroll on navigation between products

  // Debug logging for troubleshooting
  useEffect(() => {
    console.log(`🔍 ProductDetails rendered for deal ID: ${id}`);
    console.log(`🔍 Deal data loaded state: ${isLoading ? 'loading' : (isError ? 'error' : 'success')}`);
    
    if (deal) {
      console.log("🔍 Complete deal data in ProductDetails:", deal);
      console.log("🔍 Salon data in ProductDetails:", deal.salon);
      console.log("🔍 Salon structure:", {
        id: deal.salon?.id,
        name: deal.salon?.name,
        address: deal.salon?.address,
        phone: deal.salon?.phone
      });
    }
  }, [id, deal, isLoading, isError]);

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
          <div className="h-96 bg-accent/5" />
          <div className="space-y-4">
            <div className="h-8 bg-accent/5 w-3/4" />
            <div className="h-4 bg-accent/5 w-1/2" />
            <div className="h-4 bg-accent/5 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // Enhanced safe access to salon data with more detailed fallbacks for debugging
  console.log(`🔎 Preparing salon display data for deal ${id}`);
  const salonName = deal.salon?.name || `Salong i ${deal.city || 'Stockholm'}`;
  const salonAddress = deal.salon?.address || (deal.city ? `${deal.city} centrum` : null);
  const salonPhone = deal.salon?.phone || null;
  console.log(`🔎 Final salon display values:`, { salonName, salonAddress, salonPhone });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Restructured layout for better mobile responsiveness */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column with images and details */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white shadow-sm overflow-hidden">
                <ResponsiveImage
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              
              {/* Mobile-only DealInfo section that appears right after the image on mobile */}
              <div className="block lg:hidden">
                <DealInfo
                  id={deal.id}
                  title={deal.title}
                  description={deal.description}
                  category={deal.category}
                  originalPrice={deal.originalPrice}
                  discountedPrice={deal.discountedPrice}
                  daysRemaining={deal.daysRemaining}
                  city={deal.city}
                  quantityLeft={deal.quantityLeft}
                  isFree={deal.isFree}
                  salon={deal.salon}
                  booking_url={deal.booking_url}
                />
              </div>

              <div className="bg-white shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-semibold">Det här ingår</h2>
                <ul className="space-y-3">
                  {deal.description.split('\n').map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 bg-primary mt-2 rounded-full" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <PurchaseSteps />

              {/* Salon section with location info */}
              <div className="bg-white shadow-sm p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Om {salonName}</h2>
                
                <div className="mt-6">
                  <SalonLocationMap 
                    address={salonAddress || deal.city || ""}
                    salonName={salonName}
                    salonPhone={salonPhone}
                    city={deal.city}
                    hideAddress={false}
                  />
                </div>
              </div>
            </div>

            {/* Right column with price and purchase info - hidden on mobile as we show it above */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="lg:sticky lg:top-8">
                <DealInfo
                  id={deal.id}
                  title={deal.title}
                  description={deal.description}
                  category={deal.category}
                  originalPrice={deal.originalPrice}
                  discountedPrice={deal.discountedPrice}
                  daysRemaining={deal.daysRemaining}
                  city={deal.city}
                  quantityLeft={deal.quantityLeft}
                  isFree={deal.isFree}
                  salon={deal.salon}
                  booking_url={deal.booking_url}
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
