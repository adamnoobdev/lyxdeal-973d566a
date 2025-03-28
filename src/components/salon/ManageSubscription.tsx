
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
      // Kombinera nuvarande data med uppdateringarna
      const updatedInfo = { ...currentSubscriptionInfo, ...updated };
      setLocalSubscriptionInfo(updatedInfo);
    }
  };

  // Visa laddningsskelett medan data hämtas
  if (loading) {
    return <LoadingState />;
  }

  // Visa felmeddelande om något gick fel
  if (error) {
    return <ErrorState error={error} />;
  }

  // Visa meddelande om ingen prenumeration hittades
  if (!currentSubscriptionInfo) {
    return <EmptyState />;
  }

  // Renderera prenumerationsuppgifter och knappar för hantering
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Din prenumeration</span>
          <Badge 
            variant={currentSubscriptionInfo.status === "active" ? "default" : "destructive"}
            className="ml-2"
          >
            {currentSubscriptionInfo.status === "active" ? "Aktiv" : "Inaktiv"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SubscriptionAlert subscriptionInfo={currentSubscriptionInfo} />
        
        <SubscriptionMetadata subscriptionInfo={currentSubscriptionInfo} />
        
        <SubscriptionActions 
          subscriptionInfo={currentSubscriptionInfo}
          onSubscriptionUpdate={handleSubscriptionUpdate}
        />
      </CardContent>
    </Card>
  );
}
