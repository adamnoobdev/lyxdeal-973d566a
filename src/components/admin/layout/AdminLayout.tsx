
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
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
        <AdminSidebar />
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="container mx-auto py-6 px-4 max-w-6xl">
              {children}
            </div>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
};
