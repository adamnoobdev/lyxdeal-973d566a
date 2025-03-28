
import { Helmet } from "react-helmet";

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

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Ångerrätt och returer</h2>
          <p>
            Enligt Distansavtalslagen har du som privatperson rätt att ångra ditt köp inom 14 dagar från det att du mottagit varan, 
            utan att ange något särskilt skäl. Ångerfristen börjar löpa den dag du tar emot varan eller en väsentlig del av den.
          </p>
          <p className="mt-4">
            För att utöva ångerrätten måste du meddela oss (Larlid & Co AB) ditt beslut att frånträda avtalet genom ett klart och 
            tydligt meddelande (t.ex. via e-post till info@larlid.com eller telefon 010-177 44 00). Du kan använda standardformulär 
            för ångerrätt, men det är inte obligatoriskt.
          </p>
          <p className="mt-4">
            Vid utövande av ångerrätten ska varan returneras i originalskick och i originalförpackning om möjligt.
            Du står själv för returfrakten om inget annat överenskommits.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Priser och betalning</h2>
          <p>
            Alla priser på webbplatsen anges i svenska kronor (SEK) och inkluderar moms. Vi reserverar oss för eventuella 
            prisändringar orsakat av tryckfel samt prisändringar av leverantörer.
          </p>
          <p className="mt-4">
            Betalning sker via våra tillgängliga betalningsmetoder. Alla betalningar hanteras säkert och i enlighet med 
            gällande lagar och förordningar.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Personuppgifter</h2>
          <p>
            Larlid & Co AB är personuppgiftsansvarig för de personuppgifter som samlas in i samband med din beställning. 
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
            <li>Meddela Lyxdeal omgående vid eventuella förändringar som kan påverka leverans av tjänster.</li>
          </ul>
          <p className="mt-4">
            Som salongspartner får du tillgång till en plattform för att marknadsföra dina tjänster men Lyxdeal ansvarar inte för din verksamhet eller 
            de tjänster du tillhandahåller.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Kontaktinformation</h2>
          <p>
            Larlid & Co AB<br />
            Org.nr: 5593608051<br />
            Västra Granittrappan 10<br />
            131 57 Nacka<br />
            E-post: info@larlid.com<br />
            Telefon: 010-177 44 00
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
