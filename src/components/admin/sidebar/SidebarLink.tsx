
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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
        <Link 
          to={href} 
          className={cn(
            "transition-all duration-200",
            isCurrentPath ? "font-medium" : "text-muted-foreground"
          )}
        >
          <Icon className={cn("h-4 w-4", isCurrentPath && "text-primary")} />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
