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
            Genom att genomföra ett köp godkänner du dessa villkor.
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
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Priser och betalning</h2>
          <p>
            Alla priser på webbplatsen anges i svenska kronor (SEK) och inkluderar moms. Vi reserverar oss för eventuella 
            prisändringar orsakat av tryckfel samt prisändringar av leverantörer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Personuppgifter</h2>
          <p>
            Larlid & Co AB är personuppgiftsansvarig för de personuppgifter som samlas in i samband med din beställning. 
            Vi behandlar dina personuppgifter i enlighet med vår integritetspolicy och gällande dataskyddslagstiftning.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Kontaktinformation</h2>
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