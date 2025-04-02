
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
import { Separator } from "../ui/separator";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentCity: string;
  onCitySelect: (city: string) => void;
  onCategorySelect: (category: string) => void;
  session: Session | null;
  onLogout: () => Promise<void>;
}

export const MobileNav = ({
  isOpen,
  setIsOpen,
  currentCity,
  onCitySelect,
  onCategorySelect,
}: MobileNavProps) => {
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
        className="w-[85vw] max-w-[300px] p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ScrollArea className="h-full">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-lg">Filtrera</SheetTitle>
            </SheetHeader>

            <div className="flex-1 p-4 space-y-6">
              <div>
                <h3 className="font-medium mb-3 text-sm text-muted-foreground">Städer</h3>
                <CitySelector 
                  currentCity={currentCity}
                  onCitySelect={onCitySelect}
                  variant="mobile"
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3 text-sm text-muted-foreground">Kategorier</h3>
                <CategorySelector 
                  onCategorySelect={onCategorySelect}
                  variant="mobile"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
