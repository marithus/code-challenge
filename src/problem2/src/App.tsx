import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDownIcon } from './assets/Icons';
import TokenAmountInput from './components/TokenAmountInput';
import TokenSelector from './components/TokenSelector';
import type { Token } from './types';
import { processTokenData } from './utils';

/**
 * Main currency swap application component
 * Allows users to swap between different cryptocurrencies with real-time price data
 */
export default function App() {
  // Token management state
  const [tokens, setTokens] = useState<Token[]>([]);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  
  // Amount and calculation state
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  
  // UI state for modals
  const [isFromModalOpen, setIsFromModalOpen] = useState<boolean>(false);
  const [isToModalOpen, setIsToModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Application state
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Mock balance for demonstration purposes
  const MOCK_BALANCE = 10;

  /**
   * Fetches token price data from the API and initializes default tokens
   * Sets ETH as the default 'from' token and USDC as the default 'to' token
   */
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const processedTokens = processTokenData(data);
        
        setTokens(processedTokens);
        
        // Set default tokens for better UX
        const defaultFromToken = processedTokens.find(token => token.currency === 'ETH') || null;
        const defaultToToken = processedTokens.find(token => token.currency === 'USDC') || null;
        
        setFromToken(defaultFromToken);
        setToToken(defaultToToken);
      } catch (error) {
        console.error("Failed to fetch token prices:", error);
        setError("Failed to load token prices. Please refresh the page to try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  /**
   * Calculates the output amount when input amount or tokens change
   * Also validates balance and updates error state accordingly
   */
  useEffect(() => {
    const fromAmountNum = parseFloat(fromAmount);
    
    // Reset error state
    setError('');
    
    // Validate balance first
    if (fromAmountNum > MOCK_BALANCE && fromToken) {
      setError(`Insufficient ${fromToken.currency} balance`);
    }
    
    // Calculate exchange rate and output amount
    if (fromAmountNum > 0 && fromToken && toToken && fromToken.price && toToken.price) {
      const exchangeRate = fromToken.price / toToken.price;
      const calculatedToAmount = fromAmountNum * exchangeRate;
      setToAmount(calculatedToAmount.toFixed(6));
    } else {
      // Clear output amount if input is invalid
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, MOCK_BALANCE]);

  /**
   * Handles input amount changes with validation to prevent negative values
   */
  const handleFromAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow empty string or non-negative numbers
    if (value === '' || (Number(value) >= 0 && !isNaN(Number(value)))) {
      setFromAmount(value);
    }
  }, []);

  /**
   * Handles selection of the 'from' token
   * Automatically swaps tokens if user selects the same token as 'to' token
   */
  const handleSelectFromToken = useCallback((token: Token) => {
    // Prevent selecting the same token for both sides
    if (toToken && toToken.currency === token.currency) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setIsFromModalOpen(false);
    setSearchTerm('');
  }, [toToken, fromToken]);

  /**
   * Handles selection of the 'to' token
   * Automatically swaps tokens if user selects the same token as 'from' token
   */
  const handleSelectToToken = useCallback((token: Token) => {
    // Prevent selecting the same token for both sides
    if (fromToken && fromToken.currency === token.currency) {
      setFromToken(toToken);
    }
    setToToken(token);
    setIsToModalOpen(false);
    setSearchTerm('');
  }, [fromToken, toToken]);

  /**
   * Swaps the 'from' and 'to' tokens and their amounts
   * Disabled during swap animation to prevent conflicts
   */
  const handleSwapTokens = useCallback(() => {
    if (isSwapping) return;
    
    // Swap tokens and amounts
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  }, [isSwapping, toToken, fromToken, toAmount]);

  /**
   * Initiates the swap process with animation feedback
   * Simulates a 2-second swap operation
   */
  const handleSwapClick = useCallback(() => {    
    setIsSwapping(true);
    
    // Simulate swap operation
    setTimeout(() => {
      setFromAmount('');
      setToAmount('');
      setIsSwapping(false);
    }, 2000);
  }, []);

  // Calculate button disabled state
  const isButtonDisabled = !fromAmount || parseFloat(fromAmount) <= 0 || !!error || isSwapping;

  // Loading state while fetching token data
  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans text-white">
        <div className="text-xl">Loading tokens...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center font-sans text-white p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-1 mb-2">
          <h1 className="text-xl font-semibold p-3 text-center">Currency Swap</h1>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 relative">
          <div className="space-y-2">
            <TokenAmountInput
              label="You pay"
              amount={fromAmount}
              onAmountChange={handleFromAmountChange}
              selectedToken={fromToken}
              onSelectTokenClick={() => setIsFromModalOpen(true)}
              balance={MOCK_BALANCE}
              disabled={isSwapping}
            />
            <div className="flex justify-center -my-4 z-10">
              <button onClick={handleSwapTokens} className="bg-gray-700 p-2 rounded-full border-4 border-gray-800 text-gray-400 hover:text-white hover:rotate-180 transition-transform duration-300">
                <ArrowDownIcon className="w-5 h-5" />
              </button>
            </div>
            <TokenAmountInput
              label="You receive"
              amount={toAmount}
              onAmountChange={() => { }}
              selectedToken={toToken}
              onSelectTokenClick={() => setIsToModalOpen(true)}
              balance={0}
              disabled={isSwapping}
            />
          </div>

          {error && (
            <div className="mt-4 text-red-400 text-center text-sm">
              {error}
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={handleSwapClick}
              className={`w-full text-white font-bold py-4 px-4 rounded-2xl text-xl transition-colors duration-200 ${isButtonDisabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={isButtonDisabled}
            >
              {isSwapping ? 'Swapping...' : (error ? error : 'Swap')}
            </button>
          </div>
        </div>
      </div>

      <TokenSelector
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        tokens={tokens.filter(t => !toToken || t.currency !== toToken.currency)}
        onSelectToken={handleSelectFromToken}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <TokenSelector
        isOpen={isToModalOpen}
        onClose={() => setIsToModalOpen(false)}
        tokens={tokens.filter(t => !fromToken || t.currency !== fromToken.currency)}
        onSelectToken={handleSelectToToken}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
}
