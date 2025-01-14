import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-muted-50">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};