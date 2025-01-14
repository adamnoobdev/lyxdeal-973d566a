import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "./sidebar/AdminSidebarContent";

export const AdminSidebar = () => {
  return (
    <Sidebar className="pt-16" variant="inset" collapsible="icon">
      <SidebarTrigger className="fixed right-2 top-20 z-50 bg-background shadow-sm hover:bg-accent" />
      <AdminSidebarContent />
    </Sidebar>
  );
};