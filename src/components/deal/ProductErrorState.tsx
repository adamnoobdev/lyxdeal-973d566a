
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Helmet } from "react-helmet";

export const ProductErrorState = () => {
  return (
    <>
      <Helmet>
        <title>Erbjudande hittades inte | Lyxdeal</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Kunde inte hitta erbjudandet. Det kan ha tagits bort eller så har ett fel uppstått.
        </AlertDescription>
      </Alert>
    </>
  );
};
