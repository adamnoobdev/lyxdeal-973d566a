
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "Vem kan bli kreatör på Lyxdeal?",
      answer: "Lyxdeal söker personer med ett genuint intresse för skönhet och välmående som har ett Instagram-konto med engagerade följare. Vi tittar inte bara på antalet följare utan även på engagemang och kvalitet i innehållet."
    },
    {
      question: "Hur mycket kan jag tjäna som kreatör?",
      answer: "Din förtjänst beror på antalet köp som görs med dina rabattkoder. Vår provisionsmodell är flexibel och utgår från ditt engagemang och din följarbas."
    },
    {
      question: "Hur ofta får jag betalt?",
      answer: "Vi gör utbetalningar en gång per månad för alla köp som gjorts med dina koder under föregående månad."
    },
    {
      question: "Kan jag använda rabattkoderna själv?",
      answer: "Ja, du kan även använda dina egna rabattkoder för personliga köp och få samma fördelar som dina följare."
    },
    {
      question: "Hur kan jag se hur mina rabattkoder presterar?",
      answer: "Du får tillgång till en personlig dashboard där du kan följa statistik över användningen av dina koder i realtid."
    }
  ];

  return (
    <div className="py-12 md:py-16 bg-white" id="faq-section">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Vanliga frågor</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Här hittar du svar på de vanligaste frågorna om att vara kreatör hos Lyxdeal.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};
