
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDeal } from "@/hooks/useDeal";
import { SecureDealForm } from "@/components/deal/SecureDealForm";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, InfoIcon } from "lucide-react";

const SecureDeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deal, isLoading, isError } = useDeal(id);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If this is a direct booking deal, redirect to the booking URL
  useEffect(() => {
    if (deal && deal.requires_discount_code === false && deal.booking_url) {
      window.open(deal.booking_url, '_blank');
      navigate(`/deal/${id}`);
    }
  }, [deal, id, navigate]);
  
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Kunde inte hitta erbjudandet. Det kan ha tagits bort eller så har ett fel uppstått.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till startsidan
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse max-w-6xl mx-auto">
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // If this is a direct booking deal, show an info message
  if (deal.requires_discount_code === false) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/deal/${id}`)}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till erbjudandet
            </Button>
            
            <Alert variant="default" className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Direkt bokning</AlertTitle>
              <AlertDescription>
                Detta erbjudande använder direkt bokning. Vi försöker öppna bokningslänken i en ny flik.
              </AlertDescription>
            </Alert>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <h2 className="text-xl font-semibold mb-4">Klicka på knappen nedan för att boka</h2>
              <Button 
                onClick={() => window.open(deal.booking_url, '_blank')}
                className="w-full py-6"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Boka direkt hos salongen
              </Button>
              <p className="mt-4 text-sm text-gray-500">
                Om fönstret inte öppnades automatiskt, klicka på knappen ovan.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/deal/${id}`)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till erbjudandet
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
              <h1 className="text-xl md:text-2xl font-bold mb-4">{deal.title}</h1>
              
              <div className="aspect-[4/3] overflow-hidden rounded-lg mb-6">
                <ResponsiveImage
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <PriceDisplay
                  originalPrice={deal.originalPrice}
                  discountedPrice={deal.discountedPrice}
                  className="text-lg"
                />
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm w-fit">
                  {deal.daysRemaining} dagar kvar
                </span>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Det här ingår:</h3>
                <ul className="space-y-2">
                  {deal.description.split('\n').map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <SecureDealForm 
                dealId={deal.id} 
                dealTitle={deal.title}
                onSuccess={() => {}}
                requiresDiscountCode={deal.requires_discount_code}
                bookingUrl={deal.booking_url}
              />
              
              <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Så här fungerar det:</h3>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <p className="text-gray-700">Fyll i dina uppgifter och säkra erbjudandet</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <p className="text-gray-700">Du får en unik rabattkod via e-post direkt</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <p className="text-gray-700">Visa rabattkoden i salongen inom 72 timmar</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureDeal;
