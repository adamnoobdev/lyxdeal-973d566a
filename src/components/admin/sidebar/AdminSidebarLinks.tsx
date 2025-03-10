
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Store, Tags } from "lucide-react";
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
    icon: Tags,
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

export const AdminSidebarLinks = () => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              isCurrentPath={location.pathname === link.href}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
