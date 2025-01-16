import { CircleDollarSign, Mail, Tag } from "lucide-react";

export const PurchaseSteps = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Så här fungerar det</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CircleDollarSign className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">1. Köp erbjudandet</h3>
          <p className="text-sm text-gray-600">Betala säkert via Stripe med ditt betalkort</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">2. Få din rabattkod</h3>
          <p className="text-sm text-gray-600">Din unika rabattkod skickas direkt till din e-post</p>
        </div>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Tag className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">3. Använd din kod</h3>
          <p className="text-sm text-gray-600">Nyttja din behandling direkt på salongens bokadirekt-sida</p>
        </div>
      </div>
    </div>
  );
};