
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="py-4 text-center">
      <div className="flex justify-center mb-2">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
      <p className="text-sm text-gray-500">Hämtar prenumerationsdetaljer...</p>
    </div>
  );
}
