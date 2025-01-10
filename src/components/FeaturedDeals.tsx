import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { DealCard } from "@/components/DealCard";
import { useEffect, useState, useCallback } from "react";

interface Deal {
  id: number;
  title: string;
  description: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  time_remaining: string;
  category: string;
  city: string;
  created_at: string;
  quantityLeft: number;
}

interface FeaturedDealsProps {
  deals: Deal[];
}

export const FeaturedDeals = ({ deals }: FeaturedDealsProps) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  const handleSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.on("select", handleSelect);
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => {
      clearInterval(interval);
      api.off("select", handleSelect);
    };
  }, [api, handleSelect]);

  return (
    <div className="-mx-4 md:mx-0">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {deals.map((deal) => (
            <CarouselItem key={deal.id} className="pl-0 basis-full">
              <DealCard {...deal} featured={true} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};