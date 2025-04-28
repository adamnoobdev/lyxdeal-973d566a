
import { Users, ShoppingBag, LayoutDashboard, Settings, MessageSquare, Plus, Tag, Percent } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface AdminSidebarLinksProps {
  currentPath: string;
}

export const AdminSidebarLinks = ({ currentPath }: AdminSidebarLinksProps) => {
  return (
    <div className="flex flex-col gap-1">
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={currentPath === '/admin'}
          tooltip="Dashboard"
        >
          <a href="/admin">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={currentPath.startsWith('/admin/deals')}
          tooltip="Deals"
        >
          <a href="/admin/deals">
            <ShoppingBag className="h-4 w-4" />
            <span>Deals</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={currentPath.startsWith('/admin/salons')}
          tooltip="Salonger"
        >
          <a href="/admin/salons">
            <Users className="h-4 w-4" />
            <span>Salonger</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={currentPath === '/admin/collaborations'}
          tooltip="Kreatörssamarbeten"
        >
          <a href="/admin/collaborations">
            <Percent className="h-4 w-4" />
            <span>Kreatörssamarbeten</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={currentPath === '/admin/creators'}
          tooltip="Kreatörer"
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
