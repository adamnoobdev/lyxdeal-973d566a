
import { PanelLeft, Store, Tag, Users } from "lucide-react";
import { SidebarLink } from "./SidebarLink";

interface AdminSidebarLinksProps {
  currentPath?: string;
}

export const AdminSidebarLinks = ({ currentPath = '' }: AdminSidebarLinksProps) => {
  return (
    <div className="space-y-1">
      <SidebarLink
        href="/admin"
        active={currentPath === '/admin'}
        icon={PanelLeft}
        label="Dashboard"
      />

      <SidebarLink
        href="/admin/deals"
        active={currentPath.includes('/admin/deals')}
        icon={Tag}
        label="Erbjudanden"
      />

      <SidebarLink
        href="/admin/salons"
        active={currentPath.includes('/admin/salons')}
        icon={Store}
        label="Salonger"
      />

      <SidebarLink
        href="/admin/users"
        active={currentPath.includes('/admin/users')}
        icon={Users}
        label="Användare"
      />
    </div>
  );
};
