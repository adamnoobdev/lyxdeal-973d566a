
export { generateDiscountCodes, generateRandomCode } from './generator';
export { getAvailableDiscountCode, markDiscountCodeAsUsed } from './codeManagement';
export { listAllDiscountCodes, removeAllDiscountCodes, countDiscountCodes, testDiscountCodeGeneration } from './debug';
export { inspectDiscountCodes } from './inspector';
export { normalizeId, logIdInfo, compareIds } from './types';
export { searchDiscountCodesWithMultipleMethods } from './search/multiSearch';
export { 
  getTableAccess, 
  countAllCodesInDatabase, 
  searchExactMatches, 
  searchStringMatches, 
  getAllCodesForInspection 
} from './databaseAccess';
export { analyzeCodesAndFindMatches } from './analysisUtils';
export { 
  formatCodesResponse, 
  formatErrorResponse,
  prepareSuccessResponse, 
  prepareErrorResponse 
} from './responseFormatters';
export { prepareSearchIds } from './idNormalizer';
export { runInspectionProcess, performStandardSearch } from './inspectionFlow';
export type { CustomerInfo } from './types';
