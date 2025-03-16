
export { generateDiscountCodes, generateRandomCode } from './generator';
export { getAvailableDiscountCode, markDiscountCodeAsUsed } from './codeManagement';
export { listAllDiscountCodes, removeAllDiscountCodes, countDiscountCodes, testDiscountCodeGeneration } from './debug';
export { inspectDiscountCodes } from './inspector';
export { normalizeId, logIdInfo, compareIds } from './types';
export { searchDiscountCodesWithMultipleMethods } from './searchHelpers';
export type { CustomerInfo } from './types';
