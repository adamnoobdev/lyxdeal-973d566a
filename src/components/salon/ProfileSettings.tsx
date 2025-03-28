
import { Card, CardContent } from "@/components/ui/card";
import { ProfileSettingsForm } from "./profile-settings/ProfileSettingsForm";
import { ProfileCardHeader } from "./profile-settings/ProfileCardHeader";

export interface ProfileSettingsProps {
  salon: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    user_id: string | null;
  };
  onUpdate: () => void;
}

export const ProfileSettings = ({ salon, onUpdate }: ProfileSettingsProps) => {
  return (
    <Card>
      <ProfileCardHeader />
      <CardContent>
        <ProfileSettingsForm salon={salon} onUpdate={onUpdate} />
      </CardContent>
    </Card>
  );
};
