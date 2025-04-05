
import { QrCode, Star, Percent } from "lucide-react";

const STATS = [
  { 
    icon: Percent, 
    title: "Upp till 70%", 
    description: "Rabatt på behandlingar" 
  },
  { 
    icon: QrCode, 
    title: "Digital kod", 
    description: "Använd direkt i salongen" 
  },
  { 
    icon: Star, 
    title: "Kvalitetssäkrat", 
    description: "Utvalda salonger" 
  }
] as const;

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {STATS.map((stat, index) => (
        <div 
          key={index} 
          className="bg-accent/50 rounded-xl p-6 text-center transition-all duration-300 hover:bg-accent hover:shadow-lg"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-white mb-4">
            <stat.icon className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-primary">{stat.title}</h3>
          <p className="text-muted-foreground">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}
