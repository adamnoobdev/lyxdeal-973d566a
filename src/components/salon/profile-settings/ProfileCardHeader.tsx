
import { FC } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const ProfileCardHeader: FC = () => {
  return (
    <CardHeader>
      <CardTitle>Profilinställningar</CardTitle>
      <CardDescription>
        Uppdatera din salongs information
      </CardDescription>
    </CardHeader>
  );
};
