import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "./sidebar/AdminSidebarContent";

export const AdminSidebar = () => {
  return (
    <Sidebar className="border-r bg-background/80 backdrop-blur-sm" variant="inset" collapsible="icon">
      <SidebarTrigger className="fixed right-4 top-4 z-50 bg-background shadow-sm hover:bg-accent md:right-8" />
      <AdminSidebarContent />
    </Sidebar>
  );
};