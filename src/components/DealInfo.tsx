import { Button } from "@/components/ui/button";
import { ShoppingBag, CreditCard, Bitcoin } from "lucide-react";
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
  originalPrice,
  discountedPrice,
  timeRemaining,
  quantityLeft,
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
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <PriceDisplay 
              originalPrice={originalPrice} 
              discountedPrice={discountedPrice}
              className="text-lg"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{quantityLeft} köp kvar till detta pris</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>{timeRemaining} kvar av kampanjen</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 group"
          onClick={handlePurchase}
          disabled={quantityLeft <= 0 || isLoading}
          size="lg"
        >
          <ShoppingBag className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          {isLoading ? 'Bearbetar...' : quantityLeft > 0 ? 'Köp Nu' : 'Slutsåld'}
        </Button>

        <div className="space-y-2">
          <p className="text-xs text-center text-gray-500">
            Säker betalning via Stripe
          </p>
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <Bitcoin className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};