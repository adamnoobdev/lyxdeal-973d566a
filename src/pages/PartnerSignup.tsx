
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { submitPartnerRequest } from "@/hooks/usePartnerRequests";

interface SelectedPlan {
  title: string;
  paymentType: 'monthly' | 'yearly';
  price: number;
  dealCount: number;
}

const PartnerSignup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
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
  
  // Effekt för att hantera omdirigering om URL finns
  useEffect(() => {
    if (redirectUrl) {
      console.log("Attempting redirect in useEffect to:", redirectUrl);
      performRedirect(redirectUrl);
    }
  }, [redirectUrl]);
  
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const performRedirect = (url: string) => {
    console.log("Performing redirect to:", url);
    
    // Visa toast innan omdirigering
    toast.success("Omdirigerar till betalning...");
    
    try {
      // Metod 1: Öppna i samma fönster
      window.location.href = url;
      
      // Metod 2: Fallback efter kort fördröjning
      setTimeout(() => {
        console.log("Fallback redirect method 1");
        window.location.replace(url);
      }, 1000);
      
      // Metod 3: Andra fallback med window.open
      setTimeout(() => {
        console.log("Fallback redirect method 2");
        window.open(url, "_self");
      }, 2000);
      
      // Metod 4: Skapa och klicka på en länk som sista utväg
      setTimeout(() => {
        console.log("Fallback redirect method 3 - creating a link");
        const link = document.createElement('a');
        link.href = url;
        link.target = "_self";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
      }, 3000);
    } catch (error) {
      console.error("Error during redirect:", error);
      
      // Visa en manuell knapp som användaren kan klicka på
      toast.error("Kunde inte omdirigera automatiskt. Klicka på knappen nedan.", {
        duration: 10000,
        action: {
          label: "Gå till betalning",
          onClick: () => window.open(url, "_blank")
        }
      });
      
      // Visa betalnings-URL i konsolen så att vi kan felsöka
      console.log("Payment URL (for manual navigation):", url);
      
      // Visa fallback-knapp på sidan
      setRedirectUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!selectedPlan) {
        toast.error("Inget paket valt");
        setIsSubmitting(false);
        return;
      }
      
      // Validera formulärdata
      if (!formData.name || !formData.business || !formData.email || !formData.phone) {
        toast.error("Vänligen fyll i alla fält");
        setIsSubmitting(false);
        return;
      }
      
      // Validera e-postformatet
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Vänligen ange en giltig e-postadress");
        setIsSubmitting(false);
        return;
      }
      
      // Validera telefonnummerformat (grundläggande kontroll)
      if (formData.phone.length < 7) {
        toast.error("Vänligen ange ett giltigt telefonnummer");
        setIsSubmitting(false);
        return;
      }
      
      console.log("Submitting form data:", {
        ...formData,
        plan: selectedPlan
      });
      
      // Submit partner request
      const result = await submitPartnerRequest({
        name: formData.name,
        business_name: formData.business,
        email: formData.email,
        phone: formData.phone,
        message: "", // No message needed for signup
        plan_title: selectedPlan.title,
        plan_payment_type: selectedPlan.paymentType,
        plan_price: selectedPlan.price,
        plan_deal_count: selectedPlan.dealCount
      });
      
      console.log("Partner request result:", result);
      
      if (!result.success) {
        throw new Error(result.error || "Ett fel uppstod");
      }
      
      if (result.redirectUrl) {
        // Spara URL för att hantera i useEffect
        setRedirectUrl(result.redirectUrl);
        
        // Redirect to Stripe checkout direkt
        console.log("Redirecting to Stripe:", result.redirectUrl);
        toast.success("Du skickas nu till betalningssidan");
        
        // Vänta en sekund så toast hinner visas
        setTimeout(() => {
          performRedirect(result.redirectUrl!);
        }, 1000);
      } else {
        // If no payment required (free plan)
        toast.success("Tack för din registrering! Vi kontaktar dig inom kort.");
        navigate('/partner');
      }
    } catch (error) {
      console.error("Error submitting partner request:", error);
      toast.error(error instanceof Error ? error.message : "Ett fel uppstod. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              
              {selectedPlan && (
                <div className="mt-4 p-4 bg-primary-50 border border-primary/20 rounded-md inline-block">
                  <h2 className="font-semibold text-xl text-primary-700">
                    {selectedPlan.title}
                  </h2>
                  <p className="text-gray-700">
                    {selectedPlan.paymentType === 'monthly' ? 'Månadsbetalning' : 'Årsbetalning'}: 
                    {' '}<span className="font-semibold">{selectedPlan.price} SEK</span>
                  </p>
                  <p className="text-sm mt-1">
                    {selectedPlan.dealCount} erbjudande{selectedPlan.dealCount > 1 ? 'n' : ''}
                  </p>
                </div>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Fyll i dina uppgifter</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Namn</label>
                      <Input 
                        id="name" 
                        placeholder="Ditt namn" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="business" className="text-sm font-medium">Företagsnamn</label>
                      <Input 
                        id="business" 
                        placeholder="Ditt företag" 
                        value={formData.business}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">E-post</label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="din@email.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">Telefon</label>
                      <Input 
                        id="phone" 
                        placeholder="Ditt telefonnummer" 
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <LoadingButton 
                      type="submit" 
                      className="flex-1"
                      loading={isSubmitting}
                    >
                      Fortsätt till betalning
                    </LoadingButton>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/partner')}
                    >
                      Avbryt
                    </Button>
                  </div>
                </form>
                
                {/* Manuell omdirigering om automatisk omdirigering misslyckas */}
                {redirectUrl && (
                  <div className="mt-6 p-4 border border-orange-300 bg-orange-50 rounded-md">
                    <p className="text-orange-800 mb-3">
                      Om du inte omdirigeras automatiskt, klicka på knappen nedan för att fortsätta till betalning:
                    </p>
                    <Button 
                      onClick={() => window.open(redirectUrl, "_blank")}
                      className="w-full bg-orange-500 hover:bg-orange-600"
                    >
                      Fortsätt till betalning manuellt
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartnerSignup;
