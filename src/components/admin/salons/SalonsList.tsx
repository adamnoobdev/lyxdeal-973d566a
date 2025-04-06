
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { SalonsHeader } from "./SalonsHeader";
import { SalonsContent } from "./SalonsContent";
import { SalonsDialogs } from "./SalonsDialogs";
import { useSalonsList } from "@/hooks/useSalonsList";

/**
 * Component for listing and managing salons in the admin interface
 */
export const SalonsList = () => {
  const {
    salons,
    isLoading,
    error,
    editingSalon,
    deletingSalon,
    selectedSalon,
    isCreating,
    ratingSalon,
    isRating,
    setEditingSalon,
    setDeletingSalon,
    setSelectedSalon,
    setIsCreating,
    setRatingSalon,
    onDelete,
    onUpdate,
    onCreate,
    onRate,
    getInitialValuesForEdit
  } = useSalonsList();

  return (
    <div className="space-y-4 sm:space-y-6 px-2 xs:px-4 sm:px-0">
      <SalonsHeader 
        onCreateClick={() => setIsCreating(true)} 
      />

      {error && (
        <Alert variant="destructive" className="mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs xs:text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <SalonsContent
        salons={salons}
        isLoading={isLoading}
        error={error}
        onCreateClick={() => setIsCreating(true)}
        onEditClick={setEditingSalon}
        onDeleteClick={setDeletingSalon}
        onSelect={setSelectedSalon}
        selectedSalon={selectedSalon}
        onRate={setRatingSalon}
      />

      <SalonsDialogs
        editingSalon={editingSalon}
        deletingSalon={deletingSalon}
        isCreating={isCreating}
        ratingSalon={ratingSalon}
        isRating={isRating}
        onEditClose={() => setEditingSalon(null)}
        onDeleteClose={() => setDeletingSalon(null)}
        onCreateClose={() => setIsCreating(false)}
        onRatingClose={() => setRatingSalon(null)}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onCreate={onCreate}
        onRate={onRate}
        getInitialValuesForEdit={getInitialValuesForEdit}
      />
    </div>
  );
};
