
import React from "react";
import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default PageLoader;
