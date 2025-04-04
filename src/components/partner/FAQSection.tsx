
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
      answer: "När en kund väljer att få ditt erbjudande, genereras en unik rabattkod automatiskt som skickas till kundens e-post. Viktigt att notera är att Lyxdeal endast förmedlar rabattkoder - inga köp eller betalningar genomförs på vår hemsida."
    },
    {
      question: "Hur fungerar betalningen för era tjänster?",
      answer: "Vi förmedlar endast rabattkoder till kunder. All betalning sker direkt mellan kunden och salongen när kunden bokar sin tid med den erhållna rabattkoden. Lyxdeal hanterar inte några betalningar för behandlingar."
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
      answer: "I din dashboard hittar du statistik över dina erbjudanden, inklusive antal visningar, genererade rabattkoder och konverteringsgrad."
    },
    {
      question: "Vad är skillnaden mellan Lyxdeal och andra marknadsföringstjänster?",
      answer: "Lyxdeal fungerar som en plattform som kopplar ihop kunder med salonger genom rabattkoder. Vi hanterar ingen bokning eller betalning - vi förmedlar endast rabattkoder som kunderna sedan använder direkt hos salongen. Detta ger dig full kontroll över din verksamhet samtidigt som du når nya kunder."
    }
  ];

  return (
    <div id="faq-section" className="py-10 md:py-16 bg-white">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-4">Vanliga frågor</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Här hittar du svar på de vanligaste frågorna om att vara partner med Lyxdeal.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Alert variant="warning" className="mb-6 md:mb-8 text-xs md:text-sm">
            <InfoIcon className="h-4 w-4 md:h-5 md:w-5" />
            <AlertTitle className="text-sm md:text-base">Viktigt att förstå</AlertTitle>
            <AlertDescription className="text-xs md:text-sm">
              Lyxdeal är en plattform som endast förmedlar rabattkoder. Vi hanterar inga köp eller betalningar på vår hemsida. 
              Kunder får rabattkoder via e-post som de sedan kan använda när de bokar behandlingar direkt hos din salong.
            </AlertDescription>
          </Alert>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-sm md:text-base py-3 md:py-4">{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 text-xs md:text-sm pb-1">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};
