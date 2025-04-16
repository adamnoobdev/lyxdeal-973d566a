
import { Helmet } from "react-helmet";
import { CreatorHero } from "@/components/creator/CreatorHero";
import { CreatorFeatures } from "@/components/creator/CreatorFeatures";
import { HowItWorksSection } from "@/components/creator/HowItWorksSection";
import { FAQSection } from "@/components/creator/FAQSection";
import { ContactSection } from "@/components/creator/ContactSection";

const CreatorPage = () => {
  return (
    <>
      <Helmet>
        <title>Bli kreatör | Lyxdeal</title>
        <meta name="description" content="Väx ditt personliga varumärke genom att bli kreatör med Lyxdeal. Nå nya följare och tjäna pengar på dina rekommendationer." />
      </Helmet>

      <div className="min-h-screen">
        {/* Introduction */}
        <CreatorHero />
        
        {/* Benefits */}
        <CreatorFeatures />
        
        {/* How it works */}
        <HowItWorksSection />
        
        {/* FAQ & Contact */}
        <FAQSection />
        <ContactSection />
      </div>
    </>
  );
};

export default CreatorPage;
