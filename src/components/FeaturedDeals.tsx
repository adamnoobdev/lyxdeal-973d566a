import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { DealCard } from "@/components/DealCard";
import { useEffect, useState } from "react";

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

interface FeaturedDealsProps {
  deals: Deal[];
}

export const FeaturedDeals = ({ deals }: FeaturedDealsProps) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      clearInterval(interval);
      api.destroy();
    };
  }, [api]);

  return (
    <div className="-mx-4 sm:mx-0">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0 sm:-ml-4">
          {deals.map((deal) => (
            <CarouselItem key={deal.id} className="pl-0 sm:pl-4 basis-full">
              <DealCard {...deal} featured={true} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};