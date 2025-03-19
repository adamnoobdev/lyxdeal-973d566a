
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent } from "../ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LoadingButton } from "../ui/loading-button";

interface SelectedPlan {
  title: string;
  paymentType: 'monthly' | 'yearly';
  price: number;
  dealCount: number;
}

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    message: ""
  });

  // Load selected plan from localStorage
  useEffect(() => {
    const storedPlan = localStorage.getItem('selectedPlan');
    if (storedPlan) {
      try {
        setSelectedPlan(JSON.parse(storedPlan));
      } catch (e) {
        console.error("Error parsing stored plan:", e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create partner request in database
      const { error } = await supabase
        .from('partner_requests')
        .insert([
          { 
            name: formData.name,
            business_name: formData.business,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            plan_title: selectedPlan?.title || null,
            plan_payment_type: selectedPlan?.paymentType || null,
            plan_price: selectedPlan?.price || null,
            plan_deal_count: selectedPlan?.dealCount || null
          }
        ]);
      
      if (error) throw error;
      
      toast.success("Tack för din förfrågan! Vi kontaktar dig inom kort.");
      setFormData({
        name: "",
        business: "",
        email: "",
        phone: "",
        message: ""
      });
      
      // Clear selected plan
      localStorage.removeItem('selectedPlan');
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error submitting partner request:", error);
      toast.error("Ett fel uppstod. Försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-section" className="py-16 bg-white">
      <div className="container px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Har du frågor?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kontakta oss gärna om du har frågor om att bli salongspartner eller om du vill ha mer information om våra paket.
            </p>
            {selectedPlan && (
              <div className="mt-4 p-3 bg-primary-50 border border-primary/20 rounded-md inline-block">
                <p className="font-medium">Du har valt: {selectedPlan.title}</p>
                <p className="text-sm text-gray-600">
                  {selectedPlan.paymentType === 'monthly' ? 'Månadsbetalning' : 'Årsbetalning'}: 
                  {' '}{selectedPlan.price} SEK
                </p>
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
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
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Meddelande</label>
                  <Textarea 
                    id="message" 
                    placeholder="Skriv ditt meddelande här..." 
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <LoadingButton 
                  type="submit" 
                  className="w-full"
                  loading={isSubmitting}
                >
                  {selectedPlan ? 'Skicka förfrågan om partnerskap' : 'Skicka meddelande'}
                </LoadingButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
