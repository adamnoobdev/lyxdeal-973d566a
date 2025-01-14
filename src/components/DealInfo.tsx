import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { PriceDisplay } from "./PriceDisplay";
import { DealHeader } from "./deal/DealHeader";
import { SalonInfo } from "./deal/SalonInfo";
import { DealMetadata } from "./deal/DealMetadata";

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

  return (
    <div className="space-y-8">
      <DealHeader title={title} category={category} />
      
      <p className="text-lg text-muted-foreground">
        {description}
      </p>
      
      <div className="rounded-lg bg-muted/5 p-6">
        <div className="space-y-6">
          <PriceDisplay 
            originalPrice={originalPrice} 
            discountedPrice={discountedPrice} 
          />
          
          {salon && <SalonInfo salon={salon} />}
          
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white"
            onClick={handlePurchase}
            disabled={quantityLeft <= 0 || isLoading}
            size="lg"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            {isLoading ? 'Bearbetar...' : quantityLeft > 0 ? 'Köp Nu' : 'Slutsåld'}
          </Button>
        </div>
      </div>
      
      <DealMetadata 
        city={city}
        timeRemaining={timeRemaining}
        quantityLeft={quantityLeft}
      />
    </div>
  );
};