
import React from 'react';
import { Helmet } from 'react-helmet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Vanliga frågor | Lyxdeal</title>
        <meta name="description" content="Hitta svar på vanliga frågor om Lyxdeal, användning av vår tjänst, och hur våra erbjudanden fungerar." />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Vanliga frågor</h1>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg px-4 py-2">
            <AccordionTrigger className="text-lg font-medium">Hur fungerar Lyxdeal?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Lyxdeal är en plattform som samlar exklusiva erbjudanden från salonger och skönhetsverksamheter. Du kan bläddra bland erbjudanden, säkra dem genom vår plattform, och sedan besöka salongen för att nyttja erbjudandet.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border rounded-lg px-4 py-2">
            <AccordionTrigger className="text-lg font-medium">Hur säkrar jag ett erbjudande?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              När du hittar ett erbjudande du vill nyttja, klickar du på "Säkra erbjudande". Du får sedan fylla i dina uppgifter och får en unik rabattkod skickad till din e-post. Denna kod visar du sedan upp i salongen.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border rounded-lg px-4 py-2">
            <AccordionTrigger className="text-lg font-medium">Kostar det något att använda Lyxdeal?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Det är helt gratis att använda Lyxdeal för att hitta och säkra erbjudanden. Du betalar endast för behandlingen när du besöker salongen, då till det rabatterade priset som visas på erbjudandet.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border rounded-lg px-4 py-2">
            <AccordionTrigger className="text-lg font-medium">Hur lång tid är rabattkoden giltig?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Rabattkoden är vanligtvis giltig i 72 timmar från det att du säkrar erbjudandet, men detta kan variera beroende på erbjudandet. Den exakta giltighetstiden anges tydligt vid varje erbjudande.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border rounded-lg px-4 py-2">
            <AccordionTrigger className="text-lg font-medium">Kan jag avboka ett säkrat erbjudande?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Om du inte använder din rabattkod inom giltighetstiden förfaller den automatiskt. Det finns ingen formell avbokningsprocess, men om du har problem kan du kontakta oss via vår kontaktsida.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="border rounded-lg px-4 py-2">
            <AccordionTrigger className="text-lg font-medium">Jag är salongsägare, hur blir jag partner?</AccordionTrigger>
            <AccordionContent className="text-gray-600">
              Vi välkomnar nya salonger att bli partners! Besök vår <a href="/partner" className="text-primary underline">partnerssida</a> för mer information, eller kontakta oss direkt via e-post.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-gray-600">Hittade du inte svar på din fråga?</p>
          <a href="/contact" className="mt-2 inline-flex items-center text-primary hover:underline">
            Kontakta oss
          </a>
        </div>
      </div>
    </div>
  );
}
