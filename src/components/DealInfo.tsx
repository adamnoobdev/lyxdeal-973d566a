import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/PriceDisplay";
import { CategoryBadge } from "@/components/CategoryBadge";
import { MapPin, Phone, Timer, ChevronRight } from "lucide-react";
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
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <CategoryBadge category={category} />
            <Badge variant="secondary">
              <MapPin className="mr-1 h-3 w-3" />
              {city}
            </Badge>
          </div>
        </div>

        <img
          src={imageUrl}
          alt={title}
          className="aspect-[4/3] w-full rounded-lg object-cover"
        />

        <p className="text-muted-foreground">{description}</p>

        {salon && (
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{salon.name}</h3>
                <p className="text-sm text-muted-foreground">Erbjudandet säljs av denna salong</p>
              </div>
            </div>
            {salon.id && (
              <Link 
                to={`/salon/${salon.id}`}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                Se salong
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>

      <div>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <PriceDisplay
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                size="lg"
              />
              <p className="mt-1.5 text-sm text-muted-foreground">
                Inkl. moms. Inga dolda avgifter.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>{timeRemaining}</span>
            </div>

            {quantityLeft > 0 && (
              <p className="text-sm text-muted-foreground">
                {quantityLeft} erbjudanden kvar
              </p>
            )}

            {salon && (
              <div className="space-y-2 border-t pt-4">
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
            )}

            <Button
              className="w-full"
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