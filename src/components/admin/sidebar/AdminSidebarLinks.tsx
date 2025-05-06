
import { Users, ShoppingBag, LayoutDashboard, Settings, MessageSquare, Plus, Tag, Percent } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { memo } from "react";

interface AdminSidebarLinksProps {
  currentPath: string;
}

// Använder React.memo för att förhindra onödiga renderingar av sidofältet
export const AdminSidebarLinks = memo(({ currentPath }: AdminSidebarLinksProps) => {
  // Hjälpfunktion för att kontrollera om en länk är aktiv
  const isActive = (path: string, exact: boolean = false) => {
    if (exact) return currentPath === path;
    return currentPath.startsWith(path);
  };

  return (
    <div className="flex flex-col gap-1 list-none">
      <SidebarMenuItem className="list-none">
        <SidebarMenuButton 
          asChild 
          isActive={isActive('/admin', true)}
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
          isActive={isActive('/admin/deals')}
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
          isActive={isActive('/admin/salons')}
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
          isActive={isActive('/admin/collaborations')}
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
          isActive={isActive('/admin/creators')}
          tooltip="Kreatörer"
          className="list-none"
        >
          <a href="/admin/creators">
            <Users className="h-4 w-4" />
            <span>Kreatörer</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <SidebarMenuItem className="list-none">
        <SidebarMenuButton 
          asChild 
          isActive={isActive('/admin/subscriptions')}
          tooltip="Prenumerationer"
          className="list-none"
        >
          <a href="/admin/subscriptions">
            <Tag className="h-4 w-4" />
            <span>Prenumerationer</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </div>
  );
});

AdminSidebarLinks.displayName = "AdminSidebarLinks";
