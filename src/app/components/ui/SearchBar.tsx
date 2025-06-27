'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search blockchain data...",
  className = "",
  isLoading = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sampleQueries = [
    "Analyze contract security",
    "Check token balance",
    "Explain transaction details",
    "Fan token information",
    "Contract function details",
    "Transaction history",
    "Token transfer events",
    "Smart contract verification"
  ];

  useEffect(() => {
    if (value.length > 2) {
      const filtered = sampleQueries.filter(query =>
        query.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 4));
      setShowSuggestions(filtered.length > 0 && isFocused);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const isValidAddress = (input: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(input);
  };

  const isValidTxHash = (input: string) => {
    return /^0x[a-fA-F0-9]{64}$/.test(input);
  };

  const getInputType = () => {
    if (isValidAddress(value)) return 'address';
    if (isValidTxHash(value)) return 'transaction';
    if (value.startsWith('0x')) return 'partial-hash';
    return 'query';
  };

  const getPlaceholderText = () => {
    if (isFocused) {
      return isMobile ? "0x1234...abc or ask a question" : "Try: 0x1234...abc or 'What does this contract do?'";
    }
    return placeholder;
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative overflow-hidden rounded-xl md:rounded-2xl border-2 transition-all duration-300 ${
          isFocused 
            ? 'border-chiliz-primary/50 shadow-lg shadow-chiliz-primary/10' 
            : 'border-white/20 hover:border-white/30'
        }`}>
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-black/80 to-gray-900/90 backdrop-blur-xl" />

          {/* Animated Border Glow */}
          <div className={`absolute inset-0 bg-gradient-to-r from-chiliz-primary/20 to-transparent rounded-xl md:rounded-2xl transition-opacity duration-300 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`} />

          <div className="relative flex items-center">
            {/* Input Type Indicator - Compact on mobile */}
            <div className="absolute left-3 md:left-4 flex items-center">
              {getInputType() === 'address' && (
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400 font-medium hidden md:block">Address</span>
                </div>
              )}
              {getInputType() === 'transaction' && (
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-400 font-medium hidden md:block">Transaction</span>
                </div>
              )}
              {getInputType() === 'query' && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-chiliz-primary" />
                  <span className="text-xs text-chiliz-primary font-medium hidden md:block">AI Query</span>
                </div>
              )}
            </div>

            {/* Search Input */}
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder={getPlaceholderText()}
              className="w-full px-3 py-3 md:px-4 md:py-4 pr-12 md:pr-16 pl-16 md:pl-24 bg-transparent text-white placeholder-white/50 focus:outline-none text-sm md:text-base font-medium rounded-xl md:rounded-2xl touch-manipulation"
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {/* Search Button */}
            <button
              type="submit"
              disabled={!value.trim() || isLoading}
              className={`absolute right-2 p-2 md:p-3 rounded-lg md:rounded-xl transition-all duration-200 touch-manipulation ${
                value.trim() && !isLoading
                  ? 'bg-chiliz-primary hover:bg-chiliz-primary/80 text-white shadow-lg shadow-chiliz-primary/25'
                  : 'bg-white/10 text-white/50 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              ) : (
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg md:rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 flex items-center gap-2 md:gap-3 group touch-manipulation"
                >
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-chiliz-primary/60 group-hover:text-chiliz-primary flex-shrink-0" />
                  <span className="text-xs md:text-sm line-clamp-1">{suggestion}</span>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-white/30 group-hover:text-white/60 ml-auto flex-shrink-0" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Search Tips - Simplified for mobile */}
      {isFocused && !showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg md:rounded-xl p-3 md:p-4 z-50"
        >
          <div className="text-xs text-white/60 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-chiliz-primary rounded-full flex-shrink-0" />
              <span className="line-clamp-1">Contract addresses (0x...)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-chiliz-primary rounded-full flex-shrink-0" />
              <span className="line-clamp-1">Transaction hashes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-chiliz-primary rounded-full flex-shrink-0" />
              <span className="line-clamp-1">Natural language questions</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;