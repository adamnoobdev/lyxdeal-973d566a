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
import { Helmet } from "react-helmet";

const ProductDetails = () => {
  const { id } = useParams();
  const { data: deal, isLoading, isError } = useDeal(id);

  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]); // Added id as dependency to ensure scroll on navigation between products

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

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
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
                  <h2 className="text-xl font-semibold mb-4">Om {deal.salon?.name || "salongen"}</h2>
                  
                  <div className="mt-6">
                    <SalonLocationMap 
                      address={deal.salon?.address || deal.city || ""}
                      salonName={deal.salon?.name || `Salong i ${deal.city}`}
                      salonPhone={deal.salon?.phone}
                      city={deal.city}
                      hideAddress={false}
                    />
                  </div>
                </div>
              </div>

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
    </>
  );
};

export default ProductDetails;
