
import { useState, useCallback } from "react";
import { FormValues } from "./schema";
import { toast } from "sonner";
import { useDealFormContext } from "./DealFormContext";

interface UseFormSubmissionReturnType {
  handleSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const useFormSubmission = (
  onSubmit: (values: FormValues) => Promise<void>,
  externalIsSubmitting = false
): UseFormSubmissionReturnType => {
  // Local state as fallback if context is not available
  const [localIsSubmitting, setLocalIsSubmitting] = useState(externalIsSubmitting);
  
  // Try to use context, but fall back to local state if unavailable
  let contextValues;
  let isContextAvailable = true;
  
  try {
    contextValues = useDealFormContext();
  } catch (error) {
    isContextAvailable = false;
    contextValues = {
      isSubmitting: localIsSubmitting,
      setIsSubmitting: setLocalIsSubmitting,
      isGeneratingCodes: false,
      setIsGeneratingCodes: () => {},
      initialValues: undefined
    };
  }

  const { isSubmitting, setIsSubmitting } = contextValues;

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      // Use context values if available, otherwise use local values
      const currentlySubmitting = isContextAvailable ? isSubmitting : localIsSubmitting;
      const setCurrentlySubmitting = isContextAvailable ? setIsSubmitting : setLocalIsSubmitting;
      
      if (currentlySubmitting) {
        console.log("[useFormSubmission] Already submitting, skipping");
        return;
      }

      try {
        console.log("[useFormSubmission] Starting submission");
        setCurrentlySubmitting(true);

        await onSubmit(values);
        toast.success("Erbjudandet har sparats!");
      } catch (error) {
        console.error("[useFormSubmission] Error during form submission:", error);
        toast.error("Ett fel uppstod när erbjudandet skulle sparas");
      } finally {
        if (isContextAvailable) {
          // Don't reset isSubmitting immediately for context
          // Because we might want to control closing dialogs
        } else {
          setLocalIsSubmitting(false);
        }
      }
    },
    [onSubmit, isSubmitting, setIsSubmitting, localIsSubmitting, isContextAvailable]
  );

  return {
    handleSubmit,
    isSubmitting: isContextAvailable ? isSubmitting : localIsSubmitting,
  };
};
