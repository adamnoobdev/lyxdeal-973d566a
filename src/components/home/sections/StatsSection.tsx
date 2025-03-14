
import { QrCode, Star, Percent } from "lucide-react";

const STATS = [
  { 
    icon: Percent, 
    title: "1. Säkra erbjudandet", 
    description: "Enkelt och snabbt med några få steg" 
  },
  { 
    icon: QrCode, 
    title: "2. Få rabattkoden", 
    description: "Koden skickas automatiskt till din angivna e-post" 
  },
  { 
    icon: Star, 
    title: "3. Visa koden", 
    description: "Använd koden direkt på salongens bokningssida" 
  }
] as const;

export function StatsSection() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
        {STATS.map((stat, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-6 space-y-3 bg-white/50 border border-muted-200 rounded-lg shadow-sm relative"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary/80" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold text-foreground">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>

            {index < STATS.length - 1 && (
              <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                <div className="w-8 h-0.5 bg-primary/20"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
