
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Tags, Users, Settings } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarLink } from "./SidebarLink";

const salonLinks = [
  {
    href: "/salon/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/salon/deal",
    icon: Tags,
    label: "Erbjudanden",
  },
  {
    href: "/salon/customers",
    icon: Users,
    label: "Kunder",
  },
  {
    href: "/salon/settings",
    icon: Settings,
    label: "Inställningar",
  },
] as const;

export const SalonSidebarLinks = () => {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Salong</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {salonLinks.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              isCurrentPath={location.pathname.startsWith(link.href)}
            >
              {link.label}
            </SidebarLink>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
