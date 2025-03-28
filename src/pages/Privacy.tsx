
import { Helmet } from "react-helmet";

const Privacy = () => {
  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <Helmet>
        <title>Integritetspolicy | Lyxdeal</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-8">Integritetspolicy</h1>

      <div className="prose prose-gray max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Inledning</h2>
          <p>
            Denna integritetspolicy förklarar hur Larlid & Co AB (org.nr: 5593608051) samlar in, använder 
            och skyddar dina personuppgifter när du använder Lyxdeal. Vi värnar om din integritet och 
            följer dataskyddsförordningen (GDPR) och annan tillämplig lagstiftning.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Personuppgifter vi samlar in</h2>
          <p>
            Vi samlar in följande uppgifter:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Namn och kontaktuppgifter (e-post, telefonnummer)</li>
            <li>Företagsinformation (för salongspartners)</li>
            <li>Information om dina köp och användning av våra tjänster</li>
            <li>Teknisk information om hur du använder vår webbplats</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Hur vi använder dina uppgifter</h2>
          <p>
            Vi använder dina personuppgifter för att:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Tillhandahålla och administrera våra tjänster</li>
            <li>Kommunicera med dig om dina köp och bokningar</li>
            <li>Utveckla och förbättra våra tjänster</li>
            <li>Följa lagstadgade krav</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Lagring och delning</h2>
          <p>
            Vi lagrar dina personuppgifter så länge det behövs för att uppfylla ändamålen med behandlingen 
            eller så länge vi är skyldiga enligt lag. Vi delar endast dina uppgifter med betrodda 
            samarbetspartners som hjälper oss att leverera våra tjänster och som följer samma 
            dataskyddsprinciper.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Dina rättigheter</h2>
          <p>
            Du har rätt att:
          </p>
          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Få tillgång till de personuppgifter vi har om dig</li>
            <li>Begära rättelse av felaktiga uppgifter</li>
            <li>Begära radering av dina uppgifter under vissa omständigheter</li>
            <li>Invända mot viss behandling av dina uppgifter</li>
            <li>Begära begränsning av behandlingen av dina uppgifter</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Kontakt</h2>
          <p>
            Om du har frågor om vår behandling av dina personuppgifter, kontakta oss på:
          </p>
          <p className="mt-2">
            Larlid & Co AB<br />
            E-post: info@larlid.com<br />
            Telefon: 010-177 44 00
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
