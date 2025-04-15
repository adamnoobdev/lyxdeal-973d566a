
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { createCreatorDiscountCode } from "@/utils/creator-codes/generator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface CreatorDealActionProps {
  dealId: number;
  dealTitle: string;
  salonId: number;
}

export const CreatorDealAction: React.FC<CreatorDealActionProps> = ({
  dealId,
  dealTitle,
  salonId
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const { user, profile } = useAuth();

  // Om användaren inte är inloggad eller inte är en kreatör, visa ingenting
  if (!user || profile?.role !== 'creator') {
    return null;
  }

  const handleCreatePartnership = async () => {
    try {
      setIsLoading(true);
      
      // Använd användarens Instagram handle eller namn för att skapa en kod
      const creatorHandle = profile?.instagram_handle || user.email?.split('@')[0] || 'creator';
      
      const code = await createCreatorDiscountCode(
        user.id,
        creatorHandle,
        dealId,
        salonId
      );
      
      if (code) {
        setDiscountCode(code);
        toast.success('Din unika rabattkod har skapats!');
      } else {
        toast.error('Kunde inte skapa rabattkod. Försök igen senare.');
      }
    } catch (error) {
      console.error('Error creating creator partnership:', error);
      toast.error('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsLoading(false);
    }
  };

  if (discountCode) {
    return (
      <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
        <h3 className="font-medium text-green-800 mb-2">Din unika kreatörskod: {discountCode}</h3>
        <p className="text-sm text-green-700 mb-4">
          Dela den här koden med dina följare och skapa innehåll om behandlingen för att få den gratis!
        </p>
        <Button 
          variant="outline" 
          onClick={() => {
            navigator.clipboard.writeText(discountCode);
            toast.success('Rabattkoden kopierad!');
          }}
          className="w-full"
        >
          Kopiera rabattkod
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg">
      <h3 className="font-medium text-blue-800 mb-2">Kreatörsmöjlighet</h3>
      <p className="text-sm text-blue-700 mb-4">
        Vill du samarbeta med denna salong? Skapa innehåll om den här behandlingen och få den gratis!
      </p>
      <Button 
        onClick={handleCreatePartnership} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Bearbetar...' : 'Bli kreatörspartner för detta erbjudande'}
      </Button>
    </div>
  );
};
