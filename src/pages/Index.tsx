import { useState } from "react";
import { DealCard } from "@/components/DealCard";
import { Categories } from "@/components/Categories";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredDeals = [
  {
    id: 5,
    title: "Lyxig Spahelg för Två",
    description: "Romantisk spaupplevelse med övernattning och behandlingar",
    imageUrl: "https://images.unsplash.com/photo-1531256379416-9f000e90aacc?w=800",
    originalPrice: 4990,
    discountedPrice: 2495,
    timeRemaining: "48 timmar kvar",
    category: "Skönhet & Spa",
  },
  {
    id: 6,
    title: "Michelin-stjärnig Matupplevelse",
    description: "7-rätters avsmakningsmeny med vinpaket",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
    originalPrice: 3990,
    discountedPrice: 2790,
    timeRemaining: "24 timmar kvar",
    category: "Restauranger",
  },
  {
    id: 7,
    title: "Exklusiv Golfhelg",
    description: "2 dagars golfpaket med boende och greenfee",
    imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
    originalPrice: 5990,
    discountedPrice: 3995,
    timeRemaining: "72 timmar kvar",
    category: "Sport & Fritid",
  }
];

const deals = [
  {
    id: 1,
    title: "Lyxig Spa-dag",
    description: "Heldags spa-tillgång med 60 minuters massage och ansiktsbehandling",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800",
    originalPrice: 2000,
    discountedPrice: 990,
    timeRemaining: "2 dagar kvar",
    category: "Skönhet & Spa",
  },
  {
    id: 2,
    title: "3-rätters Gourmetmiddag",
    description: "Exklusiv matupplevelse på prisbelönt restaurang",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    originalPrice: 1500,
    discountedPrice: 750,
    timeRemaining: "3 dagar kvar",
    category: "Restauranger",
  },
  {
    id: 3,
    title: "Äventyrspark Heldagsbiljett",
    description: "Tillgång till alla attraktioner under en hel dag",
    imageUrl: "https://images.unsplash.com/photo-1536768139911-e290a59011e4?w=800",
    originalPrice: 800,
    discountedPrice: 450,
    timeRemaining: "5 dagar kvar",
    category: "Aktiviteter",
  },
  {
    id: 4,
    title: "Weekendpaket",
    description: "2 nätter på lyxhotell med frukost",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    originalPrice: 4000,
    discountedPrice: 2490,
    timeRemaining: "7 dagar kvar",
    category: "Resor",
  },
];

const navigationItems = [
  {
    title: "Kategorier",
    items: [
      { title: "Skönhet & Spa", href: "#" },
      { title: "Restauranger", href: "#" },
      { title: "Aktiviteter", href: "#" },
      { title: "Resor", href: "#" },
    ],
  },
  {
    title: "Populära",
    items: [
      { title: "Veckans Deals", href: "#" },
      { title: "Mest Sålda", href: "#" },
      { title: "Nya Erbjudanden", href: "#" },
    ],
  },
  {
    title: "Om Oss",
    items: [
      { title: "Kontakta Oss", href: "#" },
      { title: "Kundservice", href: "#" },
      { title: "Villkor", href: "#" },
    ],
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Alla Erbjudanden");

  const filteredDeals = selectedCategory === "Alla Erbjudanden"
    ? deals
    : deals.filter(deal => deal.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hetaste Erbjudandena</h1>
              <p className="mt-2 text-gray-600">Missa inte våra mest populära deals!</p>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((section) => (
                  <NavigationMenuItem key={section.title}>
                    <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {section.items.map((item) => (
                          <li key={item.title}>
                            <NavigationMenuLink asChild>
                              <a
                                href={item.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                              </a>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {featuredDeals.map((deal) => (
                  <CarouselItem key={deal.id} className="md:basis-1/2 lg:basis-1/3">
                    <DealCard {...deal} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDeals.map((deal) => (
            <DealCard key={deal.id} {...deal} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
