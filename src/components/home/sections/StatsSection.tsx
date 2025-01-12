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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
      {STATS.map((stat, index) => (
        <div 
          key={index} 
          className="relative group rounded-2xl p-4 md:p-6 animate-fade-up"
          style={{ animationDelay: stat.delay }}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
          
          {/* Content */}
          <div className="relative space-y-3 md:space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white shadow-lg mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
              <stat.icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            </div>
            
            <div className="space-y-1 md:space-y-2">
              <h3 className="text-xl md:text-2xl font-bold text-foreground">{stat.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{stat.description}</p>
            </div>
          </div>

          {/* Hover effect */}
          <div className="absolute inset-0 border border-primary/10 rounded-2xl group-hover:border-primary/20 transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
}