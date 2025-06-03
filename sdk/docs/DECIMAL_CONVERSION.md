# Monaco CLOB Decimal Conversion System

## Overview

The Monaco CLOB uses a **universal 18-decimal standard** for all internal calculations, regardless of the native decimal precision of the tokens being traded. This ensures consistent precision and prevents rounding errors across different token pairs.

## Core Constants

```solidity
uint8 constant internal UNIVERSAL_DECIMALS_STANDARD = 18;
```

## Conversion Functions

### 1. Amount Conversion (`_convertToUniversal`)

Converts token amounts from native decimals to 18-decimal universal format.

```solidity
function _convertToUniversal(uint256 amount, uint8 nativeDecimals) public pure returns (uint256) { 
    if (nativeDecimals == UNIVERSAL_DECIMALS_STANDARD) {
        return amount;
    }
    if (nativeDecimals < UNIVERSAL_DECIMALS_STANDARD) {
        uint256 diff = uint256(UNIVERSAL_DECIMALS_STANDARD - nativeDecimals);
        uint256 power = 10**diff;
        return amount * power;
    } else { 
        uint256 diff = uint256(nativeDecimals - UNIVERSAL_DECIMALS_STANDARD);
        uint256 power = 10**diff;
        return amount / power;
    }
}
```

### 2. Amount Conversion Back (`_convertFromUniversal`)

Converts amounts from 18-decimal universal format back to native decimals.

```solidity
function _convertFromUniversal(uint256 universalAmount, uint8 nativeDecimals) internal pure returns (uint256) {
    if (nativeDecimals == UNIVERSAL_DECIMALS_STANDARD) {
        return universalAmount;
    } else if (nativeDecimals < UNIVERSAL_DECIMALS_STANDARD) {
        return universalAmount / (10**(UNIVERSAL_DECIMALS_STANDARD - nativeDecimals));
    } else { // nativeDecimals > UNIVERSAL_DECIMALS_STANDARD
        return universalAmount * (10**(nativeDecimals - UNIVERSAL_DECIMALS_STANDARD));
    }
}
```

### 3. Price Conversion (`_convertToUniversalPrice`)

Converts prices from native format to universal 18-decimal format. Price represents "units of quote per 1 unit of base".

```solidity
function _convertToUniversalPrice(uint256 nativePriceInput, uint8 baseNativeDecimals, uint8 quoteNativeDecimals) internal pure returns (uint256) {
    // Convert nativePrice (units of quote per 1 unit of base, scaled by quoteDecimals)
    // to universal price (18 decimals).
    // Example: 1 BASE (18 dec) for 100 QUOTE (6 dec).
    // nativePriceInput would be 100 * 10^6.
    // We want universalPrice = 100 * 10^18.
    // Formula: nativePriceInput * (10^(UNIVERSAL_DECIMALS_STANDARD - quoteNativeDecimals))
    if (quoteNativeDecimals == UNIVERSAL_DECIMALS_STANDARD) {
        return nativePriceInput; // Already in 18-decimal representation of quote
    }
    if (quoteNativeDecimals < UNIVERSAL_DECIMALS_STANDARD) {
        uint256 scalingFactor = 10**(UNIVERSAL_DECIMALS_STANDARD - quoteNativeDecimals);
        return nativePriceInput * scalingFactor;
    } else { // quoteNativeDecimals > UNIVERSAL_DECIMALS_STANDARD (e.g. 20)
        // This case is less common for price (quote token having >18 decimals)
        // If nativePriceInput is 100 * 10^20, and universal is 100 * 10^18
        uint256 scalingFactor = 10**(quoteNativeDecimals - UNIVERSAL_DECIMALS_STANDARD);
        return nativePriceInput / scalingFactor;
    }
}
```

## Examples

### Example 1: USDC (6 decimals) to Universal

```typescript
// Converting 1000 USDC (6 decimals) to universal format
const usdcAmount = 1000_000000; // 1000 USDC with 6 decimals
const usdcDecimals = 6;
const universalAmount = convertToUniversal(usdcAmount, usdcDecimals);
// Result: 1000_000000000000000000 (1000 * 10^18)
```

### Example 2: WETH (18 decimals) to Universal

```typescript
// Converting 1 WETH (18 decimals) to universal format
const wethAmount = 1_000000000000000000n; // 1 WETH with 18 decimals
const wethDecimals = 18;
const universalAmount = convertToUniversal(wethAmount, wethDecimals);
// Result: 1_000000000000000000 (no change, already 18 decimals)
```

### Example 3: Price Conversion (WETH/USDC)

```typescript
// Price: 1 WETH = 2000 USDC
// Native price input: 2000 * 10^6 = 2000000000 (USDC has 6 decimals)
const nativePrice = 2000_000000; // 2000 USDC per WETH
const baseDecimals = 18; // WETH
const quoteDecimals = 6;  // USDC
const universalPrice = convertToUniversalPrice(nativePrice, baseDecimals, quoteDecimals);
// Result: 2000_000000000000000000 (2000 * 10^18)
```

### Example 4: Converting Back from Universal

```typescript
// Converting universal amount back to USDC native format
const universalAmount = 1500_000000000000000000n; // 1500 in universal format
const usdcDecimals = 6;
const nativeAmount = convertFromUniversal(universalAmount, usdcDecimals);
// Result: 1500_000000 (1500 USDC with 6 decimals)
```

## TypeScript Implementation

```typescript
import { parseUnits, formatUnits } from 'viem';

/**
 * Convert amount from native decimals to universal 18-decimal format
 */
export function convertToUniversal(amount: bigint, nativeDecimals: number): bigint {
  const UNIVERSAL_DECIMALS = 18;
  
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
 */
export function convertFromUniversal(universalAmount: bigint, nativeDecimals: number): bigint {
  const UNIVERSAL_DECIMALS = 18;
  
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
 */
export function convertToUniversalPrice(
  nativePrice: bigint, 
  baseDecimals: number, 
  quoteDecimals: number
): bigint {
  const UNIVERSAL_DECIMALS = 18;
  
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
```

## Usage in Order Placement

When placing orders, the SDK should:

1. **Convert user inputs to universal format** before sending to contracts
2. **Convert contract outputs back to native format** for display
3. **Handle price calculations** using the universal standard

```typescript
// Example: Placing a limit order for 1 WETH at 2000 USDC
const wethAmount = parseTokenAmount("1", 18);        // 1 WETH
const usdcPrice = parseTokenAmount("2000", 6);       // 2000 USDC per WETH

// Convert to universal format for contract
const universalQuantity = convertToUniversal(wethAmount, 18);
const universalPrice = convertToUniversalPrice(usdcPrice, 18, 6);

// Send to contract with universal values
await clobContract.placeLimitOrder(
  wethAddress,
  usdcAddress,
  true, // isBuy
  universalQuantity,
  universalPrice
);
```

## Important Notes

1. **Always use BigInt** for token amounts to avoid precision loss
2. **Price conversion depends on quote token decimals**, not base token decimals
3. **All contract interactions** expect universal format internally
4. **User-facing APIs** should accept and return native formats for better UX
5. **Test thoroughly** with different decimal combinations (6, 8, 18, etc.) 