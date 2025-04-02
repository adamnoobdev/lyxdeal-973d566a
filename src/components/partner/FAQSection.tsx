
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqItems = [
    {
      question: "Vad kostar det att vara partner med Lyxdeal?",
      answer: "Vi erbjuder olika paket beroende på dina behov. Baspaketet kostar 399 kr/månad eller 2788 kr/år (spara 2000 kr). Premiumpaketet kostar 699 kr/månad eller 5388 kr/år (spara 3000 kr). Alla priser är exklusive moms."
    },
    {
      question: "Hur lång tid tar det innan mitt konto är aktivt?",
      answer: "Efter slutförd registrering och betalning aktiveras ditt konto omedelbart. Du kan sedan logga in och börja skapa erbjudanden direkt."
    },
    {
      question: "Hur skapar jag erbjudanden?",
      answer: "När du har loggat in på din dashboard, navigera till fliken 'Erbjudanden' och klicka på 'Skapa nytt erbjudande'. Fyll i formuläret med information om ditt erbjudande, inklusive pris, beskrivning och bild."
    },
    {
      question: "Hur får kunderna sina rabattkoder?",
      answer: "När en kund väljer att köpa ditt erbjudande, genereras en unik rabattkod automatiskt som skickas till kundens e-post. De kan sedan använda denna kod när de bokar tjänsten direkt hos dig."
    },
    {
      question: "Kan jag ändra eller ta bort erbjudanden?",
      answer: "Ja, du kan när som helst redigera eller ta bort dina erbjudanden via din dashboard. Tänk dock på att rabattkoder som redan genererats fortfarande kommer att vara giltiga."
    },
    {
      question: "Hur många erbjudanden kan jag ha samtidigt?",
      answer: "Det beror på ditt paket. Baspaketet ger dig möjlighet att ha 1 aktivt erbjudande samtidigt, medan premiumpaketet låter dig ha upp till 3 aktiva erbjudanden."
    },
    {
      question: "Kan jag säga upp mitt partnerskap när som helst?",
      answer: "Ja, du kan säga upp ditt partnerskap när som helst. Om du har betalat för ett år i förväg gäller dock prenumerationen till slutet av betalningsperioden."
    },
    {
      question: "Hur ser jag statistik över mina erbjudanden?",
      answer: "I din dashboard hittar du statistik över dina erbjudanden, inklusive antal visningar, sålda koder och konverteringsgrad."
    }
  ];

  return (
    <div id="faq-section" className="py-16 bg-white">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Vanliga frågor</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Här hittar du svar på de vanligaste frågorna om att vara partner med Lyxdeal.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};
