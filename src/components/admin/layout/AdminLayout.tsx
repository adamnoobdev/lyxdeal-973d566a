
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [defaultOpen, setDefaultOpen] = useState(window.innerWidth >= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setDefaultOpen(window.innerWidth >= 768);
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex w-full pt-4">
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
