import { Button } from "@/components/ui/button";
import { Menu, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { CategorySelector } from "../CategorySelector";
import { CitySelector } from "../CitySelector";
import { SearchBar } from "../SearchBar";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  currentCity: string;
  onCitySelect: (city: string) => void;
  onCategorySelect: (category: string) => void;
  session: Session | null;
  onLogout: () => Promise<void>;
}

export const MobileNav = ({
  isOpen,
  setIsOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  currentCity,
  onCitySelect,
  onCategorySelect,
  session,
  onLogout
}: MobileNavProps) => {
  const navigate = useNavigate();

  return (
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
        onOpenAutoFocus={(e) => e.preventDefault()}
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
                  onCitySelect={onCitySelect}
                  variant="mobile"
                />
              </div>

              <div>
                <h3 className="font-medium mb-3 text-sm text-muted-foreground">Kategorier</h3>
                <CategorySelector 
                  onCategorySelect={onCategorySelect}
                  variant="mobile"
                />
              </div>

              <div className="pt-4 border-t">
                {session ? (
                  <Button
                    variant="default"
                    className="w-full gap-2"
                    onClick={onLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logga ut
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="w-full gap-2"
                    onClick={() => {
                      navigate("/login");
                      setIsOpen(false);
                    }}
                  >
                    <UserRound className="h-4 w-4" />
                    Logga in
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};