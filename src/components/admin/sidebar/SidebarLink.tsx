import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCurrentPath: boolean;
}

export const SidebarLink = ({ href, icon: Icon, label, isCurrentPath }: SidebarLinkProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isCurrentPath}>
        <Link to={href}>
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};