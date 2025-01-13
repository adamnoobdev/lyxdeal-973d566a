import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/PriceDisplay";
import { CategoryBadge } from "@/components/CategoryBadge";
import { MapPin, Phone, Timer, ChevronRight, Store, Tag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DealInfoProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  category: string;
  city: string;
  quantityLeft: number;
  salon?: {
    id?: number;
    name: string;
    address: string | null;
    phone: string | null;
  };
  onPurchase?: () => void;
}

export const DealInfo = ({
  id,
  title,
  description,
  imageUrl,
  originalPrice,
  discountedPrice,
  timeRemaining,
  category,
  city,
  quantityLeft,
  salon,
  onPurchase,
}: DealInfoProps) => {
  const handlePurchase = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { dealId: id },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Ett fel uppstod vid köp');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error in purchase:', error);
      toast.error('Ett fel uppstod vid köp');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CategoryBadge category={category} />
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              {city}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">{title}</h1>
        </div>

        <div className="relative overflow-hidden rounded-xl">
          <img
            src={imageUrl}
            alt={title}
            className="aspect-video w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Om erbjudandet</h2>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {salon && (
          <Card className="overflow-hidden">
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{salon.name}</h3>
                    <p className="text-sm text-muted-foreground">Erbjudandet säljs av denna salong</p>
                  </div>
                </div>
                {salon.id && (
                  <Link 
                    to={`/salon/${salon.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
                  >
                    Se salong
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-2 p-6 bg-muted/5">
              {salon.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{salon.address}</span>
                </div>
              )}
              {salon.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{salon.phone}</span>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      <div>
        <Card className="sticky top-6">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <PriceDisplay
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                size="lg"
              />
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                Inkl. moms. Inga dolda avgifter.
              </p>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{timeRemaining}</span>
              </div>

              {quantityLeft > 0 && (
                <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                  {quantityLeft} erbjudanden kvar
                </div>
              )}
            </div>

            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              size="lg"
              onClick={handlePurchase}
              disabled={quantityLeft === 0}
            >
              {quantityLeft > 0 ? "Köp nu" : "Slutsåld"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};