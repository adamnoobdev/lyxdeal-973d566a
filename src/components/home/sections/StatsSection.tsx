import { QrCode, Star, Percent } from "lucide-react";

const STATS = [
  { 
    icon: Percent, 
    title: "Upp till 70%", 
    description: "Rabatt på behandlingar",
    delay: "0ms",
    gradient: "from-primary-500/20 to-primary-500/5"
  },
  { 
    icon: QrCode, 
    title: "Digital kod", 
    description: "Använd direkt i salongen",
    delay: "100ms",
    gradient: "from-secondary-500/20 to-secondary-500/5"
  },
  { 
    icon: Star, 
    title: "Kvalitetssäkrat", 
    description: "Utvalda salonger",
    delay: "200ms",
    gradient: "from-accent-500/20 to-accent-500/5"
  }
] as const;

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {STATS.map((stat, index) => (
        <div 
          key={index} 
          className="relative group rounded-2xl p-6 animate-fade-up overflow-hidden"
          style={{ animationDelay: stat.delay }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
          
          {/* Content */}
          <div className="relative space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
              <stat.icon className="h-7 w-7 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">{stat.title}</h3>
              <p className="text-muted-foreground">{stat.description}</p>
            </div>
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 border border-primary/10 rounded-2xl group-hover:border-primary/20 transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
}