
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "../ui/loading-button";
import { submitPartnerRequest } from "@/hooks/usePartnerRequests";

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use the custom function to submit partner request (without plan data)
      const { success, error } = await submitPartnerRequest({
        name: formData.name,
        business_name: formData.business,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      
      if (!success) throw new Error(error);
      
      // Show success message
      toast.success("Tack för ditt meddelande! Vi kontaktar dig inom kort.");
      
      // Reset form
      setFormData({
        name: "",
        business: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Kontaktformulär</CardTitle>
            </CardHeader>
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
                  Skicka meddelande
                </LoadingButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
