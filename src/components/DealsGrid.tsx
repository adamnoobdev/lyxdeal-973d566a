import { memo } from "react";
import { DealCard } from "@/components/DealCard";

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
    <div className="grid gap-4 px-4 sm:px-0 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {deals.map((deal) => (
        <div key={deal.id} onClick={() => onDealClick?.(deal.id)}>
          <DealCard {...deal} />
        </div>
      ))}
    </div>
  );
};

export const DealsGrid = memo(DealsGridComponent);