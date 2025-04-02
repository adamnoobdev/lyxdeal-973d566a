
import { Helmet } from "react-helmet";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

const Terms = () => {
  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <Helmet>
        <title>Allmänna villkor | Lyxdeal</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8">Allmänna villkor</h1>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Allmänt</h2>
          <p>
            Dessa allmänna villkor gäller mellan Larlid & Co AB (org.nr: 5593608051) och kund som handlar via Lyxdeal.
            Genom att genomföra ett köp eller registrera dig som partner godkänner du dessa villkor.
          </p>
          <p className="mt-4">
            Lyxdeal förbehåller sig rätten att när som helst ändra dessa villkor. Ändringar träder i kraft när de 
            publiceras på webbplatsen. Det är därför viktigt att du regelbundet tar del av dessa villkor.
          </p>
        </section>

        <section className="mb-8 bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h2 className="text-2xl font-semibold mb-4">2. Rabattkoder och vårt ansvar</h2>
          <p>
            <strong>Viktigt att notera:</strong> Lyxdeal sköter inte betalningar direkt på vår webbplats. Vi tillhandahåller endast
            rabattkoder som kan användas på respektive salongs bokningssida.
          </p>
          <p className="mt-4">
            Vi ansvarar endast för att de rabattkoder som du får genom att fylla i dina uppgifter på Lyxdeal ska 
            fungera på salongens bokningssida. 
          </p>
          <p className="mt-4">
            Lyxdeal ansvarar <strong>inte</strong> för:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Salongens utförande av behandlingar</li>
            <li>Kvaliteten på den service som tillhandahålls av salongen</li>
            <li>Eventuella missnöjen med behandlingen</li>
            <li>Återbetalningar för genomförda behandlingar</li>
            <li>Bokningar, avbokningar eller ombokningar hos salongen</li>
            <li>Andra transaktioner som sker direkt mellan kund och salong</li>
          </ul>
          <p className="mt-4">
            <strong>Ingen ångerrätt eller retur via Lyxdeal:</strong> Eftersom vi inte sköter betalningar eller 
            är direkt involverade i tjänsteleveransen, finns det ingen ångerrätt eller returmöjlighet via Lyxdeal. 
            Eventuella frågor om ångerrätt, avbokning eller återbetalning måste hanteras direkt med den salong där 
            bokningen gjorts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Priser och betalning</h2>
          <p>
            Alla priser på webbplatsen anges i svenska kronor (SEK) och inkluderar moms. Vi reserverar oss för eventuella 
            prisändringar orsakat av tryckfel samt prisändringar av leverantörer.
          </p>
          <p className="mt-4">
            Betalningar sker direkt till respektive salong vid bokning eller besök. Lyxdeal tar inget betalningsansvar eller 
            hanterar några transaktioner mellan kund och salong.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Personuppgifter</h2>
          <p>
            Larlid & Co AB är personuppgiftsansvarig för de personuppgifter som samlas in i samband med din användning av Lyxdeal. 
            Vi behandlar dina personuppgifter i enlighet med vår integritetspolicy och gällande dataskyddslagstiftning.
          </p>
          <p className="mt-4">
            För mer information om hur vi hanterar dina personuppgifter, vänligen se vår <a href="/privacy" className="text-primary hover:underline">Integritetspolicy</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. För salongspartners</h2>
          <p>
            Som salongspartner förbinder du dig att:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Tillhandahålla korrekta och aktuella uppgifter om din verksamhet och de tjänster du erbjuder.</li>
            <li>Leverera tjänster i enlighet med beskrivning och av god kvalitet.</li>
            <li>Behandla alla kunder med respekt och professionalitet.</li>
            <li>Följa gällande lagar och förordningar inom din bransch.</li>
            <li>Meddela Lyxdeal omgående vid eventuella förändringar som kan påverka leverans av tjänster eller rabattkoder.</li>
            <li>Acceptera och lösa in de rabattkoder som Lyxdeal förmedlar till kunder.</li>
          </ul>
          <p className="mt-4">
            Som salongspartner får du tillgång till en plattform för att marknadsföra dina tjänster men Lyxdeal ansvarar inte för din verksamhet eller 
            de tjänster du tillhandahåller.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Kontaktinformation</h2>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-lg mb-4">Företagsinformation</h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex flex-col items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex flex-col items-center">
                    <p className="font-medium">Larlid & Co AB</p>
                    <p className="text-gray-500">Org.nr: 559360-8051</p>
                  </div>
                </li>
                <li className="flex flex-col items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex flex-col items-center">
                    <p>Västra Granittrappan 10</p>
                    <p>131 57 Nacka</p>
                  </div>
                </li>
                <li className="flex flex-col items-center gap-2">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <a href="mailto:info@larlid.com" className="hover:text-primary transition-colors">
                    info@larlid.com
                  </a>
                </li>
                <li className="flex flex-col items-center gap-2">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <a href="tel:+46101774400" className="hover:text-primary transition-colors">
                    010-177 44 00
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
