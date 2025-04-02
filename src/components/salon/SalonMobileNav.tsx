
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { SalonSidebarContent } from "./sidebar/SalonSidebarContent";
import { useLocation } from "react-router-dom";

export const SalonMobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button 
          variant="outline"
          size="icon"
          className="fixed left-1/2 bottom-6 -translate-x-1/2 z-40 shadow-md md:hidden bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Salong Meny</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] pt-8">
        <div className="px-4 overflow-y-auto">
          <SalonSidebarContent 
            currentPath={location.pathname}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
