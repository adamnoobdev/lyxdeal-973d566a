
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [purchaseDetails, setPurchaseDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        // Detta är en förenklad implementation - i verkligheten skulle vi behöva spara session_id i databasen
        const { data: partnerRequests, error: partnerError } = await supabase
          .from("partner_requests")
          .select("*")
          .eq("status", "approved")
          .order("created_at", { ascending: false })
          .limit(1);

        if (partnerError) {
          throw partnerError;
        }

        if (partnerRequests && partnerRequests.length > 0) {
          setPurchaseDetails(partnerRequests[0]);
        }
      } catch (err) {
        console.error("Fel vid hämtning av köpdetaljer:", err);
        setError("Kunde inte hämta detaljer om din prenumeration");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseDetails();
  }, [sessionId]);

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
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="text-center space-y-2">
            <p className="text-gray-700">
              Ditt konto har skapats och vi har skickat inloggningsuppgifter till din e-post. 
              Kontrollera din inkorg (och spamkorg) för instruktioner om hur du loggar in på ditt nya salongskonto.
            </p>
            
            {!loading && renderPurchaseDetails()}
          </div>

          <div className="flex flex-col space-y-2">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
