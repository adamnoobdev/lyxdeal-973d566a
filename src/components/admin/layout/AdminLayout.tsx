
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/MobileNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const isMobile = useIsMobile();
  const [defaultOpen, setDefaultOpen] = useState(!isMobile);
  
  useEffect(() => {
    setDefaultOpen(!isMobile);
  }, [isMobile]);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex w-full min-h-screen">
        {/* Desktop sidebar */}
        <AdminSidebar />
        
        {/* Mobile navigation - only visible on mobile */}
        <AdminMobileNav />
        
        <div className="flex-1 overflow-hidden pt-12 sm:pt-14">
          <ScrollArea className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)]">
            <div className="container mx-auto py-2 sm:py-4 px-3 sm:px-4 md:px-5 max-w-5xl">
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
};
