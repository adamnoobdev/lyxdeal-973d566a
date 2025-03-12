
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
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AdminSidebar />
        <main className="flex-1 relative">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="container mx-auto py-8 px-4 max-w-6xl">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </SidebarProvider>
  );
};
