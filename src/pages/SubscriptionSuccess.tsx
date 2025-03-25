
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
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
  const [isRetrying, setIsRetrying] = useState(false);
  const [salonAccount, setSalonAccount] = useState<any>(null);

  const sessionId = searchParams.get("session_id");

  const manualRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
  };

  // Hämta information om köpet från partner_requests
  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (!sessionId) {
        setError("Inget sessionID hittades");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching purchase details for session:", sessionId);
        console.log("Retry count:", retryCount);
        
        // Hämta partnerförfrågan som är associerad med detta köp
        const { data: partnerRequests, error: partnerError } = await supabase
          .from("partner_requests")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(5);

        if (partnerError) {
          console.error("Fel vid hämtning av partnerförfrågan:", partnerError);
          throw partnerError;
        }

        console.log("Found partner requests:", partnerRequests?.length || 0);
        
        if (partnerRequests && partnerRequests.length > 0) {
          // Find the most recently approved partner request
          const mostRecent = partnerRequests[0];
          setPurchaseDetails(mostRecent);
          console.log("Hittade partnerförfrågan:", mostRecent);
          
          // Check if a salon account exists for this email
          if (mostRecent.email) {
            console.log("Checking for salon account with email:", mostRecent.email);
            const { data: salonData, error: salonError } = await supabase
              .from("salons")
              .select("*")
              .eq("email", mostRecent.email)
              .maybeSingle();
              
            if (salonError && !salonError.message.includes("No rows found")) {
              console.error("Error checking salon account:", salonError);
            } else if (salonData) {
              console.log("Found salon account:", salonData.id);
              setSalonAccount(salonData);
              toast.success("Ditt salongskonto har skapats!");
            } else {
              console.log("No salon account found yet");
              if (retryCount < 10) {
                // Schedule another retry
                const timer = setTimeout(() => {
                  setRetryCount(prev => prev + 1);
                }, 3000); // Retry every 3 seconds
                return () => clearTimeout(timer);
              } else {
                toast.info("Kunde inte hitta ditt salongskonto ännu. Det kan ta några minuter innan det skapas.");
              }
            }
          }
        } else {
          console.log("Inga godkända partnerförfrågningar hittades. Retry count:", retryCount);
          // Om vi inte har någon godkänd förfrågan ännu och är under max försök, försök igen
          if (retryCount < 10) {
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
        setIsRetrying(false);
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
        
        {salonAccount ? (
          <Alert className="mt-4 bg-green-50 border-green-200">
            <AlertTitle className="text-green-800">Konto skapat!</AlertTitle>
            <AlertDescription className="text-green-700">
              Ditt salongskonto har skapats framgångsrikt. Du kan nu logga in med den e-post och det lösenord som skickats till din e-postadress.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="mt-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTitle className="flex items-center text-yellow-800">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Kontoskapande pågår
              </AlertTitle>
              <AlertDescription className="text-yellow-700">
                Ditt konto håller på att skapas. Detta kan ta upp till några minuter. Du kommer att få ett e-postmeddelande med inloggningsuppgifter.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={manualRetry}
                disabled={isRetrying}
                className="flex items-center gap-2"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Kontrollerar...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Kontrollera igen
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
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
                Din betalning har genomförts och ditt konto håller på att skapas. Du kommer att få ett e-postmeddelande 
                med inloggningsuppgifter till den e-postadress du angav under registreringen.
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
                  <div className="flex justify-center mb-2">
                    <RefreshCw className="h-8 w-8 text-purple-500 animate-spin" />
                  </div>
                  <p className="text-sm text-gray-500">Hämtar prenumerationsdetaljer...</p>
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
