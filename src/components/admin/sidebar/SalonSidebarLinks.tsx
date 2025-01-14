import { useLocation } from "react-router-dom";
import { LayoutDashboard, Tags } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "@/components/ui/sidebar";
import { SidebarLink } from "./SidebarLink";

const salonLinks = [
  {
    href: "/salon",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/salon/deals",
    icon: Tags,
    label: "Erbjudanden",
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
              isCurrentPath={location.pathname === link.href}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};