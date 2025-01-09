import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface TestAccountButtonProps {
  loading: boolean;
  creatingTestAccount: boolean;
  onCreateTestAccount: () => void;
}

export const TestAccountButton = ({
  loading,
  creatingTestAccount,
  onCreateTestAccount,
}: TestAccountButtonProps) => {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Eller</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onCreateTestAccount}
        disabled={loading || creatingTestAccount}
      >
        {creatingTestAccount ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Skapar testkonto...
          </>
        ) : (
          "Skapa testkonto"
        )}
      </Button>
    </>
  );
};