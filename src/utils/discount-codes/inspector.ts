
import { runInspectionProcess } from "./inspectionFlow";

/**
 * Inspekterar rabattkoder för ett erbjudande och försöker hitta problem
 * Delegerar till specialiserade funktioner för att hålla koden fokuserad och hanterbar
 */
export const inspectDiscountCodes = async (dealId: number | string): Promise<any> => {
  try {
    console.log(`[inspectDiscountCodes] Inspecting discount codes for deal ID: ${dealId}`);
    return await runInspectionProcess(dealId);
  } catch (error) {
    console.error(`[inspectDiscountCodes] Unhandled exception during inspection:`, error);
    return {
      success: false,
      message: "Ett oväntat fel uppstod vid inspektion av rabattkoder",
      error
    };
  }
};
