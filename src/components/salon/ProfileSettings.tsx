
import { ProfileSettingsForm } from "./profile-settings/ProfileSettingsForm";

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Profilinställningar</h2>
        <p className="text-muted-foreground">Uppdatera din salongs information</p>
      </div>

      <ProfileSettingsForm salon={salon} onUpdate={onUpdate} />
    </div>
  );
};
