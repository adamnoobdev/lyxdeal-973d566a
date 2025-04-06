
import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Rating } from "@/components/ui/rating";
import { Salon } from "@/components/admin/types";
import { Slider } from "@/components/ui/slider";

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
  const [isMounted, setIsMounted] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track component mount state
  useEffect(() => {
    setIsMounted(true);
    console.log("[SalonRatingDialog] Component mounted");
    
    return () => {
      console.log("[SalonRatingDialog] Component unmounting");
      setIsMounted(false);
      
      // Clear any pending timeouts on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  
  // Använd antingen extern eller lokal isSubmitting status
  const submitting = isSubmitting || localSubmitting;

  // Reset values when dialog opens with new salon and ensure component is mounted
  useEffect(() => {
    if (salon && isOpen && isMounted) {
      console.log("[SalonRatingDialog] Dialog opening with salon:", salon.name);
      // Set initial rating (it's already in decimal format from useSalonsAdmin)
      setRating(salon.rating || 0);
      setComment(salon.rating_comment || "");
      setIsClosing(false);
    }
  }, [salon, isOpen, isMounted]);

  const handleSliderChange = (value: number[]) => {
    if (submitting) return;
    // Round to 1 decimal place for display
    const newRating = Math.round(value[0] * 10) / 10;
    setRating(newRating);
  };

  const handleSave = async () => {
    if (!salon || submitting || !isMounted) return;
    
    try {
      setLocalSubmitting(true);
      console.log("[SalonRatingDialog] Saving rating for salon:", salon.id, "rating:", rating, "comment:", comment);
      const success = await onSave(salon.id, rating, comment);
      
      if (success && isMounted) {
        toast.success("Salongens betyg har uppdaterats");
        handleClose();
      }
    } catch (error) {
      console.error("[SalonRatingDialog] Error saving rating:", error);
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
      console.log("[SalonRatingDialog] Cannot close during submission");
      return;
    }
    
    console.log("[SalonRatingDialog] Starting controlled close sequence");
    setIsClosing(true);
    
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    
    // Set new timeout
    closeTimeoutRef.current = setTimeout(() => {
      if (isMounted) {
        console.log("[SalonRatingDialog] Executing close callback");
        onClose();
        
        // Reset closing state after a brief delay
        closeTimeoutRef.current = setTimeout(() => {
          if (isMounted) {
            console.log("[SalonRatingDialog] Resetting closing state");
            setIsClosing(false);
          }
        }, 100);
      }
    }, 200);
  };

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
          <div className="space-y-2">
            <Label htmlFor="rating" className="font-medium">Betyg: {rating.toFixed(1)}</Label>
            
            <div className="py-6 px-2">
              <Slider
                defaultValue={[rating]}
                max={5}
                min={0}
                step={0.1}
                value={[rating]}
                onValueChange={handleSliderChange}
                disabled={submitting}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0.0</span>
                <span>1.0</span>
                <span>2.0</span>
                <span>3.0</span>
                <span>4.0</span>
                <span>5.0</span>
              </div>
            </div>
            
            <div className="mt-2">
              <Rating value={rating} size="lg" showValue={true} />
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

        <DialogFooter className="flex flex-col xs:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} disabled={submitting} className="w-full xs:w-auto">
            Avbryt
          </Button>
          <Button onClick={handleSave} disabled={rating === 0 || submitting} className="w-full xs:w-auto">
            {submitting ? "Sparar..." : "Spara betyg"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
