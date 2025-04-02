
import { useParams } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { useEffect, useState } from "react";
import { DealInfo } from "@/components/deal/DealInfo";
import { PurchaseSteps } from "@/components/deal/PurchaseSteps";
import { DatabaseAccessTester } from "@/components/debug/DatabaseAccessTester";
import { SearchBreadcrumbs } from "@/components/search/SearchBreadcrumbs";
import { ProductHeader } from "@/components/deal/ProductHeader";
import { ProductImageDisplay } from "@/components/deal/ProductImageDisplay";
import { ProductDescription } from "@/components/deal/ProductDescription";
import { ProductSalonInfo } from "@/components/deal/ProductSalonInfo";
import { ProductRelatedDeals } from "@/components/deal/ProductRelatedDeals";
import { ProductSchema } from "@/components/deal/ProductSchema";
import { ProductErrorState } from "@/components/deal/ProductErrorState";
import { ProductLoadingState } from "@/components/deal/ProductLoadingState";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: deal, isLoading, isError } = useDeal(id);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Aktivera debug-läget med Ctrl+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id]);

  if (isError) {
    return <ProductErrorState />;
  }

  if (isLoading || !deal) {
    return <ProductLoadingState />;
  }

  return (
    <>
      <ProductSchema deal={deal} />

      <SearchBreadcrumbs 
        query="" 
        category={deal.category} 
        city={deal.city} 
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {showDebug && <DatabaseAccessTester />}
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                <ProductHeader 
                  category={deal.category} 
                  city={deal.city} 
                />
                
                <ProductImageDisplay 
                  imageUrl={deal.imageUrl} 
                  title={deal.title} 
                />
                
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

                <ProductDescription description={deal.description} />

                <PurchaseSteps />

                <ProductSalonInfo 
                  salonId={deal.salon?.id || null} 
                  salonName={deal.salon?.name} 
                  city={deal.city} 
                />
              </div>

              <div className="lg:col-span-4 hidden lg:block">
                <div className="lg:sticky lg:top-8">
                  <ProductHeader 
                    category={deal.category} 
                    city={deal.city} 
                  />
                  
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

            <ProductRelatedDeals 
              currentDealId={deal.id} 
              category={deal.category} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
