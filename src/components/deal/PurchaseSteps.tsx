
import { CircleDollarSign, Calendar, Tag } from "lucide-react";

export const PurchaseSteps = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Så här fungerar det</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CircleDollarSign className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">1. Fyll i dina uppgifter och säkra erbjudandet</h3>
          <p className="text-sm text-gray-600">Enkelt och snabbt med några få steg</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">2. Du får en unik rabattkod via e-post direkt</h3>
          <p className="text-sm text-gray-600">Koden skickas automatiskt till din angivna e-post</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">3. Visa rabattkoden i salongen inom 72 timmar</h3>
          <p className="text-sm text-gray-600">Besök salongen och visa din kod för att få rabatten</p>
        </div>
      </div>
    </div>
  );
};
