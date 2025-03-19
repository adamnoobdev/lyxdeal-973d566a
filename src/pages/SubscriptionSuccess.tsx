
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/salon-login");
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <CardTitle className="text-2xl lg:text-3xl">Prenumeration genomförd!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-700">
              Ditt konto har skapats och vi har skickat inloggningsuppgifter till din e-post. 
              Kontrollera din inkorg (och spamkorg) för instruktioner om hur du loggar in på ditt nya salongskonto.
            </p>
            
            <p className="text-gray-700 mt-4">
              Du kommer automatiskt att omdirigeras till inloggningssidan om {countdown} sekunder.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => navigate("/salon-login")}
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
