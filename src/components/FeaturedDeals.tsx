import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
}

interface FeaturedDealsProps {
  deals: Deal[];
}

export const FeaturedDeals = ({ deals }: FeaturedDealsProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {deals.map((deal) => (
          <CarouselItem key={deal.id} className="md:basis-1/2 lg:basis-1/3">
            <DealCard {...deal} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
};