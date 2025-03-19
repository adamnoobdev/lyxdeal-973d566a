
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, HelpCircle } from "lucide-react";

export const HelpAccordionItems = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="no-codes">
        <AccordionTrigger className="text-left">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            Inga rabattkoder hittas för ett erbjudande
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm">
            <p>Om det inte finns några rabattkoder för ett erbjudande kan det bero på:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Rabattkoder har aldrig genererats för erbjudandet</li>
              <li>Erbjudandets ID matchar inte det ID som används för sökning</li>
              <li>Rabattkoderna har tagits bort manuellt</li>
            </ol>
            <p className="mt-2">Lösning:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Kontrollera att du använder rätt erbjudande-ID</li>
              <li>Använd "Lista alla koder" för att se vilka rabattkoder som finns</li>
              <li>Generera nya rabattkoder med knappen "Generera koder"</li>
            </ol>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="id-mismatch">
        <AccordionTrigger className="text-left">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            Problem med ID-format i databasen
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm">
            <p>Om ID-formatet för erbjudanden inte stämmer överens kan det orsaka problem:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>ID lagras som text i en tabell men som nummer i en annan</li>
              <li>ID:t har extra tecken eller formatering som påverkar sökningen</li>
            </ol>
            <p className="mt-2">Lösning:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Använd inspektion för att se vilket format ID:t har i databasen</li>
              <li>Se till att alla ID:n lagras i samma format (helst som nummer)</li>
              <li>Generera nya rabattkoder med rätt ID-format</li>
            </ol>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="general-tips">
        <AccordionTrigger className="text-left">
          <div className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
            Allmänna tips för felsökning
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 text-sm">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Öppna konsolfönstret i webbläsaren för att se detaljerade felmeddelanden</li>
              <li>Använd inspektionsverktyget för att se exakt vilka koder som finns i databasen</li>
              <li>Om allt annat misslyckas, generera nya rabattkoder för erbjudandet</li>
              <li>Kontrollera att erbjudandet har rätt status och är aktivt</li>
            </ol>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
