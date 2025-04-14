
import React, { RefObject } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { SalonForm } from "../SalonForm";
import { SalonDebugView } from "./SalonDebugView";

interface EditSalonDialogContentProps {
  initialValues: any;
  isSubmitting: boolean;
  formRef: RefObject<any>;
  debugView: boolean;
  setDebugView: (show: boolean) => void;
  onSubscriptionUpdated: () => Promise<void>;
  onSubmit: (values: any) => Promise<void>;
}

export const EditSalonDialogContent: React.FC<EditSalonDialogContentProps> = ({
  initialValues,
  isSubmitting,
  formRef,
  debugView,
  setDebugView,
  onSubscriptionUpdated,
  onSubmit
}) => {
  return (
    <div className="max-w-full w-full overflow-hidden">
      <DialogHeader className="px-0 sm:px-1">
        <DialogTitle className="text-lg sm:text-xl">Redigera salong</DialogTitle>
        <DialogDescription className="text-xs sm:text-sm">
          Uppdatera information om salongen. Fyll i adressinformation för korrekt visning på kartan och hantera prenumerationsplan och godkännanden av villkor.
        </DialogDescription>
      </DialogHeader>
      
      <SalonDebugView
        initialValues={initialValues || {}}
        debugView={debugView}
        onToggleDebugView={() => setDebugView(!debugView)}
        onSubscriptionUpdated={onSubscriptionUpdated}
      />
      
      <div className="w-full">
        <SalonForm 
          onSubmit={onSubmit} 
          initialValues={initialValues} 
          isEditing={true}
          isSubmitting={isSubmitting}
          ref={formRef}
        />
      </div>
    </div>
  );
};
