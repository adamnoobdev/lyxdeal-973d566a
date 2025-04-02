
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
      answer: "Lyxdeal är en plattform där du kan hitta exklusiva rabattkoder till salongtjänster. Vi samarbetar med kvalitetssäkrade salonger för att erbjuda dig bästa möjliga priser på skönhetsbehandlingar."
    },
    {
      question: "Hur fungerar Lyxdeal?",
      answer: "Det är enkelt! Bläddra bland våra erbjudanden, välj det du är intresserad av och säkra din rabattkod. Rabattkoden kan sedan användas direkt på salongen när du bokar din behandling."
    },
    {
      question: "Hur använder jag min rabattkod?",
      answer: "När du har valt och säkrat en rabattkod får du den direkt. Kontakta sedan salongen direkt för att boka din tid och uppge din rabattkod. Salongens kontaktuppgifter finns alltid på erbjudandet."
    },
    {
      question: "Hur länge är rabattkoderna giltiga?",
      answer: "Varje rabattkod har en specifik giltighetstid som tydligt visas på erbjudandet. Vanligtvis är våra koder giltiga i 3-6 månader från köpdatum, vilket ger dig gott om tid att boka din behandling."
    },
    {
      question: "Kan jag avboka en bokad tid?",
      answer: "Ja, du kan avboka din bokade tid direkt med salongen enligt deras avbokningsregler. Observera att din rabattkod fortfarande är giltig för en ny bokning inom giltighetstiden."
    },
    {
      question: "Hur vet jag att salongen är kvalitetssäkrad?",
      answer: "Alla salonger på Lyxdeal genomgår en noggrann kvalitetskontroll innan de får erbjuda sina tjänster på vår plattform. Vi kontrollerar licenser, certifieringar och kundrecensioner för att säkerställa att du får en kvalitetsupplevelse."
    },
    {
      question: "Vad händer om jag är missnöjd med min behandling?",
      answer: "Vi tar kundnöjdhet på största allvar. Kontakta först salongen direkt för att diskutera din upplevelse. Om du fortfarande är missnöjd, kontakta vår kundtjänst via e-post så hjälper vi dig att lösa situationen."
    },
    {
      question: "Kan jag få flera rabattkoder till samma erbjudande?",
      answer: "Ja, du kan säkra flera rabattkoder till samma erbjudande, antingen för eget bruk eller som present till vänner och familj. Varje kod har sin egen unika kod och giltighetstid."
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
              Vanliga frågor
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Här hittar du svar på vanliga frågor om Lyxdeal och hur våra rabattkoder fungerar.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="hidden md:grid grid-cols-3 gap-4 animate-fade-up [animation-delay:100ms]">
            {[
              { icon: Tag, title: "Rabattkoder", description: "Så fungerar våra erbjudanden" },
              { icon: ShoppingBag, title: "Bokningar", description: "Boka hos salongen" },
              { icon: Shield, title: "Trygghet", description: "Kvalitetssäkrade tjänster" }
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
                <Link to="mailto:support@lyxdeal.se">
                  <Mail className="w-4 h-4" />
                  Kontakta kundtjänst
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="gap-2 shadow-sm border-accent/20 hover:bg-accent/5 rounded-none"
                size={isMobile ? "sm" : "default"}
              >
                <Link to="/partner">
                  <Tag className="w-4 h-4" />
                  Se våra erbjudanden
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
