
import { useCallback, useRef } from "react";
import { Salon, SalonFormValues } from "@/components/admin/types";
import { toast } from "sonner";

/**
 * Hook for handling salon operations with action tracking
 */
export const useSalonOperationsWithTracking = (
  handleDelete: (id: number) => Promise<boolean>,
  handleUpdate: (values: any, id: number) => Promise<boolean>,
  handleCreate: (values: any) => Promise<any>,
  fetchSalons: () => Promise<void>,
  isMountedRef: React.MutableRefObject<boolean>
) => {
  // Reference to track if an operation is in progress
  const actionInProgressRef = useRef(false);

  /**
   * Handle salon deletion with action tracking
   */
  const onDelete = useCallback(async (deletingSalon: Salon | null, selectedSalon: Salon | null, setSelectedSalon: (salon: Salon | null) => void, setDeletingSalon: (salon: Salon | null) => void) => {
    if (deletingSalon && !actionInProgressRef.current) {
      try {
        actionInProgressRef.current = true;
        console.log("[useSalonOperations] Deleting salon:", deletingSalon.name);
        
        const success = await handleDelete(deletingSalon.id);
        
        if (success && isMountedRef.current) {
          setDeletingSalon(null);
          
          if (selectedSalon?.id === deletingSalon.id) {
            setSelectedSalon(null);
          }
          
          toast.success(`Salongen "${deletingSalon.name}" har tagits bort`);
        }
      } catch (error) {
        console.error("[useSalonOperations] Error deleting salon:", error);
        toast.error("Ett fel uppstod vid borttagning av salongen");
      } finally {
        actionInProgressRef.current = false;
      }
    }
  }, [handleDelete, isMountedRef]);

  /**
   * Handle salon update with action tracking
   */
  const onUpdate = useCallback(async (values: any, editingSalon: Salon | null, setEditingSalon: (salon: Salon | null) => void) => {
    if (editingSalon && !actionInProgressRef.current) {
      try {
        actionInProgressRef.current = true;
        console.log("[useSalonOperations] Updating salon:", editingSalon.name, "with values:", values);
        
        const success = await handleUpdate(values, editingSalon.id);
        
        if (success && isMountedRef.current) {
          setEditingSalon(null);
          await fetchSalons();
        }
      } catch (error) {
        console.error("[useSalonOperations] Error updating salon:", error);
      } finally {
        actionInProgressRef.current = false;
      }
    }
  }, [handleUpdate, fetchSalons, isMountedRef]);

  /**
   * Handle salon creation with action tracking
   */
  const onCreate = useCallback(async (values: any) => {
    if (!actionInProgressRef.current) {
      try {
        actionInProgressRef.current = true;
        console.log("[useSalonOperations] Creating new salon with values:", values);
        
        const response = await handleCreate(values);
        return response;
      } catch (error) {
        console.error("[useSalonOperations] Error creating salon:", error);
        return false;
      } finally {
        actionInProgressRef.current = false;
      }
    }
    return false;
  }, [handleCreate]);

  return {
    onDelete,
    onUpdate,
    onCreate,
    actionInProgressRef
  };
};
