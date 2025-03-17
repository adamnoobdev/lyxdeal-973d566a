
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { ReactNode } from "react";

interface ActionButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
  children: ReactNode;
}

export const ActionButton = ({
  variant = "outline",
  size = "icon",
  onClick,
  loading = false,
  disabled = false,
  className = "h-8 w-8",
  title,
  children,
}: ActionButtonProps) => {
  if (loading !== undefined) {
    return (
      <LoadingButton
        variant={variant}
        size={size}
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        className={className}
        title={title}
      >
        {children}
      </LoadingButton>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={className}
      title={title}
    >
      {children}
    </Button>
  );
};
