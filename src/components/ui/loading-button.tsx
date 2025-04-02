
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading = false, className, disabled, variant, ...props }, ref) => {
    return (
      <Button
        className={cn(className, "whitespace-normal break-words w-full xs:w-auto")}
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
