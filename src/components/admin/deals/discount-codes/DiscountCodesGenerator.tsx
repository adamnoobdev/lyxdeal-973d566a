
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Deal } from "@/types/deal";

interface DiscountCodesGeneratorProps {
  deal: Deal | null;
  onGenerateDiscountCodes: (deal: Deal, quantity: number) => Promise<void>;
}

export const DiscountCodesGenerator = ({ 
  deal, 
  onGenerateDiscountCodes 
}: DiscountCodesGeneratorProps) => {
  const [quantity, setQuantity] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!deal || isGenerating) return;
    
    setIsGenerating(true);
    try {
      await onGenerateDiscountCodes(deal, quantity);
    } catch (error) {
      console.error("Error generating codes:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Generera fler rabattkoder</h3>
      
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="w-full sm:w-auto">
          <Label htmlFor="quantity" className="mb-2 block">Antal</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 10)}
            min={1}
            max={100}
            className="w-full sm:w-28"
          />
        </div>
        
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="flex-1 sm:flex-none gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{isGenerating ? "Genererar..." : "Generera rabattkoder"}</span>
        </Button>
      </div>
    </div>
  );
};
