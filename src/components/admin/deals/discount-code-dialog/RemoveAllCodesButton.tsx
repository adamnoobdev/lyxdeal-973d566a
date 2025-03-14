
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { removeAllDiscountCodes } from "@/utils/discountCodes";

export const RemoveAllCodesButton = () => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveAllCodes = async () => {
    if (isRemoving) return;

    const confirmed = window.confirm(
      "Är du säker på att du vill ta bort ALLA rabattkoder från databasen? Detta påverkar alla erbjudanden och kan inte ångras."
    );

    if (!confirmed) return;

    setIsRemoving(true);

    try {
      await toast.promise(
        removeAllDiscountCodes(),
        {
          loading: "Tar bort alla rabattkoder...",
          success: "Alla rabattkoder har tagits bort",
          error: "Kunde inte ta bort rabattkoderna"
        }
      );
    } catch (error) {
      console.error("Failed to remove all discount codes:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      className="gap-2"
      onClick={handleRemoveAllCodes}
      disabled={isRemoving}
    >
      <Trash2 className={`h-4 w-4 ${isRemoving ? "animate-spin" : ""}`} />
      <span>Ta bort alla rabattkoder</span>
    </Button>
  );
};

