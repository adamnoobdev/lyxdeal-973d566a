import { supabase } from "@/integrations/supabase/client";
import { generateRandomCode } from "@/utils/discount-code-utils";
import { normalizeId } from "./types";
import { toast } from "sonner";

// Re-export functions from debug.ts
export { listAllDiscountCodes, countDiscountCodes, testDiscountCodeGeneration } from './debug';

// Re-export from removeAllCodes.ts
export { removeAllDiscountCodes } from './removeAllCodes';

// Re-export from codeManagement.ts
export { getAvailableDiscountCode, markDiscountCodeAsUsed } from './codeManagement';

// Re-export from generator.ts
export { generateDiscountCodes } from './generator';

// Re-export from inspector.ts
export { inspectDiscountCodes } from './inspector';

// Re-export from searchHelpers.ts
export { searchDiscountCodesWithMultipleMethods } from './searchHelpers';

// Re-export from admin.ts
export { updateDiscountCode, deleteDiscountCode } from './admin';

// For backwards compatibility, we'll keep this exportable from the main index
export { generateRandomCode } from './generator';
