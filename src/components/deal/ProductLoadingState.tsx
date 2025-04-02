
import React from "react";
import { Helmet } from "react-helmet";

export const ProductLoadingState = () => {
  return (
    <>
      <Helmet>
        <title>Laddar erbjudande... | Lyxdeal</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
          <div className="h-96 bg-accent/5" />
          <div className="space-y-4">
            <div className="h-8 bg-accent/5 w-3/4" />
            <div className="h-4 bg-accent/5 w-1/2" />
            <div className="h-4 bg-accent/5 w-2/3" />
          </div>
        </div>
      </div>
    </>
  );
};
