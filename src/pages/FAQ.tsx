
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, Tag, ShoppingBag, Calendar, Clock, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function FAQ() {
  const isMobile = useIsMobile();
  
  const faqs = [
    {
      question: "Vad är Lyxdeal?",
      answer: "Lyxdeal är en digital plattform som hjälper kreatörer att skapa innehåll och få gratis skönhetsbehandlingar genom att samarbeta med lokala salonger."
    },
    {
      question: "Hur fungerar Lyxdeal för kreatörer?",
      answer: "Som kreatör kan du ansöka, fylla i ett formulär om ditt konto och dina följare. Efter godkännande får du rabattkoder och möjlighet att skapa autentiskt innehåll om lokala skönhetssalonger på Instagram eller TikTok."
    },
    {
      question: "Vilka krav finns för att bli kreatör?",
      answer: "Vi söker kreatörer med ett genuint intresse för skönhet, ett aktivt Instagram- eller TikTok-konto och en engagerad följarbas. Kvalitet och autenticitet är viktigare än enbart antal följare."
    },
    {
      question: "Hur får jag betalt eller belöningar?",
      answer: "Istället för direkt betalning får du gratis skönhetsbehandlingar och personliga rabattkoder när du skapar innehåll om lokala salonger. Ju mer engagerande innehåll du skapar, desto fler möjligheter."
    },
    {
      question: "Vilka städer kan jag skapa innehåll för?",
      answer: "Just nu fokuserar vi på Stockholm, Göteborg och Malmö. Vi utökar kontinuerligt och letar efter kreatörer i fler städer."
    },
    {
      question: "Hur ofta kan jag få nya uppdrag?",
      answer: "Uppdragsmöjligheterna varierar beroende på tillgängliga salonger och din aktivitetsnivå. Vi rekommenderar att regelbundet skapa högkvalitativt innehåll för att öka dina chanser."
    },
    {
      question: "Hur skyddar ni min integritet?",
      answer: "Vi värnar om din personliga information. All data hanteras konfidentiellt enligt vår integritetspolicy, och du har full kontroll över vilken information du delar."
    },
    {
      question: "Kan jag använda mina rabattkoder själv?",
      answer: "Ja, du kan använda dina personliga rabattkoder för egna behandlingar, vilket ger dig ännu mer värde av samarbetet."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {/* Header Section */}
          <div className="text-center space-y-5 animate-fade-up">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-none bg-primary/10 mb-4">
              <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              Vanliga frågor för kreatörer
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Här hittar du svar på vanliga frågor om att vara kreatör hos Lyxdeal.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="hidden md:grid grid-cols-3 gap-4 animate-fade-up [animation-delay:100ms]">
            {[
              { icon: Tag, title: "Uppdrag", description: "Hur samarbetet fungerar" },
              { icon: ShoppingBag, title: "Belöningar", description: "Gratis behandlingar" },
              { icon: Shield, title: "Integritet", description: "Säkerhet och konfidentialitet" }
            ].map((category, index) => (
              <div 
                key={index} 
                className="bg-white/70 backdrop-blur-sm rounded-none p-4 border border-accent/10 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-none bg-primary/10 mb-3">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-base mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white/70 backdrop-blur-sm rounded-none p-5 sm:p-6 shadow-md border border-accent/10 animate-fade-up [animation-delay:200ms]">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-accent/10 last:border-0"
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-colors text-base sm:text-lg py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Section */}
          <div className="text-center pt-4 sm:pt-8 space-y-5 animate-fade-up [animation-delay:400ms]">
            <p className="text-lg text-muted-foreground">
              Hittade du inte svaret på din fråga?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                className="gap-2 shadow-sm rounded-none"
                size={isMobile ? "sm" : "default"}
              >
                <Link to="mailto:creators@lyxdeal.se">
                  <Mail className="w-4 h-4" />
                  Kontakta kreatörsteamet
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="gap-2 shadow-sm border-accent/20 hover:bg-accent/5 rounded-none"
                size={isMobile ? "sm" : "default"}
              >
                <Link to="/creator/signup">
                  <Tag className="w-4 h-4" />
                  Ansök som kreatör
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

