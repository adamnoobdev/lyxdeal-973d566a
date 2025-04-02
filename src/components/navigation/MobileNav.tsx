
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
import { Link } from "react-router-dom";
import { UserRole } from "@/hooks/useUserRole";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentCity: string;
  onCitySelect: (city: string) => void;
  onCategorySelect: (category: string) => void;
  session: Session | null;
  userRole?: UserRole;
  onLogout: () => Promise<void>;
}

export const MobileNav = ({
  isOpen,
  setIsOpen,
  currentCity,
  onCitySelect,
  onCategorySelect,
  session,
  userRole,
  onLogout,
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
              <SheetTitle className="text-lg">Meny</SheetTitle>
            </SheetHeader>

            <div className="flex-1 p-4 space-y-6">
              {session ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Inloggad som {session.user?.email}</p>
                  
                  {userRole === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block p-2 hover:bg-accent rounded-md text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  {(userRole === 'salon_owner' || userRole === 'admin') && (
                    <Link 
                      to="/salon" 
                      className="block p-2 hover:bg-accent rounded-md text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Salong Dashboard
                    </Link>
                  )}
                  
                  <Link 
                    to="/profile" 
                    className="block p-2 hover:bg-accent rounded-md text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Min profil
                  </Link>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 h-auto text-sm font-normal hover:bg-destructive/10 hover:text-destructive"
                    onClick={async () => {
                      await onLogout();
                      setIsOpen(false);
                    }}
                  >
                    Logga ut
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    to="/salon/login" 
                    className="block p-2 hover:bg-accent rounded-md text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Logga in
                  </Link>
                  <Link 
                    to="/partner" 
                    className="block p-2 hover:bg-accent rounded-md text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Bli partner
                  </Link>
                </div>
              )}
              
              <Separator />

              <div>
                <Link 
                  to="/" 
                  className="block p-2 hover:bg-accent rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Hem
                </Link>
                <Link 
                  to="/search" 
                  className="block p-2 hover:bg-accent rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Sök erbjudanden
                </Link>
                <Link 
                  to="/faq" 
                  className="block p-2 hover:bg-accent rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Vanliga frågor
                </Link>
                <Link 
                  to="/contact" 
                  className="block p-2 hover:bg-accent rounded-md text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Kontakt
                </Link>
              </div>
              
              <Separator />

              <div>
                <h3 className="font-medium mb-3 text-sm text-muted-foreground">Städer</h3>
                <CitySelector 
                  currentCity={currentCity}
                  onCitySelect={(city) => {
                    onCitySelect(city);
                    setIsOpen(false);
                  }}
                  variant="mobile"
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-3 text-sm text-muted-foreground">Kategorier</h3>
                <CategorySelector 
                  onCategorySelect={(category) => {
                    onCategorySelect(category);
                    setIsOpen(false);
                  }}
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
