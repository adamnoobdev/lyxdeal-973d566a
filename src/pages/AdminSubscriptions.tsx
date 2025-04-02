
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SalonLayout } from "@/components/salon/layout/SalonLayout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PlanInfo {
  name: string;
  price: number;
  currency: string;
  interval: string;
  price_id: string;
}

const AdminSubscriptions = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [existingPlans, setExistingPlans] = useState<PlanInfo[]>([]);
  const [createdPlans, setCreatedPlans] = useState<PlanInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const verifyPlans = async () => {
    setIsVerifying(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-stripe-plans');
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.success) {
        setExistingPlans(data.existingPlans || []);
        setCreatedPlans(data.createdPlans || []);
        toast.success("Prenumerationsplaner verifierade");
      } else {
        throw new Error(data.error || "Ett okänt fel inträffade");
      }
    } catch (err) {
      console.error("Error verifying plans:", err);
      setError(err.message || "Ett fel inträffade vid verifiering av prenumerationsplaner");
      toast.error(err.message || "Ett fel inträffade vid verifiering av prenumerationsplaner");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SalonLayout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Hantera Prenumerationsplaner</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Verifiera Stripe-planer</CardTitle>
              <CardDescription>
                Kontrollera att Stripe-planer är korrekt uppsatta och skapa saknade planer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Detta verktyg verifierar att alla prenumerationsplaner är korrekt uppsatta i Stripe.
                Saknade planer kommer att skapas automatiskt.
              </p>
              
              {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                  <p>{error}</p>
                </div>
              )}
              
              {existingPlans.length > 0 && (
                <div className="mt-4 mb-8">
                  <h3 className="text-lg font-medium mb-2">Befintliga planer</h3>
                  <div className="space-y-2">
                    {existingPlans.map((plan, index) => (
                      <div key={index} className="p-3 bg-secondary/10 rounded-md">
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {plan.price} {plan.currency.toUpperCase()} / {plan.interval}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {plan.price_id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {createdPlans.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Skapade planer</h3>
                  <div className="space-y-2">
                    {createdPlans.map((plan, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-sm text-green-700">
                          {plan.price} {plan.currency.toUpperCase()} / {plan.interval}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {plan.price_id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={verifyPlans} 
                disabled={isVerifying}
                className="w-full md:w-auto"
              >
                {isVerifying ? "Verifierar..." : "Verifiera Planer"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SalonLayout>
  );
};

export default AdminSubscriptions;
