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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STATS.map((stat, index) => (
        <div 
          key={index} 
          className="p-6 space-y-3 border rounded-lg"
        >
          <div className="inline-flex items-center justify-center w-10 h-10">
            <stat.icon className="h-6 w-6 text-primary" />
          </div>
          
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold">{stat.title}</h3>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}