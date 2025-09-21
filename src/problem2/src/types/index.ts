/**
 * Represents a cryptocurrency token with its essential properties
 */
export interface Token {
    /** The currency symbol/code (e.g., 'BTC', 'ETH', 'USDC') */
    currency: string;
    /** Current price of the token in USD */
    price: number;
    /** URL to the token's icon/logo image */
    icon: string;
}

