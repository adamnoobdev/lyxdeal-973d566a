
import { Check } from "lucide-react";

export const CreatorFeatures = () => {
  const features = [
    {
      title: "Tjäna pengar",
      description: "Få provision på varje köp som görs via dina rabattkoder.",
      icon: "💰"
    },
    {
      title: "Exklusiva erbjudanden",
      description: "Få tillgång till specialerbjudanden som bara dina följare kan ta del av.",
      icon: "🏆"
    },
    {
      title: "Väx ditt personliga varumärke",
      description: "Stärk din profil som expert inom skönhet och välmående.",
      icon: "📈"
    },
    {
      title: "Enkelt att komma igång",
      description: "Vi hjälper dig hela vägen från registrering till första utbetalningen.",
      icon: "🚀"
    }
  ];

  return (
    <div className="py-12 md:py-16 bg-white">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Fördelar för dig som kreatör</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Som kreatör hos Lyxdeal får du tillgång till flera fördelar som hjälper dig att växa och tjäna pengar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-4 max-w-3xl mx-auto">
          <h3 className="font-semibold text-xl text-center">Vad du får som kreatör</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Personliga rabattkoder",
              "Månatliga utbetalningar",
              "Tillgång till marknadsföringsmaterial",
              "Statistik och insikter",
              "Support från vårt team",
              "Sämarbetsmöjligheter med salonger",
              "Ingen fastlagd provisionstakt",
              "Flexibla villkor"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
