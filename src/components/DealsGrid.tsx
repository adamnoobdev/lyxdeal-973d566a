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
}

interface DealsGridProps {
  deals: Deal[];
  onDealClick: (dealId: number) => void;
}

export const DealsGrid = ({ deals, onDealClick }: DealsGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {deals.map((deal) => (
        <div key={deal.id} onClick={() => onDealClick(deal.id)}>
          <DealCard {...deal} />
        </div>
      ))}
    </div>
  );
};