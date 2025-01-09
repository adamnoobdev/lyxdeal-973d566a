import React from "react";

export const LoginHeader = () => {
  return (
    <div className="space-y-2 text-center">
      <h1 className="text-3xl font-bold">Salongsportal</h1>
      <p className="text-muted-foreground">
        Logga in för att hantera din salong
      </p>
      <p className="text-sm text-muted-foreground">
        Använd admin@example.com och password för att logga in som admin
      </p>
    </div>
  );
};