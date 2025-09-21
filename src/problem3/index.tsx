import React, { useMemo } from 'react';

/**
 * Represents a wallet balance for a specific cryptocurrency
 */
interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: string;
}

/**
 * Represents a formatted wallet balance ready for display
 */
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

/**
 * Base interface for Box component props (would typically be imported from UI library)
 */
interface BoxProps {
    children?: React.ReactNode;
    className?: string;
    // Add other common props as needed
}

/**
 * Props for the WalletPage component
 */
interface Props extends BoxProps {
    balances?: WalletBalance[];
    prices?: { [key: string]: number };
}

/**
 * Component for displaying a single wallet row (would typically be imported)
 */
interface WalletRowProps {
    amount: number;
    usdValue: number;
    formattedAmount: string;
}

const WalletRow: React.FC<WalletRowProps> = ({ amount, usdValue, formattedAmount }) => (
    <div className="wallet-row">
        <span>{formattedAmount}</span>
        <span>${usdValue.toFixed(2)}</span>
    </div>
);

/**
 * WalletPage component displays a list of wallet balances sorted by blockchain priority
 * and filtered to show only valid balances with positive amounts.
 */
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, balances = [], prices = {}, ...rest } = props;

    /**
     * Returns the priority value for a given blockchain.
     * Higher priority blockchains are displayed first.
     * 
     * @param blockchain - The blockchain name
     * @returns Priority number (higher = more important)
     */
    const getPriority = (blockchain: string): number => {
        switch (blockchain) {
            case 'Osmosis':
                return 100;
            case 'Ethereum':
                return 50;
            case 'Arbitrum':
                return 30;
            case 'Zilliqa':
                return 20;
            case 'Neo':
                return 20;
            default:
                return -99;
        }
    };

    /**
     * Filtered and sorted wallet balances
     * - Filters out balances with zero/negative amounts
     * - Filters out unsupported blockchains (priority <= -99)
     * - Sorts by blockchain priority (descending)
     */
    const sortedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // Only include balances with positive amounts and supported blockchains
                return balancePriority > -99 && balance.amount > 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                
                // Sort by priority descending (higher priority first)
                return rightPriority - leftPriority;
            });
    }, [balances]);

    /**
     * Renders wallet balance rows with calculated USD values
     */
    const rows = sortedBalances.map((balance: WalletBalance) => {
        const usdValue = (prices[balance.currency] || 0) * balance.amount;
        
        return (
            <WalletRow
                key={`${balance.currency}-${balance.blockchain}`} // More unique key
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.amount.toFixed(6)} // More precision for crypto amounts
            />
        );
    });

    return (
        <div {...rest}>
            {children}
            {rows}
        </div>
    );
};

export default WalletPage;