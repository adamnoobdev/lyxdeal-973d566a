
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { toast } from "sonner";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const sessionId = searchParams.get("session_id");

  // Hämta information om köpet från partner_requests
  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (!sessionId) {
        setError("Inget sessionID hittades");
        setLoading(false);
        return;
      }

      try {
        // Hämta partnerförfrågan som är associerad med detta köp
        const { data: partnerRequests, error: partnerError } = await supabase
          .from("partner_requests")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(1);

        if (partnerError) {
          console.error("Fel vid hämtning av partnerförfrågan:", partnerError);
          throw partnerError;
        }

        if (partnerRequests && partnerRequests.length > 0) {
          setPurchaseDetails(partnerRequests[0]);
          console.log("Hittade partnerförfrågan:", partnerRequests[0]);
        } else {
          console.log("Inga godkända partnerförfrågningar hittades");
          // Om vi inte har någon godkänd förfrågan ännu och är under max försök, försök igen
          if (retryCount < 3) {
            const timer = setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 3000); // Vänta 3 sekunder mellan försök
            return () => clearTimeout(timer);
          } else {
            // Efter max försök, fortsätt ändå men visa info om att detaljerna inte kunde hämtas
            toast.info("Kunde inte hämta alla detaljer om din prenumeration, men din betalning har gått igenom.");
          }
        }
      } catch (err) {
        console.error("Fel vid hämtning av köpdetaljer:", err);
        setError("Kunde inte hämta detaljer om din prenumeration");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [sessionId, retryCount]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sv-SE');
  };

  const renderPurchaseDetails = () => {
    if (!purchaseDetails) return null;
    
    const today = new Date();
    
    return (
      <div className="space-y-4 mt-4 border rounded-md p-4 bg-gray-50">
        <h3 className="text-lg font-medium">Prenumerationsdetaljer</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="font-medium">Företag:</p>
            <p>{purchaseDetails.business_name}</p>
          </div>
          
          <div>
            <p className="font-medium">Plan:</p>
            <p>{purchaseDetails.plan_title || 'Standard'}</p>
          </div>
          
          <div>
            <p className="font-medium">Betalningstyp:</p>
            <p>{purchaseDetails.plan_payment_type === 'yearly' ? 'Årsvis' : 'Månadsvis'}</p>
          </div>
          
          <div>
            <p className="font-medium">Startdatum:</p>
            <p>{formatDate(today)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Prenumeration genomförd | Lyxdeal</title>
        <meta name="description" content="Din prenumeration har genomförts. Kontrollera din e-post för inloggningsuppgifter." />
      </Helmet>
    
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <CardTitle className="text-2xl lg:text-3xl">Prenumeration genomförd!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Ett fel uppstod</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="text-center space-y-2">
              <p className="text-gray-700">
                Ditt konto har skapats och vi har skickat inloggningsuppgifter till din e-post. 
                Kontrollera din inkorg (och spamkorg) för instruktioner om hur du loggar in på ditt nya salongskonto.
              </p>
              
              <Alert className="mt-4 bg-blue-50 border-blue-200">
                <AlertTitle className="flex items-center text-blue-800">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Viktigt
                </AlertTitle>
                <AlertDescription className="text-blue-800">
                  Om du inte hittar mejlet inom några minuter, kontrollera din spammapp. Om du fortfarande inte hittar det, kontakta oss på info@lyxdeal.se.
                </AlertDescription>
              </Alert>
              
              {loading ? (
                <div className="py-4 text-center">
                  <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              ) : (
                renderPurchaseDetails()
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2 pt-2">
            <Button 
              onClick={() => navigate("/salon/login")}
              className="w-full"
            >
              Gå till inloggning
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Gå till startsidan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
