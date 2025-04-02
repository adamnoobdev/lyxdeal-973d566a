
import { useParams } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { useEffect, useState } from "react";
import { DealInfo } from "@/components/deal/DealInfo";
import { PurchaseSteps } from "@/components/deal/PurchaseSteps";
import { DatabaseAccessTester } from "@/components/debug/DatabaseAccessTester";
import { SearchBreadcrumbs } from "@/components/search/SearchBreadcrumbs";
import { ProductImageDisplay } from "@/components/deal/ProductImageDisplay";
import { ProductDescription } from "@/components/deal/ProductDescription";
import { ProductSalonInfo } from "@/components/deal/ProductSalonInfo";
import { ProductRelatedDeals } from "@/components/deal/ProductRelatedDeals";
import { ProductSchema } from "@/components/deal/ProductSchema";
import { ProductErrorState } from "@/components/deal/ProductErrorState";
import { ProductLoadingState } from "@/components/deal/ProductLoadingState";
import { ProductHeader } from "@/components/deal/ProductHeader";

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

  // Convert FormattedDealData to the expected format for components
  const dealData = {
    id: deal.id,
    title: deal.title,
    description: deal.description,
    imageUrl: deal.imageUrl,
    originalPrice: deal.originalPrice,
    discountedPrice: deal.discountedPrice,
    daysRemaining: deal.daysRemaining,
    city: deal.city,
    quantityLeft: deal.quantityLeft,
    isFree: deal.isFree,
    salon: deal.salon ? {
      id: deal.salon.id,
      name: deal.salon.name,
      address: deal.salon.address,
      phone: deal.salon.phone,
    } : null,
    booking_url: deal.booking_url,
    category: deal.category,
    requires_discount_code: deal.requires_discount_code
  };

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
                <ProductImageDisplay 
                  imageUrl={dealData.imageUrl} 
                  title={dealData.title} 
                />
                
                <div className="mt-3">
                  <ProductHeader 
                    category={dealData.category} 
                    city={dealData.city} 
                  />
                </div>
                
                <div className="block lg:hidden">
                  <DealInfo
                    id={dealData.id}
                    title={dealData.title}
                    description={dealData.description}
                    category={dealData.category}
                    originalPrice={dealData.originalPrice}
                    discountedPrice={dealData.discountedPrice}
                    daysRemaining={dealData.daysRemaining}
                    city={dealData.city}
                    quantityLeft={dealData.quantityLeft}
                    isFree={dealData.isFree}
                    salon={dealData.salon}
                    booking_url={dealData.booking_url}
                    requires_discount_code={dealData.requires_discount_code}
                  />
                </div>

                <ProductDescription description={dealData.description} />

                <PurchaseSteps />

                <ProductSalonInfo 
                  salonId={dealData.salon?.id || null} 
                  salonName={dealData.salon?.name} 
                  city={dealData.city} 
                />
              </div>

              <div className="lg:col-span-4 hidden lg:block">
                <div className="lg:sticky lg:top-8">
                  <DealInfo
                    id={dealData.id}
                    title={dealData.title}
                    description={dealData.description}
                    category={dealData.category}
                    originalPrice={dealData.originalPrice}
                    discountedPrice={dealData.discountedPrice}
                    daysRemaining={dealData.daysRemaining}
                    city={dealData.city}
                    quantityLeft={dealData.quantityLeft}
                    isFree={dealData.isFree}
                    salon={dealData.salon}
                    booking_url={dealData.booking_url}
                    requires_discount_code={dealData.requires_discount_code}
                  />
                </div>
              </div>
            </div>

            <ProductRelatedDeals 
              currentDealId={dealData.id} 
              category={dealData.category} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
