
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DealImageProps {
  imageUrl: string;
  title: string;
  isNew?: boolean;
  className?: string;
}

export const DealImage = ({ 
  imageUrl, 
  title, 
  isNew = false,
  className
}: DealImageProps) => {
  return (
    <div className="relative overflow-hidden">
      <AspectRatio ratio={16 / 9} className={cn("bg-muted", className)}>
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </AspectRatio>
      
      {isNew && (
        <Badge 
          className="absolute top-2 right-2 bg-yellow-400 text-yellow-950 hover:bg-yellow-400 border-none text-xs font-medium py-0.5 px-1.5"
        >
          Nytt
        </Badge>
      )}
    </div>
  );
};
