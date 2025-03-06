
import { Helmet } from "react-helmet";
import { PartnerHero } from "@/components/partner/PartnerHero";
import { PartnerFeatures } from "@/components/partner/PartnerFeatures";
import { PricingSection } from "@/components/partner/PricingSection";
import { TestimonialSection } from "@/components/partner/TestimonialSection";
import { ContactSection } from "@/components/partner/ContactSection";

const PartnerPage = () => {
  return (
    <>
      <Helmet>
        <title>Bli salongspartner | Lyxdeal</title>
        <meta name="description" content="Väx din salongsverksamhet genom att bli partner med Lyxdeal. Nå nya kunder, öka din synlighet och maximera din försäljning." />
      </Helmet>

      <div className="min-h-screen">
        <PartnerHero />
        <PartnerFeatures />
        <PricingSection />
        <TestimonialSection />
        <ContactSection />
      </div>
    </>
  );
};

export default PartnerPage;
