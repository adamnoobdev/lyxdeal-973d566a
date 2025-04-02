
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Deal } from '@/types/deal';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DiscountCodesGeneratorProps {
  deal: Deal | null;
  onGenerateDiscountCodes?: (deal: Deal, quantity: number) => Promise<void>;
}

export const DiscountCodesGenerator = ({ 
  deal, 
  onGenerateDiscountCodes 
}: DiscountCodesGeneratorProps) => {
  const [quantity, setQuantity] = useState<string>("10");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDiscountCodes = async () => {
    if (!deal || !onGenerateDiscountCodes || isGenerating) return;
    
    try {
      setIsGenerating(true);
      await onGenerateDiscountCodes(deal, parseInt(quantity));
    } catch (error) {
      console.error("Error generating discount codes:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-medium">Generera fler rabattkoder</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div className="sm:col-span-2">
          <Label htmlFor="quantity">Antal koder</Label>
          <Select 
            value={quantity} 
            onValueChange={setQuantity}
          >
            <SelectTrigger id="quantity">
              <SelectValue placeholder="Välj antal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 koder</SelectItem>
              <SelectItem value="10">10 koder</SelectItem>
              <SelectItem value="20">20 koder</SelectItem>
              <SelectItem value="50">50 koder</SelectItem>
              <SelectItem value="100">100 koder</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="sm:col-span-2">
          <Button 
            onClick={handleGenerateDiscountCodes}
            disabled={isGenerating}
            className="w-full"
          >
            <PlusCircle className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
            Generera rabattkoder
          </Button>
        </div>
      </div>
    </div>
  );
};
