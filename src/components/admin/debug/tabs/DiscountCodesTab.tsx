
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database } from "lucide-react";

interface DiscountCodesTabProps {
  dealId: string;
  setDealId: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  lastResult: string;
  handleListAllCodes: () => Promise<void>;
  handleCountCodes: () => Promise<void>;
  handleGenerateCodes: () => Promise<void>;
  handleRemoveAllCodes: () => Promise<void>;
}

export const DiscountCodesTab = ({
  dealId,
  setDealId,
  quantity,
  setQuantity,
  lastResult,
  handleListAllCodes,
  handleCountCodes,
  handleGenerateCodes,
  handleRemoveAllCodes
}: DiscountCodesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Erbjudande-ID (valfritt)</label>
          <Input
            value={dealId}
            onChange={(e) => setDealId(e.target.value)}
            placeholder="Erbjudande-ID"
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm">Antal</label>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Antal koder"
            className="mt-1"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleListAllCodes}>
          Lista alla koder
        </Button>
        <Button variant="outline" onClick={handleCountCodes}>
          Räkna koder
        </Button>
        <Button variant="outline" onClick={handleGenerateCodes}>
          Generera koder
        </Button>
        <Button variant="destructive" onClick={handleRemoveAllCodes}>
          Ta bort koder
        </Button>
      </div>
      
      {lastResult && (
        <Alert className="mt-4 bg-gray-50">
          <Database className="h-4 w-4" />
          <AlertDescription>
            {lastResult}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
