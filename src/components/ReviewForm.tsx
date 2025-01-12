import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { StarRating } from "./review/StarRating";
import { AuthCheck } from "./review/AuthCheck";
import { useSession } from "@/hooks/useSession";

interface ReviewFormProps {
  dealId: number;
}

export const ReviewForm = ({ dealId }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session, user } = useSession();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Du måste vara inloggad för att lämna en recension");
      return;
    }

    if (rating === 0) {
      toast.error("Vänligen välj ett betyg");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .insert([
          {
            deal_id: dealId,
            rating,
            comment: comment.trim() || null,
            user_id: user.id
          },
        ]);

      if (error) throw error;

      toast.success("Tack för din recension!");
      setRating(0);
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["reviews", dealId.toString()] });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Kunde inte skicka recensionen");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return <AuthCheck />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StarRating
        rating={rating}
        hoverRating={hoverRating}
        onHover={setHoverRating}
        onRate={setRating}
      />
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium mb-2">
          Kommentar (valfritt)
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Skriv din recension här..."
          className="min-h-[100px]"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting || rating === 0}
        className="w-full"
      >
        {isSubmitting ? "Skickar..." : "Skicka recension"}
      </Button>
    </form>
  );
};