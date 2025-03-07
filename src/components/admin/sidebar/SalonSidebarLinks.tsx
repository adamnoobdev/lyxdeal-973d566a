
import { useLocation } from "react-router-dom";
import { LayoutDashboard, Tags, Users } from "lucide-react";
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
              label={link.label}
              isCurrentPath={location.pathname.startsWith(link.href)}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
