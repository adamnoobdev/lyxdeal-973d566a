
import { FC } from "react";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export const CompanyInfoSection: FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="font-semibold text-lg mb-4">Företagsinformation</h3>
      <ul className="space-y-4 text-sm text-gray-600">
        <li className="flex flex-col items-center gap-2">
          <Building2 className="h-5 w-5 text-primary shrink-0" />
          <div className="flex flex-col items-center">
            <p className="font-medium">Larlid & Co AB</p>
            <p className="text-gray-500">Org.nr: 559360-8051</p>
          </div>
        </li>
        <li className="flex flex-col items-center gap-2">
          <MapPin className="h-5 w-5 text-primary shrink-0" />
          <div className="flex flex-col items-center">
            <p>Västra Granittrappan 10</p>
            <p>131 57 Nacka</p>
          </div>
        </li>
        <li className="flex flex-col items-center gap-2">
          <Mail className="h-5 w-5 text-primary shrink-0" />
          <a href="mailto:info@larlid.com" className="hover:text-primary transition-colors">
            info@larlid.com
          </a>
        </li>
        <li className="flex flex-col items-center gap-2">
          <Phone className="h-5 w-5 text-primary shrink-0" />
          <a href="tel:+46101774400" className="hover:text-primary transition-colors">
            010-177 44 00
          </a>
        </li>
      </ul>
    </div>
  );
};
