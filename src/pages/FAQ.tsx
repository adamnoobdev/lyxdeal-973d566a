import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Vanliga frågor</h1>
          <p className="text-muted-foreground">
            Här hittar du svar på de vanligaste frågorna om våra tjänster och hur allt fungerar.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center pt-8">
          <p className="text-muted-foreground">
            Hittade du inte svaret på din fråga?{" "}
            <a href="mailto:support@lyxdeal.se" className="text-primary hover:underline">
              Kontakta vår kundtjänst
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}