
export { generateDiscountCodes, generateRandomCode } from './generator';
export { getAvailableDiscountCode, markDiscountCodeAsUsed } from './codeManagement';
export { listAllDiscountCodes, removeAllDiscountCodes, countDiscountCodes, testDiscountCodeGeneration } from './debug';
export { inspectDiscountCodes } from './inspector';
export { normalizeId, logIdInfo } from './types';
export type { CustomerInfo } from './types';
