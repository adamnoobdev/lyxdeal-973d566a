
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Tag, Store, UserPlus } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, useSidebar } from "@/components/ui/sidebar";
import { SidebarLink } from "./SidebarLink";

const adminLinks = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Översikt",
    description: "Översikt och statistik",
  },
  {
    href: "/admin/deals",
    icon: Tag,
    label: "Erbjudanden",
    description: "Hantera erbjudanden",
  },
  {
    href: "/admin/salons",
    icon: Store,
    label: "Salonger",
    description: "Hantera salonger",
  },
  {
    href: "/create-admin",
    icon: UserPlus,
    label: "Skapa Admin",
    description: "Lägg till administratörer",
  },
] as const;

interface AdminSidebarLinksProps {
  currentPath?: string;
}

export const AdminSidebarLinks = ({ currentPath }: AdminSidebarLinksProps) => {
  const location = useLocation();
  const currentLocation = currentPath || location.pathname;
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={`text-primary font-medium ${isCollapsed ? "sr-only" : ""}`}>
        Admin
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isCurrentPath={currentLocation === link.href || currentLocation.startsWith(link.href)}
            >
              {link.label}
            </SidebarLink>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
