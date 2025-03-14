import { CircleDollarSign, Calendar, Tag } from "lucide-react";
export const PurchaseSteps = () => {
  return <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Så här fungerar det</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CircleDollarSign className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">1. Säkra erbjudandet</h3>
          <p className="text-sm text-gray-600">Ta del av rabattkoden genom att fylla i dina uppgifter</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">2. Få rabattkoden</h3>
          <p className="text-sm text-gray-600">En unik rabattkod skickas automatiskt till din angivna e-post</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">3. Visa koden</h3>
          <p className="text-sm text-gray-600">Använd koden direkt på salongens bokningssida på vald behandling</p>
        </div>
      </div>
    </div>;
};