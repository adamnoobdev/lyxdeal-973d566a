
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
            Larlid & Co AB (org.nr: 5593608051) värnar om din personliga integritet. Denna integritetspolicy förklarar 
            hur vi samlar in, använder, lagrar och delar dina personuppgifter när du använder vår tjänst Lyxdeal.
          </p>
          <p className="mt-4">
            Genom att använda våra tjänster godkänner du denna integritetspolicy och vår behandling av dina personuppgifter.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Insamling av personuppgifter</h2>
          <p>
            Vi samlar in följande personuppgifter när du använder våra tjänster:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Kontaktuppgifter (namn, e-post, telefonnummer)</li>
            <li>Adressuppgifter vid köp eller registrering som partner</li>
            <li>Betalningsinformation vid köp</li>
            <li>Företagsinformation om du registrerar dig som salongspartner</li>
            <li>Information om dina köp och användning av våra tjänster</li>
            <li>Information som du frivilligt lämnar i kommunikation med oss</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Hur vi använder dina personuppgifter</h2>
          <p>
            Vi använder dina personuppgifter för följande ändamål:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>För att tillhandahålla och förbättra våra tjänster</li>
            <li>För att hantera dina köp, betalningar och leveranser</li>
            <li>För att kommunicera med dig angående dina köp eller vår tjänst</li>
            <li>För att skicka marknadsföring om våra tjänster (om du inte avböjt)</li>
            <li>För att uppfylla rättsliga förpliktelser</li>
            <li>För att förhindra bedrägerier och missbruk av våra tjänster</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Delning av personuppgifter</h2>
          <p>
            Vi kan komma att dela dina personuppgifter med:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Betalningstjänstleverantörer för att hantera betalningar</li>
            <li>Salongspartners för att tillhandahålla de tjänster du köpt</li>
            <li>IT-leverantörer som hjälper oss driva vår verksamhet</li>
            <li>Myndigheter när lagen kräver det</li>
          </ul>
          <p className="mt-4">
            Vi säljer aldrig dina personuppgifter till tredje part.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Lagring och säkerhet</h2>
          <p>
            Vi lagrar dina personuppgifter endast så länge som det är nödvändigt för de ändamål som anges i denna policy 
            eller enligt gällande lagstiftning.
          </p>
          <p className="mt-4">
            Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter 
            mot obehörig åtkomst, förlust eller förstöring.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Dina rättigheter</h2>
          <p>
            Enligt dataskyddsförordningen har du rätt att:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>Begära tillgång till dina personuppgifter</li>
            <li>Begära rättelse av felaktiga personuppgifter</li>
            <li>Begära radering av dina personuppgifter</li>
            <li>Begära begränsning av behandling</li>
            <li>Invända mot behandling</li>
            <li>Begära dataportabilitet</li>
            <li>Återkalla samtycke</li>
          </ul>
          <p className="mt-4">
            För att utöva dina rättigheter eller om du har frågor om vår behandling av dina personuppgifter, 
            vänligen kontakta oss på info@larlid.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Kontaktinformation</h2>
          <p>
            Personuppgiftsansvarig:<br />
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

export default Privacy;
