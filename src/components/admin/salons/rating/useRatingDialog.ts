
import { useState, useRef, useEffect } from "react";
import { Salon } from "@/components/admin/types";
import { toast } from "sonner";

interface UseRatingDialogProps {
  salon: Salon | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (salonId: number, rating: number, comment: string) => Promise<boolean>;
  isSubmitting?: boolean;
}

export const useRatingDialog = ({
  salon,
  isOpen,
  onClose,
  onSave,
  isSubmitting = false
}: UseRatingDialogProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track component mount state
  useEffect(() => {
    setIsMounted(true);
    console.log("[useRatingDialog] Hook initialized");
    
    return () => {
      console.log("[useRatingDialog] Hook cleanup");
      setIsMounted(false);
      
      // Clear any pending timeouts on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  // Reset values when dialog opens with new salon and ensure component is mounted
  useEffect(() => {
    if (salon && isOpen && isMounted) {
      console.log("[useRatingDialog] Dialog opening with salon:", salon.name);
      console.log("[useRatingDialog] Salon rating from database (already converted to decimal):", salon.rating);
      // Set initial rating (it's already in decimal format from useSalonsAdmin)
      setRating(salon.rating || 0);
      setComment(salon.rating_comment || "");
      setIsClosing(false);
    }
  }, [salon, isOpen, isMounted]);

  // Using either external or local isSubmitting status
  const submitting = isSubmitting || localSubmitting;

  const handleSave = async () => {
    if (!salon || submitting || !isMounted) return;
    
    try {
      setLocalSubmitting(true);
      console.log("[useRatingDialog] Saving rating for salon:", salon.id, "rating:", rating, "comment:", comment);
      const success = await onSave(salon.id, rating, comment);
      
      if (success && isMounted) {
        handleClose();
      }
    } catch (error) {
      console.error("[useRatingDialog] Error saving rating:", error);
      if (isMounted) {
        toast.error("Ett fel uppstod vid betygsättning");
      }
    } finally {
      if (isMounted) {
        setLocalSubmitting(false);
      }
    }
  };

  // Improved controlled dialog closing with better state management
  const handleClose = () => {
    if (submitting) {
      console.log("[useRatingDialog] Cannot close during submission");
      return;
    }
    
    console.log("[useRatingDialog] Starting controlled close sequence");
    setIsClosing(true);
    
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Set new timeout
    closeTimeoutRef.current = setTimeout(() => {
      if (isMounted) {
        console.log("[useRatingDialog] Executing close callback");
        onClose();
        
        // Reset closing state after a brief delay
        closeTimeoutRef.current = setTimeout(() => {
          if (isMounted) {
            console.log("[useRatingDialog] Resetting closing state");
            setIsClosing(false);
          }
        }, 100);
      }
    }, 200);
  };

  return {
    rating,
    comment,
    setRating,
    setComment,
    submitting,
    isClosing,
    isMounted,
    handleSave,
    handleClose
  };
};
