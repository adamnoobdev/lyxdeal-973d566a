
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
import { SalonLocationMap } from "@/components/deal/map/SalonLocationMap";
import { PageMetadata } from "@/components/seo/PageMetadata";

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
    return (
      <>
        <PageMetadata
          title="Erbjudandet kunde inte hittas | Lyxdeal"
          description="Tyvärr kunde vi inte hitta det erbjudande du sökte. Prova att söka efter andra erbjudanden på Lyxdeal."
        />
        <ProductErrorState />
      </>
    );
  }

  if (isLoading || !deal) {
    return (
      <>
        <PageMetadata
          title="Laddar erbjudande... | Lyxdeal"
          description="Laddar erbjudandeinformation från Lyxdeal."
        />
        <ProductLoadingState />
      </>
    );
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
      rating: deal.salon.rating || undefined,
    } : null,
    booking_url: deal.booking_url,
    category: deal.category,
    requires_discount_code: deal.requires_discount_code,
    salon_rating: deal.salon?.rating
  };

  // Create structured data for product
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": deal.title,
    "description": deal.description,
    "image": deal.imageUrl,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "SEK",
      "price": deal.discountedPrice,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "BeautySalon",
        "name": deal.salon?.name || `Salong i ${deal.city}`
      },
      "url": window.location.href,
    }
  };

  // Create structured data for service
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": deal.title,
    "description": deal.description,
    "provider": {
      "@type": "BeautySalon",
      "name": deal.salon?.name || `Salong i ${deal.city}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": deal.city,
        "addressCountry": "SE"
      }
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "SEK",
      "price": deal.discountedPrice,
      "eligibleRegion": {
        "@type": "Country",
        "name": "SE"
      }
    }
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Hem",
        "item": "https://lyxdeal.se/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": deal.category,
        "item": `https://lyxdeal.se/search?category=${encodeURIComponent(deal.category)}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": deal.city,
        "item": `https://lyxdeal.se/search?city=${encodeURIComponent(deal.city)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": deal.title,
        "item": window.location.href
      }
    ]
  };

  // Combine all structured data
  const structuredData = [
    productStructuredData,
    serviceStructuredData,
    breadcrumbStructuredData
  ];

  const canonicalPath = `/deal/${deal.id}`;

  return (
    <>
      <PageMetadata
        title={`${deal.title} | ${deal.city} | Lyxdeal`}
        description={`${deal.title} - ${deal.description.substring(0, 120)}...`}
        imageUrl={deal.imageUrl}
        canonicalPath={canonicalPath}
        structuredData={structuredData}
      />

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
                  salonRating={dealData.salon?.rating}
                  phone={dealData.salon?.phone}
                />

                {dealData.salon && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Hitta hit</h3>
                    <SalonLocationMap 
                      salonId={dealData.salon.id} 
                      city={dealData.city}
                      hidePhone={true}
                    />
                  </div>
                )}
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
              city={dealData.city}
              salonRating={dealData.salon_rating}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
