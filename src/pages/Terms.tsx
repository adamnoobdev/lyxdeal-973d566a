
import React from 'react';
import { Helmet } from 'react-helmet';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Användarvillkor | Lyxdeal</title>
        <meta name="description" content="Läs våra användarvillkor för att förstå vilka regler som gäller när du använder Lyxdeal-tjänsten." />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Användarvillkor</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Inledning</h2>
          <p className="text-gray-700 mb-4">
            Välkommen till Lyxdeal. Genom att använda vår tjänst accepterar du dessa användarvillkor. 
            Vänligen läs dem noggrant. Villkoren utgör ett bindande avtal mellan dig som användare och Lyxdeal.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Tjänsten</h2>
          <p className="text-gray-700 mb-4">
            Lyxdeal erbjuder en plattform där användare kan hitta och säkra rabatterade erbjudanden från olika skönhetssalonger. 
            Vi agerar som en förmedlare och är inte själva utförare av de tjänster som erbjuds genom erbjudandena.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Konton</h2>
          <p className="text-gray-700 mb-4">
            För att kunna nyttja vissa funktioner kan du behöva skapa ett konto. Du ansvarar för att hålla dina inloggningsuppgifter säkra.
            Du är ansvarig för all aktivitet som sker under ditt konto.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Rabattkoder</h2>
          <p className="text-gray-700 mb-4">
            När du säkrar ett erbjudande får du en unik rabattkod som är giltig under en begränsad tid. 
            Rabattkoder får inte överlåtas, säljas eller användas i kommersiellt syfte.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Ansvarsbegränsning</h2>
          <p className="text-gray-700 mb-4">
            Lyxdeal ansvarar inte för kvaliteten på utförda tjänster hos våra partnersalonger. 
            Eventuella klagomål angående behandlingar ska riktas direkt till den aktuella salongen.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Integritetspolicy</h2>
          <p className="text-gray-700 mb-4">
            Vår hantering av personuppgifter beskrivs i vår 
            <a href="/privacy" className="text-primary hover:underline mx-1">integritetspolicy</a>
            som utgör en del av dessa användarvillkor.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Ändringar av villkor</h2>
          <p className="text-gray-700 mb-4">
            Vi förbehåller oss rätten att när som helst ändra dessa villkor. 
            Större ändringar kommer att meddelas via e-post eller genom meddelande på vår webbplats.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Kontakt</h2>
          <p className="text-gray-700 mb-4">
            Om du har frågor gällande dessa villkor eller vår tjänst, vänligen kontakta oss via 
            <a href="/contact" className="text-primary hover:underline mx-1">kontaktsidan</a>.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500">
          <p>Senast uppdaterad: April 2025</p>
        </div>
      </div>
    </div>
  );
}
