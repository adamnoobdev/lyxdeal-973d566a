
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckCircle, MoveRight, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Helmet } from "react-helmet";
import { Separator } from "@/components/ui/separator";
import { useSubscriptionDetails } from "@/hooks/useSubscriptionDetails";
import { PurchaseDetailsComponent } from "@/components/subscription/PurchaseDetails";
import { LoadingState } from "@/components/subscription/LoadingState";
import { ErrorDisplay } from "@/components/subscription/ErrorDisplay";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  
  const {
    purchaseDetails,
    salonAccount,
    loading,
    error,
    isRetrying,
    timeElapsed,
    manualRetry
  } = useSubscriptionDetails(sessionId);

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
            {error && <ErrorDisplay error={error} />}
            
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
                <LoadingState />
              ) : (
                <PurchaseDetailsComponent 
                  purchaseDetails={purchaseDetails}
                  salonAccount={salonAccount}
                  isRetrying={isRetrying}
                  timeElapsed={timeElapsed}
                  onRetry={manualRetry}
                />
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
