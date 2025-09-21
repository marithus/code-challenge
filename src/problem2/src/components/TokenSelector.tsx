import React from 'react';
import { SearchIcon, XIcon } from "../assets/Icons";
import type { Token } from "../types";

/**
 * Props interface for the TokenSelector component
 */
interface TokenSelectorProps {
    /** Whether the modal is currently open */
    isOpen: boolean;
    /** Callback function to close the modal */
    onClose: () => void;
    /** Array of available tokens to select from */
    tokens: Token[];
    /** Callback function when a token is selected */
    onSelectToken: (token: Token) => void;
    /** Current search term for filtering tokens */
    searchTerm: string;
    /** Callback function to update the search term */
    setSearchTerm: (term: string) => void;
}

/**
 * TokenSelector component provides a searchable modal interface for token selection
 * Features search functionality and displays token icons with currency names
 */
const TokenSelector: React.FC<TokenSelectorProps> = ({ 
    isOpen, 
    onClose, 
    tokens, 
    onSelectToken, 
    searchTerm, 
    setSearchTerm 
}) => {
    // Early return if modal is closed
    if (!isOpen) return null;

    /**
     * Filter tokens based on search term (case-insensitive)
     */
    const filteredTokens = tokens.filter(token =>
        token.currency.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div 
                className="bg-gray-800 rounded-2xl w-full max-w-md flex flex-col" 
                style={{ height: '90vh', maxHeight: '500px' }}
            >
                {/* Modal header with title and close button */}
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-white text-lg font-semibold">Select a token</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-white transition-colors duration-150"
                        aria-label="Close modal"
                    >
                        <XIcon />
                    </button>
                </div>
                
                {/* Search input section */}
                <div className="p-4 border-b border-gray-700">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search name or paste address"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150"
                            autoFocus
                        />
                    </div>
                </div>
                
                {/* Token list section with scrollable content */}
                <div className="flex-grow overflow-y-auto p-2">
                    {filteredTokens.length > 0 ? (
                        filteredTokens.map(token => (
                            <button
                                key={token.currency}
                                onClick={() => onSelectToken(token)}
                                className="w-full flex items-center p-3 hover:bg-gray-700 rounded-lg transition-colors duration-150 focus:bg-gray-700 focus:outline-none"
                            >
                                <img
                                    src={token.icon}
                                    alt={`${token.currency} icon`}
                                    className="w-8 h-8 mr-4 rounded-full bg-gray-600"
                                    onError={(e) => { 
                                        // Fallback to placeholder if icon fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null; 
                                        target.src = 'https://placehold.co/40x40/2d3748/ffffff?text=?'; 
                                    }}
                                />
                                <div className="text-left">
                                    <p className="text-white font-medium">{token.currency}</p>
                                    <p className="text-gray-400 text-sm">
                                        ${token.price?.toFixed(6) || 'N/A'}
                                    </p>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-gray-400 text-center p-8">
                            <p>No tokens found.</p>
                            <p className="text-sm mt-2">Try adjusting your search term.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TokenSelector;