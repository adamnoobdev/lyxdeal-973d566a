
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, RefreshCw, Loader2, MoveRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { toast } from "sonner";
import { separator } from "@/components/ui/separator";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [salonAccount, setSalonAccount] = useState<any>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const sessionId = searchParams.get("session_id");
  const maxRetries = 20; // Allow more retries
  const retryDelay = 3000; // 3 seconds between retries

  const manualRetry = () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    toast.info("Kontrollerar kontostatus...");
  };

  // Start a timer to show time elapsed since page load
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Hämta information om köpet från partner_requests
  useEffect(() => {
    const fetchPurchaseDetails = async () => {
      if (!sessionId) {
        console.warn("No session ID found in URL");
        setError("Inget sessionID hittades");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching purchase details for session:", sessionId);
        console.log("Retry count:", retryCount);
        
        // Try to find the most recent partner request that's been approved
        const { data: partnerRequests, error: partnerError } = await supabase
          .from("partner_requests")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(10);

        if (partnerError) {
          console.error("Error fetching partner requests:", partnerError);
          throw partnerError;
        }

        console.log("Found partner requests:", partnerRequests?.length || 0);
        
        if (partnerRequests && partnerRequests.length > 0) {
          // Find the most recently approved partner request
          const mostRecent = partnerRequests[0];
          setPurchaseDetails(mostRecent);
          console.log("Found partner request:", mostRecent);
          
          // Check if a salon account exists for this email
          if (mostRecent.email) {
            console.log("Checking for salon account with email:", mostRecent.email);
            
            // Try to find a matching salon with the email
            const { data: salonData, error: salonError } = await supabase
              .from("salons")
              .select("*")
              .eq("email", mostRecent.email)
              .limit(1);
              
            if (salonError) {
              console.error("Error checking salon account:", salonError);
            } else if (salonData && salonData.length > 0) {
              console.log("Found salon account:", salonData[0].id);
              setSalonAccount(salonData[0]);
              toast.success("Ditt salongskonto har skapats!");
            } else {
              console.log("No salon account found yet with email:", mostRecent.email);
              
              // If we haven't found a salon yet and haven't exceeded max retries, try again
              if (retryCount < maxRetries) {
                const timer = setTimeout(() => {
                  setRetryCount(prev => prev + 1);
                  setIsRetrying(false);
                }, retryDelay);
                return () => clearTimeout(timer);
              } else {
                console.warn("Max retries reached, still no salon account found");
                toast.error("Kunde inte hitta ditt salongskonto efter flera försök. Vänligen kontakta kundtjänst.");
              }
            }
          }
        } else {
          console.log("No approved partner requests found. Retry count:", retryCount);
          
          // If we don't have any approved requests yet and haven't exceeded max retries, try again
          if (retryCount < maxRetries / 2) { // Use fewer retries for this initial check
            const timer = setTimeout(() => {
              setRetryCount(prev => prev + 1);
              setIsRetrying(false);
            }, retryDelay);
            return () => clearTimeout(timer);
          } else {
            // After max retries, continue anyway but show info that details couldn't be retrieved
            toast.info("Kunde inte hämta alla detaljer om din prenumeration, men din betalning har gått igenom.");
          }
        }
      } catch (err) {
        console.error("Error fetching purchase details:", err);
        setError("Kunde inte hämta detaljer om din prenumeration");
      } finally {
        setLoading(false);
        setIsRetrying(false);
      }
    };

    if (loading || isRetrying || (retryCount > 0 && !salonAccount)) {
      fetchPurchaseDetails();
    }
  }, [sessionId, retryCount, loading, isRetrying, salonAccount]);

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
            <CheckCircle className="h-4 w-4 text-green-600" />
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
                <p>Ditt konto håller på att skapas. Detta kan ta upp till några minuter. Du kommer att få ett e-postmeddelande med inloggningsuppgifter.</p>
                <p className="mt-1 text-xs">Tid som passerat: {timeElapsed} sekunder</p>
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
                    <Loader2 className="h-4 w-4 animate-spin" />
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
                    <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
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
              className="w-full flex items-center justify-center gap-2"
            >
              <span>Gå till inloggning</span>
              <MoveRight className="h-4 w-4" />
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
