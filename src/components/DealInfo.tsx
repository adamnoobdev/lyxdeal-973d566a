import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Tag, ShoppingBag, Store, Phone } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { PriceDisplay } from "./PriceDisplay";

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
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={category} className="bg-primary/10 text-primary hover:bg-primary/20" />
          <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20">
            {discountPercentage}% rabatt
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          
          <div className="flex items-center gap-2">
            {renderStars(4.5)}
            <span className="text-sm text-muted-foreground">
              (4.5 / 5)
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-lg text-muted-foreground leading-relaxed">
        {description}
      </p>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-6">
          <PriceDisplay 
            originalPrice={originalPrice} 
            discountedPrice={discountedPrice} 
          />
          
          {salon && (
            <div className="border-t pt-4 space-y-2">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{salon.name}</span>
                </div>
                {salon.address && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{salon.address}</span>
                  </div>
                )}
                {salon.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{salon.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
            onClick={handlePurchase}
            disabled={quantityLeft <= 0 || isLoading}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {isLoading ? 'Bearbetar...' : quantityLeft > 0 ? 'Köp Nu' : 'Slutsåld'}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary/70" />
          <span>{city}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary/70" />
          <span>{timeRemaining}</span>
        </div>
        {quantityLeft > 0 && (
          <div className="flex items-center gap-2 text-emerald-600">
            <Tag className="h-4 w-4" />
            <span>{quantityLeft} kvar i lager</span>
          </div>
        )}
      </div>
    </div>
  );
};