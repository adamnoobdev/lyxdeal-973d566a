
import { CircleCheck, Users, Zap, LineChart, BellRing, Clock } from "lucide-react";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex gap-3 md:gap-4">
    <div className="mt-1 flex-shrink-0 bg-primary p-2">
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-base md:text-lg mb-1">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
  </div>
);

export const PartnerFeatures = () => {
  const features = [
    {
      icon: <Users className="h-5 w-5 md:h-6 md:w-6 text-white" />,
      title: "Nå fler kunder",
      description: "Få tillgång till vår växande kundbas av kvalitetsmedvetna konsumenter som letar efter skönhetserbjudanden."
    },
    {
      icon: <Zap className="h-5 w-5 md:h-6 md:w-6 text-white" />,
      title: "Ökad synlighet",
      description: "Dina erbjudanden visas för intresserade kunder på vår plattform och i våra marknadsföringskanaler."
    },
    {
      icon: <LineChart className="h-5 w-5 md:h-6 md:w-6 text-white" />,
      title: "Detaljerad statistik",
      description: "Få insikter om hur dina erbjudanden presterar och vilka som är mest populära bland kunderna."
    },
    {
      icon: <BellRing className="h-5 w-5 md:h-6 md:w-6 text-white" />,
      title: "Notifikationer",
      description: "Få direkta notifikationer när en kund köper ditt erbjudande så att du kan planera ditt schema."
    },
    {
      icon: <CircleCheck className="h-5 w-5 md:h-6 md:w-6 text-white" />,
      title: "Enkel hantering",
      description: "Använd vår intuitiva dashboard för att enkelt hantera och uppdatera dina erbjudanden."
    },
    {
      icon: <Clock className="h-5 w-5 md:h-6 md:w-6 text-white" />,
      title: "Spara tid",
      description: "Låt oss hantera marknadsföringen medan du fokuserar på att leverera bästa möjliga service till dina kunder."
    },
  ];

  return (
    <div className="py-10 md:py-16 bg-gray-50">
      <div className="container px-4 md:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Fördelar med att bli partner</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Som salongspartner får du inte bara möjligheten att nå nya kunder, utan också tillgång till flera verktyg som hjälper dig att växa din verksamhet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureItem 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
