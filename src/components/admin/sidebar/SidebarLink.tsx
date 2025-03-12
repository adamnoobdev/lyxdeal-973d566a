
import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCurrentPath: boolean;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon: Icon,
  label,
  isCurrentPath,
}) => {
  return (
    <SidebarMenuItem>
      <Link
        to={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
          isCurrentPath 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            isCurrentPath ? "text-primary" : "text-muted-foreground"
          )}
        />
        <span>{label}</span>
      </Link>
    </SidebarMenuItem>
  );
};
