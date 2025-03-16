
/**
 * Detta är en omdirigeringsfil för bakåtkompatibilitet
 * som exporterar alla sökfunktioner från den nya sökmodulen
 */

export { 
  searchDiscountCodesWithMultipleMethods 
} from "./search/multiSearch";

export { 
  logSearchAttempt 
} from "./search/loggers";

export {
  searchWithNumericId
} from "./search/numericSearch";

export {
  searchWithOriginalId
} from "./search/originalIdSearch";

export {
  searchWithStringId
} from "./search/stringSearch";

export {
  getAllCodesAndFilter
} from "./search/manualSearch";
