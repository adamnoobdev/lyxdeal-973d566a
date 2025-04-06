
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Rating } from "@/components/ui/rating";
import { Salon } from "@/components/admin/types";

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
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  // Använd antingen extern eller lokal isSubmitting status
  const submitting = isSubmitting || localSubmitting;

  // Properly reset values when dialog opens with new salon
  useEffect(() => {
    if (salon && isOpen) {
      setRating(salon.rating || 0);
      setComment(salon.rating_comment || "");
      setIsClosing(false);
    }
  }, [salon, isOpen]);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSave = async () => {
    if (!salon || submitting) return;
    
    try {
      setLocalSubmitting(true);
      console.log("Saving rating for salon:", salon.id, "rating:", rating, "comment:", comment);
      const success = await onSave(salon.id, rating, comment);
      
      if (success) {
        toast.success("Salongens betyg har uppdaterats");
        handleClose();
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Ett fel uppstod vid betygsättning");
    } finally {
      setLocalSubmitting(false);
    }
  };

  // Controlled dialog closing with state to prevent freezing
  const handleClose = () => {
    if (submitting) return;
    
    setIsClosing(true);
    // Use timeout to allow animations to complete before state changes
    setTimeout(() => {
      onClose();
      // Only reset after dialog is fully closed to prevent UI flicker
      setTimeout(() => {
        if (!isOpen) {
          setIsClosing(false);
        }
      }, 100);
    }, 300);
  };

  if (!salon) return null;

  return (
    <Dialog 
      open={isOpen && !isClosing}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Betygsätt salong: {salon.name}</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rating" className="font-medium">Betyg</Label>
            <div className="flex items-center gap-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={rating === value ? "default" : "outline"}
                  onClick={() => handleStarClick(value)}
                  className="w-10 h-10 p-0"
                  disabled={submitting}
                >
                  {value}
                </Button>
              ))}
            </div>
            <div className="mt-2">
              <Rating value={rating} size="lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="font-medium">Motivering (synlig endast för admin)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Skriv en motivering för betyget..."
              rows={4}
              disabled={submitting}
            />
            <p className="text-xs text-muted-foreground">
              Förklara varför du ger detta betyg så att andra administratörer förstår.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Avbryt
          </Button>
          <Button onClick={handleSave} disabled={rating === 0 || submitting}>
            {submitting ? "Sparar..." : "Spara betyg"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
