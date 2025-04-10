
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { updateSalonSubscription } from "@/utils/salon/admin";

interface SubscriptionUpdateButtonProps {
  salonId: number;
  currentPlan: string;
  currentType: string;
  skipSubscription?: boolean;
  onSuccess?: () => void;
}

export const SubscriptionUpdateButton = ({ 
  salonId, 
  currentPlan, 
  currentType,
  skipSubscription = false,
  onSuccess 
}: SubscriptionUpdateButtonProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleForceUpdate = async () => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      await updateSalonSubscription(salonId, currentPlan, currentType, skipSubscription);
      toast.success("Prenumerationsplan uppdaterad via direkt API-anrop");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error forcing subscription update:", error);
      toast.error("Kunde inte uppdatera prenumerationsplan");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Button
      variant="outline" 
      size="sm"
      onClick={handleForceUpdate}
      disabled={isUpdating}
      className="text-xs"
    >
      {isUpdating ? "Uppdaterar..." : "Tvinga uppdatering av plan"}
    </Button>
  );
};
