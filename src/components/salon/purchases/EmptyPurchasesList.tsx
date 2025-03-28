
import { FileX } from "lucide-react";

export const EmptyPurchasesList = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
      <FileX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">Inga rabattkoder har hämtats än</h3>
      <p className="text-muted-foreground max-w-md mt-1">
        När kunder säkrar dina erbjudanden och hämtar rabattkoder kommer de att visas här.
      </p>
    </div>
  );
};
