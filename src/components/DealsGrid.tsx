import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";

interface DealsGridProps {
  deals: Deal[];
  className?: string;
}

export function DealsGrid({ deals, className = "" }: DealsGridProps) {
  console.log('DealsGrid rendering with deals:', deals);
  
  if (!deals?.length) {
    console.log('No deals to display in DealsGrid');
    return null;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {deals.map((deal) => {
        console.log('Rendering deal:', deal);
        return (
          <DealCard
            key={deal.id}
            {...deal}
          />
        );
      })}
    </div>
  );
}