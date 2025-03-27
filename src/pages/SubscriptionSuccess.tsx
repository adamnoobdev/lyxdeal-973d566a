
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { useSubscriptionDetails } from "@/hooks/subscription/useSubscriptionDetails";
import { PurchaseDetailsComponent } from "@/components/subscription/PurchaseDetails";
import { LoadingState } from "@/components/subscription/LoadingState";
import { ErrorDisplay } from "@/components/subscription/ErrorDisplay";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
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

  console.log("Rendering SubscriptionSuccess with session ID:", sessionId);
  console.log("Purchase details:", purchaseDetails);
  console.log("Salon account:", salonAccount);
  console.log("Loading state:", loading);
  console.log("Error state:", error);

  return (
    <>
      <Helmet>
        <title>Prenumeration genomförd | Lyxdeal</title>
        <meta name="description" content="Din prenumeration har genomförts. Kontrollera din e-post för inloggningsuppgifter." />
      </Helmet>
    
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-md">
          <CardContent className="p-6 md:p-8">
            {error && <ErrorDisplay error={error} />}
            
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
