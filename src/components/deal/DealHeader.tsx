import { CategoryBadge } from "../CategoryBadge";

interface DealHeaderProps {
  title: string;
  category: string;
}

export const DealHeader = ({ title, category }: DealHeaderProps) => {
  return (
    <div className="space-y-4">
      <CategoryBadge 
        category={category} 
        className="bg-primary/5 text-primary hover:bg-primary/10 transition-colors" 
      />
      
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
    </div>
  );
};