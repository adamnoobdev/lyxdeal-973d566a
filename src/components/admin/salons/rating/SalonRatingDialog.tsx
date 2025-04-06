
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Salon } from "@/components/admin/types";
import { RatingSlider } from "./RatingSlider";
import { CommentField } from "./CommentField";
import { DialogFooterButtons } from "./DialogFooterButtons";
import { useRatingDialog } from "./useRatingDialog";

interface SalonRatingDialogProps {
  salon: Salon | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (salonId: number, rating: number, comment: string) => Promise<boolean>;
  isSubmitting?: boolean;
}

export const SalonRatingDialog = ({
  salon,
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}: SalonRatingDialogProps) => {
  const {
    rating,
    comment,
    setRating,
    setComment,
    submitting,
    isClosing,
    isMounted,
    handleSave,
    handleClose
  } = useRatingDialog({
    salon,
    isOpen,
    onClose,
    onSave,
    isSubmitting
  });

  // Don't render if component is not mounted or if there's no salon
  if (!isMounted || !salon) {
    console.log("[SalonRatingDialog] Not rendering: isMounted=", isMounted, "salon=", !!salon);
    return null;
  }

  return (
    <Dialog 
      open={isOpen && !isClosing}
      onOpenChange={(open) => {
        console.log("[SalonRatingDialog] Dialog open state changed to:", open, "submitting:", submitting);
        if (!open && !submitting) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Betygsätt salong: {salon.name}</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <RatingSlider 
            rating={rating} 
            onRatingChange={setRating} 
            disabled={submitting}
          />

          <CommentField 
            comment={comment} 
            onCommentChange={setComment} 
            disabled={submitting}
          />
        </div>

        <DialogFooter>
          <DialogFooterButtons 
            onClose={handleClose}
            onSave={handleSave}
            disabled={submitting}
            submitting={submitting}
            ratingValue={rating}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
