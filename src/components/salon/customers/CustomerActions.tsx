
import { Mail, Phone } from "lucide-react";

interface CustomerContactProps {
  email?: string;
  phone?: string;
}

export const CustomerActions = ({ email, phone }: CustomerContactProps) => {
  return (
    <div className="flex flex-col gap-1">
      {email && (
        <a 
          href={`mailto:${email}`} 
          className="flex items-center text-xs text-blue-600 hover:underline"
        >
          <Mail className="h-3 w-3 mr-1" /> {email}
        </a>
      )}
      {phone && (
        <a 
          href={`tel:${phone}`} 
          className="flex items-center text-xs text-blue-600 hover:underline"
        >
          <Phone className="h-3 w-3 mr-1" /> {phone}
        </a>
      )}
    </div>
  );
};
