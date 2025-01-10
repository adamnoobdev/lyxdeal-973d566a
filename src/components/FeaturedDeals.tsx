import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DealCard } from "./DealCard";
import { Deal } from "@/types/deal";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertTriangle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export function FeaturedDeals() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const { data: deals, isLoading, error } = useQuery({
    queryKey: ['featuredDeals'],
    queryFn: async () => {
      console.log('Starting featured deals fetch...');
      try {
        console.log('Executing featured deals query...');
        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('featured', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching featured deals:', error);
          console.error('Error details:', error.message, error.details, error.hint);
          throw error;
        }

        console.log('Featured deals fetch successful. Number of deals:', data?.length);
        return data as Deal[];
      } catch (error) {
        console.error('Unexpected error in featured deals:', error);
        throw error;
      }
    },
  });

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, deals]);

  if (isLoading) {
    return (
      <div className="h-[500px] bg-accent/50 rounded-xl animate-pulse" />
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Det gick inte att hämta utvalda erbjudanden. Försök igen senare.
        </AlertDescription>
      </Alert>
    );
  }

  if (!deals?.length) {
    return null;
  }

  return (
    <Carousel
      ref={emblaRef}
      className="w-full relative group"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {deals.map((deal) => (
          <CarouselItem key={deal.id} className="basis-full">
            <div className="relative h-[500px] rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
              <DealCard {...deal} className="h-full" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CarouselNext className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Carousel>
  );
}