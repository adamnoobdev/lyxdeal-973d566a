
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
  // Lägg till hover:text-primary om det är outline-variant
  const buttonClassName = variant === "outline" 
    ? `${className} hover:text-primary` 
    : className;

  // Om loading-egenskapen är definierad, använd LoadingButton-komponenten
  if (loading !== undefined) {
    return (
      <LoadingButton
        variant={variant}
        size={size}
        onClick={onClick}
        loading={loading}
        disabled={disabled || loading}
        className={buttonClassName}
        title={title}
      >
        {children}
      </LoadingButton>
    );
  }

  // Annars, använd en vanlig Button-komponent
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName}
      title={title}
    >
      {children}
    </Button>
  );
};
