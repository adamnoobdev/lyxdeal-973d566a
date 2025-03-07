
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-muted-50">
        <AdminSidebar />
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-screen pt-16">
            <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8 max-w-7xl">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </SidebarProvider>
  );
};
