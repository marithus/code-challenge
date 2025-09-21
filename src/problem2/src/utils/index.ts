import type { Token } from "../types";

/**
 * Raw token data structure from the API
 */
interface RawTokenData {
    currency: string;
    price: number;
}

/**
 * Processes raw token data from the API into a clean Token array
 * Deduplicates tokens by currency and adds icon URLs
 * 
 * @param data - Array of raw token data from the API
 * @returns Processed array of Token objects with icons
 */
export const processTokenData = (data: RawTokenData[]): Token[] => {
    const tokenMap = new Map<string, Token>();
    
    data.forEach(item => {
        // Only process items with valid price data
        if (item.price && item.price > 0) {
            tokenMap.set(item.currency, {
                currency: item.currency,
                price: item.price,
                // Generate icon URL from Switcheo's token icon repository
                icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${item.currency}.svg`,
            });
        }
    });
    
    // Convert Map to array and sort by currency name for consistent ordering
    return Array.from(tokenMap.values()).sort((a, b) => 
        a.currency.localeCompare(b.currency)
    );
};
