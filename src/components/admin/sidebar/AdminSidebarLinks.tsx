import { Users, ShoppingBag, LayoutDashboard, Settings, MessageSquare, Plus, Tag, Percent } from "lucide-react";
import { SidebarLink } from "@/components/ui/sidebar";

interface AdminSidebarLinksProps {
  currentPath: string;
}

export const AdminSidebarLinks = ({ currentPath }: AdminSidebarLinksProps) => {
  return (
    <div className="space-y-1">
      <SidebarLink
        href="/admin"
        icon={<LayoutDashboard className="h-4 w-4" />}
        isActive={currentPath === '/admin'}
      >
        Dashboard
      </SidebarLink>

      <SidebarLink
        href="/admin/deals"
        icon={<ShoppingBag className="h-4 w-4" />}
        isActive={currentPath.startsWith('/admin/deals')}
      >
        Deals
      </SidebarLink>

      <SidebarLink
        href="/admin/salons"
        icon={<Users className="h-4 w-4" />}
        isActive={currentPath.startsWith('/admin/salons')}
      >
        Salonger
      </SidebarLink>
      
      <SidebarLink 
        href="/admin/collaborations" 
        icon={<Percent className="h-4 w-4" />}
        isActive={currentPath === '/admin/collaborations'}
      >
        Kreatörssamarbeten
      </SidebarLink>
      
      <SidebarLink 
        href="/admin/creators" 
        icon={<Users className="h-4 w-4" />}
        isActive={currentPath === '/admin/creators'}
      >
        Kreatörer
      </SidebarLink>
    </div>
  );
};
