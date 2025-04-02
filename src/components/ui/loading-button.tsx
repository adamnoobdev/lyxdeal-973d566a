
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading = false, className, disabled, variant, ...props }, ref) => {
    // Lägg till hover:text-primary för outline-knappar
    const buttonClassName = variant === "outline" 
      ? cn(className, "hover:text-primary") 
      : className;

    return (
      <Button
        className={cn(buttonClassName, "whitespace-normal break-words w-full xs:w-auto")}
        disabled={disabled || loading}
        ref={ref}
        variant={variant}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
