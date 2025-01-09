import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Tag } from "lucide-react";
import { CategoryBadge } from "./CategoryBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}: DealInfoProps) => {
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
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { dealId: id }
      });

      if (error) throw error;
      if (!data.url) throw new Error('No checkout URL received');

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Kunde inte starta köpet. Försök igen senare.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <CategoryBadge category={category} className="shadow-sm" />
      </div>
      
      <h1 className="text-3xl font-bold">{title}</h1>
      
      <div className="flex items-center gap-2">
        {renderStars(4.5)}
        <span className="text-sm text-gray-600">
          (4.5 / 5)
        </span>
      </div>
      
      <div className="space-y-2">
        <p className="text-lg text-gray-600">{description}</p>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Ordinarie pris</p>
          <p className="text-lg line-through">{formatPrice(originalPrice)}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Ditt pris</p>
          <p className="text-3xl font-bold text-primary">
            {formatPrice(discountedPrice)}
          </p>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={handlePurchase}
          disabled={quantityLeft <= 0}
        >
          {quantityLeft > 0 ? 'Köp Nu' : 'Slutsåld'}
        </Button>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{city}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span>{timeRemaining}</span>
        </div>
        {quantityLeft > 0 && (
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <span>{quantityLeft} kvar</span>
          </div>
        )}
      </div>
    </div>
  );
};