
/**
 * Legacy file that re-exports the template function for backward compatibility
 */
import { createEmailContent as createDiscountEmailContent } from "./emailTemplates/template.ts";

export function createEmailContent(name: string, code: string, dealTitle: string): string {
  return createDiscountEmailContent(name, code, dealTitle);
}
