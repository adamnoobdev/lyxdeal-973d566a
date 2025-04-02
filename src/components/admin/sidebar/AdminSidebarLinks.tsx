
import { PanelLeft, Store, Tag, Users } from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import { useLocation } from "react-router-dom";

interface AdminSidebarLinksProps {
  currentPath?: string;
}

export const AdminSidebarLinks = ({ currentPath = '' }: AdminSidebarLinksProps) => {
  const location = useLocation();
  const path = currentPath || location.pathname;
  
  return (
    <div className="space-y-1">
      <SidebarLink
        href="/admin"
        active={path === '/admin'}
        icon={PanelLeft}
        label="Dashboard"
      />

      <SidebarLink
        href="/admin/deals"
        active={path.includes('/admin/deals')}
        icon={Tag}
        label="Erbjudanden"
      />

      <SidebarLink
        href="/admin/salons"
        active={path.includes('/admin/salons')}
        icon={Store}
        label="Salonger"
      />

      <SidebarLink
        href="/admin/users"
        active={path.includes('/admin/users')}
        icon={Users}
        label="Användare"
      />
    </div>
  );
};
