
import { useState } from "react";
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
  const [rating, setRating] = useState<number>(salon?.rating || 0);
  const [comment, setComment] = useState<string>(salon?.rating_comment || "");
  const [localSubmitting, setLocalSubmitting] = useState(false);
  
  // Använd antingen extern eller lokal isSubmitting status
  const submitting = isSubmitting || localSubmitting;

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSave = async () => {
    if (!salon) return;
    
    try {
      setLocalSubmitting(true);
      const success = await onSave(salon.id, rating, comment);
      if (success) {
        toast.success("Salongens betyg har uppdaterats");
        onClose();
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Ett fel uppstod vid betygsättning");
    } finally {
      setLocalSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  // Reset values when salon changes
  useState(() => {
    if (salon) {
      setRating(salon.rating || 0);
      setComment(salon.rating_comment || "");
    }
  });

  if (!salon) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
