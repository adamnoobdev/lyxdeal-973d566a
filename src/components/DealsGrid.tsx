import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";

interface DealsGridProps {
  deals: Deal[];
  className?: string;
}

export function DealsGrid({ deals, className = "" }: DealsGridProps) {
  if (!deals?.length) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
        />
      ))}
    </div>
  );
}