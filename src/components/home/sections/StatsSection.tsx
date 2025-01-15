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
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {STATS.map((stat, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-6 space-y-3 bg-white/50 border border-muted-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary/80" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold text-foreground">{stat.title}</h3>
              <p className="text-sm text-muted-foreground">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}