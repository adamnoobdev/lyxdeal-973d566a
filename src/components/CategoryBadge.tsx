import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "outline";
  className?: string;
}

export function CategoryBadge({ category, variant = "outline", className = "" }: CategoryBadgeProps) {
  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hudvård': return '✨';
      case 'laserhårborttagning': return '⚡';
      case 'fillers': return '💉';
      case 'rynkbehandlingar': return '🔄';
      case 'naglar': return '💅';
      case 'massage': return '💆‍♀️';
      case 'hårvård': return '💇‍♀️';
      default: return '✨';
    }
  };

  return (
    <Badge 
      variant={variant} 
      className={`inline-flex w-auto ${className}`}
    >
      {getCategoryEmoji(category)} {category}
    </Badge>
  );
}