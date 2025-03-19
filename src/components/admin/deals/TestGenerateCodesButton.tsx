
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { testDiscountCodeGeneration } from "@/utils/discount-codes/debug";
import { toast } from "sonner";

interface TestGenerateCodesButtonProps {
  dealId: number;
  onSuccess?: () => void;
}

export const TestGenerateCodesButton = ({ dealId, onSuccess }: TestGenerateCodesButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleClick = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      console.log(`[TestGenerateCodesButton] Starting test generation for deal ${dealId}`);
      const result = await testDiscountCodeGeneration(dealId);
      
      if (result) {
        toast.success("Testgenereringsprocess genomförd");
        if (onSuccess) onSuccess();
      } else {
        toast.error("Testgenerering misslyckades");
      }
    } catch (error) {
      console.error("Error during test code generation:", error);
      toast.error("Ett fel uppstod vid testgenerering");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted || process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="bg-gray-100 p-2 rounded-md border border-dashed border-gray-300">
      <p className="text-xs text-gray-500 mb-2">
        <span className="font-bold">DEV ONLY:</span> Testa alternativ genereringsmetod
      </p>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className="h-7 text-xs w-full"
      >
        {isLoading ? "Arbetar..." : "Testa alternativ generering"}
      </Button>
    </div>
  );
};
