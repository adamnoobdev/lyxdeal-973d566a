
import { SalonsTable } from "./SalonsTable";
import { SalonsLoadingSkeleton } from "./SalonsLoadingSkeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Salon } from "../types";

interface SalonsContentProps {
  onCreateClick: () => void;
  onEditClick: (salon: Salon) => void;
  onDeleteClick: (salon: Salon) => void;
  onSelect?: (salon: Salon | null) => void;
  onRate?: (salon: Salon) => void;
  selectedSalon?: Salon | null;
  salons?: Salon[];
  isLoading?: boolean;
  error?: string | null;
}

export const SalonsContent = ({
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onSelect,
  selectedSalon,
  salons = [],
  isLoading = false,
  error = null,
  onRate
}: SalonsContentProps) => {
  // Function to approve all salons
  const handleApproveAll = async () => {
    try {
      // This is just a placeholder - in a real scenario this would call an API endpoint
      toast.success("Alla villkor godkända");
    } catch (err) {
      toast.error("Ett fel uppstod vid godkännande");
    }
  };

  if (isLoading) {
    return <SalonsLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="mt-4 p-4 border rounded bg-red-50 text-red-600">
        <p>Ett fel uppstod: {error}</p>
        <Button
          onClick={onCreateClick}
          variant="outline"
          className="mt-2"
        >
          Försök igen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden shadow-sm p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Snabbåtgärder</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleApproveAll}
          >
            <CheckCircle className="h-4 w-4 text-primary" />
            Godkänn alla villkor
          </Button>
        </div>
      </Card>
      
      <div className="rounded-md overflow-hidden bg-card border shadow-sm">
        <SalonsTable
          salons={salons}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
          onSelect={onSelect}
          selectedSalon={selectedSalon}
          onRate={onRate}
        />
      </div>
    </div>
  );
};
