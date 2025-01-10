import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";
import { ResponsiveGrid } from "./common/ResponsiveGrid";

interface DealsGridProps {
  deals: Deal[];
  className?: string;
}

export function DealsGrid({ deals, className = "" }: DealsGridProps) {
  if (!deals?.length) {
    return null;
  }

  return (
    <ResponsiveGrid className={className}>
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
        />
      ))}
    </ResponsiveGrid>
  );
}