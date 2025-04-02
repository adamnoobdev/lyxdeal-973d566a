
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
        icon={<PanelLeft className="mr-2 h-4 w-4" />}
        label="Dashboard"
      />

      <SidebarLink
        href="/admin/deals"
        active={currentPath.includes('/admin/deals')}
        icon={<Tag className="mr-2 h-4 w-4" />}
        label="Erbjudanden"
      />

      <SidebarLink
        href="/admin/salons"
        active={currentPath.includes('/admin/salons')}
        icon={<Store className="mr-2 h-4 w-4" />}
        label="Salonger"
      />

      <SidebarLink
        href="/admin/users"
        active={currentPath.includes('/admin/users')}
        icon={<Users className="mr-2 h-4 w-4" />}
        label="Användare"
      />
    </div>
  );
};
