
import { Users, ShoppingBag, LayoutDashboard, Settings, MessageSquare, Plus, Tag, Percent } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface AdminSidebarLinksProps {
  currentPath: string;
}

export const AdminSidebarLinks = ({ currentPath }: AdminSidebarLinksProps) => {
  return (
    <div className="flex flex-col gap-1 list-none">
      <SidebarMenuItem className="list-none">
        <SidebarMenuButton 
          asChild 
          isActive={currentPath === '/admin'}
          tooltip="Dashboard"
          className="list-none"
        >
          <a href="/admin">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem className="list-none">
        <SidebarMenuButton 
          asChild 
          isActive={currentPath.startsWith('/admin/deals')}
          tooltip="Deals"
          className="list-none"
        >
          <a href="/admin/deals">
            <ShoppingBag className="h-4 w-4" />
            <span>Deals</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem className="list-none">
        <SidebarMenuButton 
          asChild 
          isActive={currentPath.startsWith('/admin/salons')}
          tooltip="Salonger"
          className="list-none"
        >
          <a href="/admin/salons">
            <Users className="h-4 w-4" />
            <span>Salonger</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem className="list-none">
        <SidebarMenuButton 
          asChild 
          isActive={currentPath === '/admin/collaborations'}
          tooltip="Kreatörssamarbeten"
          className="list-none"
        >
          <a href="/admin/collaborations">
            <Percent className="h-4 w-4" />
            <span>Kreatörssamarbeten</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem className="list-none">
        <SidebarMenuButton 
          asChild 
          isActive={currentPath === '/admin/creators'}
          tooltip="Kreatörer"
          className="list-none"
        >
          <a href="/admin/creators">
            <Users className="h-4 w-4" />
            <span>Kreatörer</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </div>
  );
};
