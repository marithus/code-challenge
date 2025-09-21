import React from 'react';
import { ChevronDownIcon } from "../assets/Icons";
import type { Token } from "../types";

/**
 * Props interface for the TokenAmountInput component
 */
interface TokenAmountInputProps {
    /** Label text displayed above the input */
    label: string;
    /** Current amount value as string */
    amount: string;
    /** Callback function when amount input changes */
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** Currently selected token object */
    selectedToken: Token | null;
    /** Callback function when token selection button is clicked */
    onSelectTokenClick: () => void;
    /** Available balance for the selected token */
    balance: number;
    /** Whether the input should be disabled */
    disabled?: boolean;
}

/**
 * TokenAmountInput component for token amount input with token selection
 * Displays balance, allows numeric input, and provides token selection UI
 */
const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
    label,
    amount,
    onAmountChange,
    selectedToken,
    onSelectTokenClick,
    balance,
    disabled = false
}) => {
    return (
        <div className={`bg-gray-800 p-4 rounded-2xl transition-opacity duration-200 ${disabled ? 'opacity-50' : ''}`}>
            {/* Header with label and balance display */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400 text-sm font-medium">{label}</span>
                <span className="text-gray-400 text-sm">
                    Balance: {balance.toFixed(4)}
                </span>
            </div>
            
            {/* Input and token selection row */}
            <div className="flex justify-between items-center">
                <input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={onAmountChange}
                    disabled={disabled}
                    className={`bg-transparent text-3xl font-medium text-white w-full focus:outline-none ${disabled ? 'cursor-not-allowed' : ''}`}
                    min="0"
                    step="any"
                />
                
                {/* Token selection button */}
                <button
                    onClick={onSelectTokenClick}
                    disabled={disabled}
                    className={`bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-full flex items-center transition-colors duration-200 ${disabled ? 'cursor-not-allowed hover:bg-gray-900' : ''}`}
                >
                    {selectedToken ? (
                        <>
                            <img 
                                src={selectedToken.icon} 
                                alt={`${selectedToken.currency} icon`} 
                                className="w-6 h-6 mr-2 rounded-full" 
                                onError={(e) => { 
                                    // Fallback to placeholder if icon fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; 
                                    target.src = 'https://placehold.co/24x24/2d3748/ffffff?text=?'; 
                                }} 
                            />
                            {selectedToken.currency}
                        </>
                    ) : (
                        "Select Token"
                    )}
                    <ChevronDownIcon />
                </button>
            </div>
        </div>
    );
};

export default TokenAmountInput;