
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscriptionData } from "./subscription/useSubscriptionData";
import { SubscriptionInfo } from "./subscription/types";
import { LoadingState } from "./subscription/LoadingState";
import { ErrorState } from "./subscription/ErrorState";
import { EmptyState } from "./subscription/EmptyState";
import { SubscriptionAlert } from "./subscription/SubscriptionAlert";
import { SubscriptionMetadata } from "./subscription/SubscriptionMetadata";
import { SubscriptionActions } from "./subscription/SubscriptionActions";

export function ManageSubscription() {
  const { subscriptionInfo, loading, error } = useSubscriptionData();
  const [localSubscriptionInfo, setLocalSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  // Använd den lokala staten om den finns, annars använd data från hooken
  const currentSubscriptionInfo = localSubscriptionInfo || subscriptionInfo;

  // Hantera uppdateringar av prenumerationsinformation
  const handleSubscriptionUpdate = (updated: Partial<SubscriptionInfo>) => {
    if (currentSubscriptionInfo) {
      const updatedInfo = { ...currentSubscriptionInfo, ...updated };
      setLocalSubscriptionInfo(updatedInfo);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!currentSubscriptionInfo) {
    return <EmptyState />;
  }

  return (
    <Card className="border border-muted-200">
      <CardHeader className="border-b bg-muted-50 pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">Status</span>
          <Badge 
            variant={currentSubscriptionInfo.status === "active" ? "default" : "destructive"}
            className="ml-2 text-sm px-2 py-0.5"
          >
            {currentSubscriptionInfo.status === "active" ? "Aktiv" : "Inaktiv"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        <SubscriptionAlert subscriptionInfo={currentSubscriptionInfo} />
        
        <SubscriptionMetadata subscriptionInfo={currentSubscriptionInfo} />
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <SubscriptionActions 
            subscriptionInfo={currentSubscriptionInfo}
            onSubscriptionUpdate={handleSubscriptionUpdate}
          />
        </div>
      </CardContent>
    </Card>
  );
}
