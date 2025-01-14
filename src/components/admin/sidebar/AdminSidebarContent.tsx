import { SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import { AdminSidebarLinks } from "./AdminSidebarLinks";
import { SalonSidebarLinks } from "./SalonSidebarLinks";

export const AdminSidebarContent = () => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <AdminSidebarLinks />
      </SidebarGroup>
      <SidebarGroup>
        <SalonSidebarLinks />
      </SidebarGroup>
    </SidebarContent>
  );
};