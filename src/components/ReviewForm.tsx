import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewFormProps {
  dealId: number;
}

export const ReviewForm = ({ dealId }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Betyg</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              className="p-1 hover:scale-110 transition-transform"
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(value)}
            >
              <Star
                className={`h-6 w-6 ${
                  value <= (hoverRating || rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
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