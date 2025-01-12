import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      question: "Hur fungerar betalningen?",
      answer: "Vi använder säkra betalningslösningar genom Stripe. Du kan betala med de vanligaste betalkorten och betalningen är alltid krypterad och säker."
    },
    {
      question: "Kan jag avboka min behandling?",
      answer: "Ja, du kan avboka din behandling upp till 24 timmar innan bokad tid. Kontakta salongen direkt för avbokning."
    },
    {
      question: "Hur länge gäller erbjudandena?",
      answer: "Varje erbjudande har en specifik giltighetstid som tydligt visas på erbjudandet. När tiden går ut kan erbjudandet inte längre köpas."
    },
    {
      question: "Vad händer om jag är missnöjd med min behandling?",
      answer: "Vi tar kundnöjdhet på största allvar. Kontakta först salongen direkt för att diskutera din upplevelse. Om du fortfarande är missnöjd, kontakta vår kundtjänst så hjälper vi dig."
    },
    {
      question: "Hur vet jag att salongen är kvalitetssäkrad?",
      answer: "Alla salonger på vår plattform genomgår en noggrann kvalitetskontroll innan de får börja sälja sina tjänster. Vi kontrollerar licenser, certifieringar och kundrecensioner."
    },
    {
      question: "Kan jag ge recensioner efter min behandling?",
      answer: "Ja, efter genomförd behandling kan du lämna en recension på salongen och behandlingen. Detta hjälper andra kunder att göra informerade val."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/5 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6 animate-fade-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Vanliga frågor
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Här hittar du svar på de vanligaste frågorna om våra tjänster och hur allt fungerar.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-accent/10 animate-fade-up [animation-delay:200ms]">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-accent/10 last:border-0"
                >
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact Section */}
          <div className="text-center pt-8 space-y-4 animate-fade-up [animation-delay:400ms]">
            <p className="text-muted-foreground text-lg">
              Hittade du inte svaret på din fråga?
            </p>
            <a 
              href="mailto:support@lyxdeal.se" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Kontakta vår kundtjänst
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}