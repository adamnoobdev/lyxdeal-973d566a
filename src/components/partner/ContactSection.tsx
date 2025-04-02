
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export const ContactSection = () => {
  const handlePartnerClick = () => {
    // Navigera till pricing-section på samma sida
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="contact-section" className="py-10 md:py-16 bg-white">
      <div className="container px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4">Har du frågor?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Kontakta oss gärna om du har frågor om att bli salongspartner eller om du vill ha mer information om våra paket.
            </p>
          </div>

          <Card>
            <CardHeader className="pb-2 md:pb-3">
              <CardTitle className="text-lg md:text-xl">Kontakta oss</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center justify-center text-center space-y-3 md:space-y-4">
                <div className="bg-primary/10 p-3 md:p-4 rounded-full">
                  <Mail className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold">Skicka oss ett mejl</h3>
                <p className="text-gray-600 max-w-md text-sm md:text-base">
                  Vi svarar på dina frågor så snart vi kan. Kontakta oss på:
                </p>
                <a 
                  href="mailto:info@lyxdeal.se"
                  className="text-primary font-semibold text-base md:text-lg hover:underline transition-all"
                >
                  info@lyxdeal.se
                </a>
                <Button 
                  onClick={handlePartnerClick} 
                  className="mt-2 md:mt-4 bg-primary hover:bg-primary/90 text-white text-sm md:text-base"
                >
                  Bli partner idag
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
