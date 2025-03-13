
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Tag, Store } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarLink } from "./SidebarLink";

const adminLinks = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
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
] as const;

interface AdminSidebarLinksProps {
  currentPath?: string;
}

export const AdminSidebarLinks = ({ currentPath }: AdminSidebarLinksProps) => {
  const location = useLocation();
  const currentLocation = currentPath || location.pathname;

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-primary font-medium">Admin</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
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
