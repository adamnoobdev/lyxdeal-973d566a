
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

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
            Genom att genomföra ett köp eller registrera dig som salongspartner godkänner du dessa villkor.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Tjänstebeskrivning</h2>
          <p>
            Lyxdeal är en plattform som förmedlar skönhets- och välmåendetjänster från olika salongspartners till konsumenter. 
            Vår roll är att förmedla erbjudanden mellan salongspartners och kunder.
          </p>
          <p className="mt-4">
            För salongspartners erbjuder vi en digital plattform för marknadsföring och kundanskaffning genom specialerbjudanden.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Salongspartners</h2>
          <p>
            Som salongspartner förbinder du dig att:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Tillhandahålla korrekta uppgifter vid registrering</li>
            <li>Erbjuda de tjänster som marknadsförs via plattformen</li>
            <li>Behandla kunder professionellt och i enlighet med god affärssed</li>
            <li>Följa gällande lagar och regler för din verksamhet</li>
            <li>Betala överenskomna avgifter enligt avtal</li>
          </ul>
          <p>
            Prenumerationer löper tills vidare med en månads uppsägningstid om inget annat avtalats. 
            Betalning sker i förskott via våra betalningstjänster.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Ångerrätt och returer</h2>
          <p>
            Enligt Distansavtalslagen har du som privatperson rätt att ångra ditt köp inom 14 dagar från det att du mottagit 
            bekräftelse på ditt köp, utan att ange något särskilt skäl.
          </p>
          <p className="mt-4">
            För att utöva ångerrätten måste du meddela oss (Larlid & Co AB) ditt beslut att frånträda avtalet genom ett klart och 
            tydligt meddelande (t.ex. via e-post till info@larlid.com eller telefon 010-177 44 00).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Priser och betalning</h2>
          <p>
            Alla priser på webbplatsen anges i svenska kronor (SEK) och inkluderar moms. Vi reserverar oss för eventuella 
            prisändringar orsakade av tryckfel samt prisändringar från leverantörer.
          </p>
          <p className="mt-4">
            För salongspartners gäller de priser och betalningsvillkor som specificeras i det avtal som ingåtts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Personuppgifter</h2>
          <p>
            Larlid & Co AB är personuppgiftsansvarig för de personuppgifter som samlas in i samband med din användning av 
            våra tjänster. Vi behandlar dina personuppgifter i enlighet med vår 
            <Link to="/privacy" className="text-primary hover:underline mx-1">integritetspolicy</Link>
            och gällande dataskyddslagstiftning.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Avtalsperiod och uppsägning</h2>
          <p>
            För salongspartners gäller den avtalsperiod som specificeras i det individuella avtalet. Standardavtalet löper 
            tillsvidare med en månads uppsägningstid. Uppsägning ska ske skriftligen via e-post till info@larlid.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Kontaktinformation</h2>
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
