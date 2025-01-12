import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Tag, ShoppingBag, Store, Phone } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface DealInfoProps {
  id: number;
  title: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  city: string;
  quantityLeft: number;
  salon?: {
    name: string;
    address: string | null;
    phone: string | null;
  } | null;
}

export const DealInfo = ({
  id,
  title,
  description,
  category,
  originalPrice,
  discountedPrice,
  timeRemaining,
  city,
  quantityLeft,
  salon,
}: DealInfoProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      console.log('Starting purchase process for deal:', id);

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { dealId: id }
      });

      if (error) {
        console.error('Purchase error:', error);
        toast.error(`Ett fel uppstod: ${error.message}`);
        return;
      }

      if (!data?.url) {
        console.error('No checkout URL received');
        toast.error('Kunde inte starta köpet. Kontrollera att erbjudandet fortfarande är tillgängligt.');
        return;
      }

      console.log('Redirecting to checkout URL:', data.url);
      window.location.href = data.url;
    } catch (error) {
      console.error('Purchase error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ett okänt fel uppstod';
      toast.error(`Ett fel uppstod: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-wrap items-center gap-3">
        <CategoryBadge 
          category={category} 
          className="shadow-sm bg-gradient-to-r from-primary/20 to-secondary/20 text-primary hover:from-primary/30 hover:to-secondary/30 transition-all duration-300" 
        />
        <Badge variant="outline" className="bg-gradient-to-r from-destructive/10 to-destructive/20 text-destructive border-destructive/20 shadow-sm">
          Spara {discountPercentage}%
        </Badge>
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-primary/90 to-gray-900 bg-clip-text text-transparent">
          {title}
        </h1>
        
        <div className="flex items-center gap-2">
          {renderStars(4.5)}
          <span className="text-sm text-muted-foreground">
            (4.5 / 5)
          </span>
        </div>
      </div>
      
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="rounded-xl bg-gradient-to-br from-white via-white to-gray-50/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-accent/20 transform transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] hover:scale-[1.01]">
        <div className="space-y-4">
          <div className="flex justify-between items-end border-b border-accent/10 pb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ordinarie pris</p>
              <p className="text-lg line-through text-muted-foreground/60">{formatPrice(originalPrice)}</p>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-emerald-50 to-emerald-100/80 text-emerald-600 border-emerald-200 shadow-sm">
              Du sparar {formatPrice(originalPrice - discountedPrice)}
            </Badge>
          </div>
          
          <div className="pb-4">
            <p className="text-sm text-muted-foreground mb-1">Ditt pris</p>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                {formatPrice(discountedPrice)}
              </p>
              <Badge className="bg-yellow-500/90 text-yellow-950 border-none shadow-sm">
                SPARA {discountPercentage}%
              </Badge>
            </div>
          </div>

          {salon && (
            <div className="border-t border-accent/10 pt-4 pb-6">
              <p className="text-sm text-muted-foreground mb-3">Erbjudandet säljs av:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-primary/70" />
                  <span className="font-medium text-foreground">{salon.name}</span>
                </div>
                {salon.address && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm group cursor-default">
                    <MapPin className="h-3.5 w-3.5 group-hover:text-primary/70 transition-colors" />
                    <span className="group-hover:text-foreground transition-colors">{salon.address}</span>
                  </div>
                )}
                {salon.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm group cursor-default">
                    <Phone className="h-3.5 w-3.5 group-hover:text-primary/70 transition-colors" />
                    <span className="group-hover:text-foreground transition-colors">{salon.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Button 
            className="w-full bg-gradient-to-r from-primary via-secondary to-primary hover:from-primary/90 hover:via-secondary/90 hover:to-primary/90 text-white font-medium py-6 group transition-all duration-500 animate-gradient"
            onClick={handlePurchase}
            disabled={quantityLeft <= 0 || isLoading}
          >
            <ShoppingBag className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            {isLoading ? 'Bearbetar...' : quantityLeft > 0 ? 'Köp Nu - Begränsat Antal!' : 'Slutsåld'}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{city}</span>
        </div>
        <div className="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1">
          <Clock className="h-4 w-4 text-primary" />
          <span>{timeRemaining}</span>
        </div>
        {quantityLeft > 0 && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium transition-transform duration-300 hover:translate-x-1">
            <Tag className="h-4 w-4" />
            <span>Endast {quantityLeft} kvar i lager - Skynda dig!</span>
          </div>
        )}
      </div>
    </div>
  );
};