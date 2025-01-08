import { memo } from "react";
import { DealCard } from "@/components/DealCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Deal {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  timeRemaining: string;
  category: string;
  city: string;
  created_at: string;
}

interface DealsGridProps {
  deals: Deal[];
  onDealClick?: (dealId: number) => void;
}

const DealsGridComponent = ({ deals, onDealClick }: DealsGridProps) => {
  return (
    <>
      {/* Mobile Layout - Horizontal Scroll */}
      <div className="block sm:hidden px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 pb-4">
            {deals.map((deal) => (
              <div 
                key={deal.id} 
                onClick={() => onDealClick?.(deal.id)}
                className="w-[280px] shrink-0"
              >
                <DealCard {...deal} />
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden sm:grid gap-4 px-4 sm:px-0 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {deals.map((deal) => (
          <div key={deal.id} onClick={() => onDealClick?.(deal.id)}>
            <DealCard {...deal} />
          </div>
        ))}
      </div>
    </>
  );
};

export const DealsGrid = memo(DealsGridComponent);