
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PlanSummary } from "@/components/partner/PlanSummary";
import { PartnerForm } from "@/components/partner/PartnerForm";

interface SelectedPlan {
  title: string;
  paymentType: 'monthly' | 'yearly';
  price: number;
  dealCount: number;
}

const PartnerSignup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract plan info from URL parameters
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  
  useEffect(() => {
    const title = searchParams.get('plan');
    const paymentType = searchParams.get('type') as 'monthly' | 'yearly';
    const price = Number(searchParams.get('price'));
    const dealCount = Number(searchParams.get('deals'));
    
    if (title && paymentType && price && dealCount) {
      setSelectedPlan({
        title,
        paymentType,
        price,
        dealCount
      });
    } else {
      // If no valid plan info, redirect back to partner page
      toast.error("Inget paket valdes. Vänligen försök igen.");
      navigate('/partner');
    }
  }, [searchParams, navigate]);

  return (
    <>
      <Helmet>
        <title>Bli salongspartner | Lyxdeal</title>
        <meta name="description" content="Registrera dig som salongspartner på Lyxdeal" />
      </Helmet>
      
      <div className="py-12 md:py-16 bg-gray-50">
        <div className="container px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Bli salongspartner</h1>
              
              <PlanSummary 
                plan={selectedPlan} 
                className="mx-auto transition-all duration-300 animate-fade-up" 
              />
            </div>

            <Card className="shadow-lg animate-fade-up" style={{ animationDelay: "100ms" }}>
              <CardHeader>
                <CardTitle className="text-xl">Fyll i dina uppgifter</CardTitle>
              </CardHeader>
              <CardContent>
                <PartnerForm selectedPlan={selectedPlan} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerSignup;
