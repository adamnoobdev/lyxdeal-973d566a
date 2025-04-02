
import { SidebarProvider } from "@/components/ui/sidebar";
import { SalonSidebar } from "@/components/salon/SalonSidebar";
import { SalonMobileNav } from "@/components/salon/SalonMobileNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalonLayoutProps {
  children: React.ReactNode;
}

export const SalonLayout = ({ children }: SalonLayoutProps) => {
  const isMobile = useIsMobile();
  const [defaultOpen, setDefaultOpen] = useState(!isMobile);
  
  useEffect(() => {
    setDefaultOpen(!isMobile);
  }, [isMobile]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex w-full min-h-screen">
        {/* Desktop sidebar */}
        <SalonSidebar />
        
        {/* Mobile navigation - only visible on mobile */}
        <SalonMobileNav />
        
        <div className="flex-1 overflow-hidden pt-12 sm:pt-16">
          <ScrollArea className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)]">
            <div className="container mx-auto py-3 sm:py-6 px-3 sm:px-4 md:px-6 max-w-6xl">
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
};
