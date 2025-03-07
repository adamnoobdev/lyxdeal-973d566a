
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SalonDealsEmpty() {
  return (
    <Alert>
      <AlertDescription>
        Denna salong har inga aktiva erbjudanden.
      </AlertDescription>
    </Alert>
  );
}
