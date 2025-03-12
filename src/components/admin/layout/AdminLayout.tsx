
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [defaultOpen, setDefaultOpen] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setDefaultOpen(window.innerWidth >= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex min-h-[calc(100vh-4rem)] w-full bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 w-full transition-all duration-300">
          <ScrollArea className="h-[calc(100vh-4rem)] w-full">
            <div className="container mx-auto py-8 px-6 max-w-6xl">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </SidebarProvider>
  );
};
