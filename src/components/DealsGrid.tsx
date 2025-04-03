
import { memo } from "react";
import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";
import { ResponsiveGrid } from "./common/ResponsiveGrid";

interface DealsGridProps {
  deals: Deal[];
  className?: string;
  scrollable?: boolean;
}

const DealsGridComponent = ({ deals, className = "", scrollable = false }: DealsGridProps) => {
  if (!deals?.length) {
    return null;
  }

  if (scrollable) {
    return (
      <div className={`overflow-x-auto pb-4 -mx-4 px-4 ${className}`}>
        <div className="flex gap-3 min-w-max">
          {deals.map((deal) => (
            <div key={deal.id} className="w-[calc(50%-6px)] xs:w-[240px] min-w-[240px] flex-shrink-0">
              <DealCard {...deal} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ResponsiveGrid 
      className={className} 
      gap="gap-3" 
      columns="grid-cols-2"
    >
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          {...deal}
        />
      ))}
    </ResponsiveGrid>
  );
};

export const DealsGrid = memo(DealsGridComponent);
