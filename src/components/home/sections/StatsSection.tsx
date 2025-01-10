import { QrCode, Star, Percent } from "lucide-react";

const STATS = [
  { 
    icon: Percent, 
    title: "Upp till 70%", 
    description: "Rabatt på behandlingar",
    delay: "0ms"
  },
  { 
    icon: QrCode, 
    title: "Digital kod", 
    description: "Använd direkt i salongen",
    delay: "100ms"
  },
  { 
    icon: Star, 
    title: "Kvalitetssäkrat", 
    description: "Utvalda salonger",
    delay: "200ms"
  }
] as const;

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {STATS.map((stat, index) => (
        <div 
          key={index} 
          className="bg-accent/50 rounded-xl p-6 text-center transition-all duration-300 hover:bg-accent hover:shadow-lg animate-fade-up"
          style={{ animationDelay: stat.delay }}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <stat.icon className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold text-primary">{stat.title}</h3>
          <p className="text-muted-foreground">{stat.description}</p>
        </div>
      ))}
    </div>
  );
}