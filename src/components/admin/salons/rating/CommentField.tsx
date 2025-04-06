
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CommentFieldProps {
  comment: string;
  onCommentChange: (comment: string) => void;
  disabled?: boolean;
}

export const CommentField = ({
  comment,
  onCommentChange,
  disabled = false
}: CommentFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="comment" className="font-medium">Motivering (synlig endast för admin)</Label>
      <Textarea
        id="comment"
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Skriv en motivering för betyget..."
        rows={4}
        disabled={disabled}
      />
      <p className="text-xs text-muted-foreground">
        Förklara varför du ger detta betyg så att andra administratörer förstår.
      </p>
    </div>
  );
};
