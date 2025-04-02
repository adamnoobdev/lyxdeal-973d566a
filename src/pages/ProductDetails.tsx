
import { useParams } from "react-router-dom";
import { useDeal } from "@/hooks/useDeal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { RelatedDeals } from "@/components/deal/RelatedDeals";
import { useEffect, useState } from "react";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { DealInfo } from "@/components/deal/DealInfo";
import { PurchaseSteps } from "@/components/deal/PurchaseSteps";
import { SalonLocationMap } from "@/components/deal/map";
import { Helmet } from "react-helmet";
import { DatabaseAccessTester } from "@/components/debug/DatabaseAccessTester";
import { CategoryBadge } from "@/components/CategoryBadge";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { SearchBreadcrumbs } from "@/components/search/SearchBreadcrumbs";

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
        <Helmet>
          <title>Erbjudande hittades inte | Lyxdeal</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Kunde inte hitta erbjudandet. Det kan ha tagits bort eller så har ett fel uppstått.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  if (isLoading || !deal) {
    return (
      <>
        <Helmet>
          <title>Laddar erbjudande... | Lyxdeal</title>
          <meta name="robots" content="noindex, follow" />
        </Helmet>
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
      </>
    );
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": deal.title,
    "description": deal.description,
    "image": deal.imageUrl,
    "offers": {
      "@type": "Offer",
      "price": deal.discountedPrice,
      "priceCurrency": "SEK",
      "url": `https://lyxdeal.se/deal/${deal.id}`,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + deal.daysRemaining * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "seller": {
        "@type": "Organization",
        "name": deal.salon?.name || `Salong i ${deal.city}`
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${deal.title} - ${deal.salon?.name || deal.city} | Lyxdeal`}</title>
        <meta name="description" content={`${deal.description.split('\n')[0].substring(0, 150)}... Spara ${deal.originalPrice - deal.discountedPrice} kr på detta erbjudande från ${deal.salon?.name || `salon i ${deal.city}`}.`} />
        <link rel="canonical" href={`https://lyxdeal.se/deal/${deal.id}`} />
        
        <meta property="og:title" content={`${deal.title} - ${deal.salon?.name || deal.city}`} />
        <meta property="og:description" content={`${deal.description.split('\n')[0].substring(0, 150)}... Spara ${deal.originalPrice - deal.discountedPrice} kr.`} />
        <meta property="og:image" content={deal.imageUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://lyxdeal.se/deal/${deal.id}`} />
        <meta property="product:price:amount" content={`${deal.discountedPrice}`} />
        <meta property="product:price:currency" content="SEK" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${deal.title} - ${deal.salon?.name || deal.city}`} />
        <meta name="twitter:description" content={`${deal.description.split('\n')[0].substring(0, 150)}... Spara ${deal.originalPrice - deal.discountedPrice} kr.`} />
        <meta name="twitter:image" content={deal.imageUrl} />
        
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>

      {/* Breadcrumbs added here */}
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
                {/* Category and city badges added here */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <CategoryBadge 
                    category={deal.category} 
                    className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                  />
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    {deal.city}
                  </Badge>
                </div>
                
                <div className="bg-white shadow-sm overflow-hidden">
                  <ResponsiveImage
                    src={deal.imageUrl}
                    alt={deal.title}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                
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

                <div className="bg-white shadow-sm p-6 space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Om {deal.salon?.name || `salongen i ${deal.city}`}</h2>
                  
                  <div className="mt-6">
                    <SalonLocationMap 
                      salonId={deal.salon?.id || null} 
                      city={deal.city} 
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 hidden lg:block">
                <div className="lg:sticky lg:top-8">
                  {/* Add category and city badges to the desktop sidebar version too */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <CategoryBadge 
                      category={deal.category} 
                      className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
                    />
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {deal.city}
                    </Badge>
                  </div>
                  
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
    </>
  );
};

export default ProductDetails;
