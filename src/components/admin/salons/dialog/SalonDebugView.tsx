
import { Button } from "@/components/ui/button";
import { SubscriptionUpdateButton } from "../subscription/SubscriptionUpdateButton";

interface SalonDebugViewProps {
  initialValues: any;
  debugView: boolean;
  onToggleDebugView: () => void;
  onSubscriptionUpdated: () => Promise<void>;
}

export const SalonDebugView = ({
  initialValues,
  debugView,
  onToggleDebugView,
  onSubscriptionUpdated
}: SalonDebugViewProps) => {
  if (!debugView) {
    return (
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleDebugView}
          className="text-xs"
        >
          Visa debugging
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-md">
      <h3 className="font-medium mb-2">Debugging Information</h3>
      <pre className="text-xs overflow-auto max-h-40">
        {JSON.stringify({
          id: initialValues.id,
          subscriptionPlan: initialValues.subscriptionPlan,
          subscriptionType: initialValues.subscriptionType
        }, null, 2)}
      </pre>
      
      {initialValues.id && (
        <div className="mt-3">
          <SubscriptionUpdateButton 
            salonId={initialValues.id} 
            currentPlan={initialValues.subscriptionPlan || "Baspaket"}
            currentType={initialValues.subscriptionType || "monthly"}
            onSuccess={onSubscriptionUpdated}
          />
          <p className="text-xs mt-2 text-gray-500">
            Detta anropar API:et direkt för att uppdatera prenumerationen om det inte sparas korrekt.
          </p>
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onToggleDebugView}
        className="mt-2"
      >
        Dölj debugging
      </Button>
    </div>
  );
};
