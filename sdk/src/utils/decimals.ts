import { parseUnits, formatUnits } from 'ethers';

/**
 * Universal decimal standard used by Monaco CLOB
 */
export const UNIVERSAL_DECIMALS = 18;

/**
 * Convert amount from native decimals to universal 18-decimal format
 * Based on CLOB._convertToUniversal function
 */
export function convertToUniversal(amount: bigint, nativeDecimals: number): bigint {
  if (nativeDecimals === UNIVERSAL_DECIMALS) {
    return amount;
  }
  
  if (nativeDecimals < UNIVERSAL_DECIMALS) {
    const diff = UNIVERSAL_DECIMALS - nativeDecimals;
    const power = 10n ** BigInt(diff);
    return amount * power;
  } else {
    const diff = nativeDecimals - UNIVERSAL_DECIMALS;
    const power = 10n ** BigInt(diff);
    return amount / power;
  }
}

/**
 * Convert amount from universal 18-decimal format back to native decimals
 * Based on CLOB._convertFromUniversal function
 */
export function convertFromUniversal(universalAmount: bigint, nativeDecimals: number): bigint {
  if (nativeDecimals === UNIVERSAL_DECIMALS) {
    return universalAmount;
  }
  
  if (nativeDecimals < UNIVERSAL_DECIMALS) {
    const diff = UNIVERSAL_DECIMALS - nativeDecimals;
    const power = 10n ** BigInt(diff);
    return universalAmount / power;
  } else {
    const diff = nativeDecimals - UNIVERSAL_DECIMALS;
    const power = 10n ** BigInt(diff);
    return universalAmount * power;
  }
}

/**
 * Convert price from native format to universal 18-decimal format
 * Price represents "units of quote per 1 unit of base"
 * Based on CLOB._convertToUniversalPrice function
 */
export function convertToUniversalPrice(
  nativePrice: bigint, 
  baseDecimals: number, 
  quoteDecimals: number
): bigint {
  if (quoteDecimals === UNIVERSAL_DECIMALS) {
    return nativePrice;
  }
  
  if (quoteDecimals < UNIVERSAL_DECIMALS) {
    const scalingFactor = 10n ** BigInt(UNIVERSAL_DECIMALS - quoteDecimals);
    return nativePrice * scalingFactor;
  } else {
    const scalingFactor = 10n ** BigInt(quoteDecimals - UNIVERSAL_DECIMALS);
    return nativePrice / scalingFactor;
  }
}

/**
 * Convert price from universal format back to native format
 */
export function convertFromUniversalPrice(
  universalPrice: bigint,
  baseDecimals: number,
  quoteDecimals: number
): bigint {
  if (quoteDecimals === UNIVERSAL_DECIMALS) {
    return universalPrice;
  }
  
  if (quoteDecimals < UNIVERSAL_DECIMALS) {
    const scalingFactor = 10n ** BigInt(UNIVERSAL_DECIMALS - quoteDecimals);
    return universalPrice / scalingFactor;
  } else {
    const scalingFactor = 10n ** BigInt(quoteDecimals - UNIVERSAL_DECIMALS);
    return universalPrice * scalingFactor;
  }
}

/**
 * Helper function to convert human-readable amounts to native token format
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals);
}

/**
 * Helper function to convert native token amounts to human-readable format
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  return formatUnits(amount, decimals);
}

/**
 * Helper function to convert human-readable amounts directly to universal format
 */
export function parseToUniversal(amount: string, nativeDecimals: number): bigint {
  const nativeAmount = parseTokenAmount(amount, nativeDecimals);
  return convertToUniversal(nativeAmount, nativeDecimals);
}

/**
 * Helper function to convert universal amounts directly to human-readable format
 */
export function formatFromUniversal(universalAmount: bigint, nativeDecimals: number): string {
  const nativeAmount = convertFromUniversal(universalAmount, nativeDecimals);
  return formatTokenAmount(nativeAmount, nativeDecimals);
} 