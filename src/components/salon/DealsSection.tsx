import { Deal } from "@/components/admin/types";
import { DealsTable } from "@/components/admin/deals/DealsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DealsSectionProps {
  title: string;
  deals: Deal[];
  alertVariant?: "default" | "destructive";
  alertMessage?: string;
  onEdit: (deal: Deal) => void;
  onDelete: (deal: Deal) => void;
}

export const DealsSection = ({
  title,
  deals,
  alertVariant = "default",
  alertMessage,
  onEdit,
  onDelete,
}: DealsSectionProps) => {
  if (!deals.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {alertMessage && (
        <Alert variant={alertVariant}>
          {alertVariant === "destructive" && <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <DealsTable deals={deals} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};