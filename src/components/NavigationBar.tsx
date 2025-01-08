import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { CategorySelector } from "./CategorySelector";
import { CitySelector } from "./CitySelector";
import { SearchBar } from "./SearchBar";

export const NavigationBar = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const currentCity = searchParams.get("city") || "Alla Städer";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    navigate(`/search?${params.toString()}`);
    setIsOpen(false);
  };

  const handleCityClick = (city: string) => {
    const params = new URLSearchParams(searchParams);
    if (city === "Alla Städer") {
      params.delete("city");
    } else {
      params.set("city", city);
    }
    navigate(`/search?${params.toString()}`);
    setIsOpen(false);
  };

  const { data: { publicUrl } } = supabase
    .storage
    .from('assets')
    .getPublicUrl('Lyxdeal-logo.svg');

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
          aria-label="Gå till startsidan"
        >
          <img 
            src={publicUrl} 
            alt="Lyxdeal Logo" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Search Bar - Centered */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSubmit={handleSearch}
          className="flex-1 max-w-xl mx-auto hidden md:block"
        />

        {/* Desktop Navigation - Right aligned */}
        <div className="hidden md:flex items-center gap-4">
          <CitySelector 
            currentCity={currentCity}
            onCitySelect={handleCityClick}
          />
          <CategorySelector 
            onCategorySelect={handleCategoryClick}
          />
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden hover:bg-accent"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Öppna meny</span>
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-full sm:w-[300px] p-0"
            onOpenAutoFocus={(e) => e.preventDefault()} // Prevent autofocus when sheet opens
          >
            <ScrollArea className="h-full">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-lg">Meny</SheetTitle>
                </SheetHeader>
                
                <div className="p-4 border-b">
                  <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSubmit={handleSearch}
                    className="w-full"
                  />
                </div>

                <div className="flex-1 p-4 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3 text-sm text-muted-foreground">Städer</h3>
                    <CitySelector 
                      currentCity={currentCity}
                      onCitySelect={handleCityClick}
                      variant="mobile"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 text-sm text-muted-foreground">Kategorier</h3>
                    <CategorySelector 
                      onCategorySelect={handleCategoryClick}
                      variant="mobile"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};