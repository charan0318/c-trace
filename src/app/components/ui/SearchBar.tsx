
"use client";

import React, { useState, useCallback } from "react";
import { Search, ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SearchBarProps {
  contractAddress?: string;
  selectedChain?: string;
  onSearch?: (address: string, chain: string) => void;
  onAddressChange?: (address: string) => void;
  onChainChange?: (chain: string) => void;
  placeholder?: string;
  chains?: Option[];
  className?: string;
}

const defaultChains: Option[] = [
  { value: "ethereum", label: "Ethereum" },
  { value: "polygon", label: "Polygon" },
  { value: "bsc", label: "BSC" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
  { value: "avalanche", label: "Avalanche" },
];

const SearchBar: React.FC<SearchBarProps> = ({
  contractAddress = "",
  selectedChain = "",
  onSearch,
  onAddressChange,
  onChainChange,
  placeholder = "Enter contract address or query",
  chains = defaultChains,
  className = "",
}) => {
  const [address, setAddress] = useState(contractAddress);
  const [chain, setChain] = useState(selectedChain);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAddress(value);
      onAddressChange?.(value);
    },
    [onAddressChange]
  );

  const handleChainSelect = useCallback(
    (selectedChain: Option) => {
      setChain(selectedChain.value);
      setIsDropdownOpen(false);
      onChainChange?.(selectedChain.value);
    },
    [onChainChange]
  );

  const handleSearch = useCallback(() => {
    if (address.trim() && chain) {
      onSearch?.(address.trim(), chain);
    }
  }, [address, chain, onSearch]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const selectedChainLabel = chains.find((c) => c.value === chain)?.label || "Select chain";

  return (
    <div
      className={`
        relative flex flex-col sm:flex-row items-stretch w-full max-w-4xl mx-auto
        bg-white/10 backdrop-blur-md border border-red-400/40
        rounded-2xl shadow-lg p-2 gap-2
        shadow-red-500/20 shadow-2xl
        before:absolute before:inset-0 before:rounded-2xl
        before:bg-gradient-to-r before:from-red-500/20 before:to-orange-500/20
        before:blur-xl before:-z-10 before:animate-pulse
        ${className}
      `}
    >
      {/* Input Field */}
      <div className="flex-1 relative order-1 sm:order-1">
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="
            w-full px-3 md:px-4 py-3 bg-transparent text-white placeholder-white/60
            border border-red-400/40 rounded-xl text-sm md:text-base
            focus:outline-none focus:border-red-500/70 focus:ring-2 focus:ring-red-500/30
            transition-all duration-200 min-h-[44px]
            shadow-inner shadow-red-500/10
          "
        />
      </div>

      {/* Mobile-first layout: Chain selector and search button on same row */}
      <div className="flex gap-2 order-2 sm:order-2">
        {/* Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="
              flex items-center justify-between w-full sm:min-w-[120px] md:min-w-[140px] px-3 md:px-4 py-3
              bg-transparent text-white border border-red-400/40 rounded-xl
              hover:border-red-500/70 focus:outline-none focus:border-red-500/70
              focus:ring-2 focus:ring-red-500/30 transition-all duration-200 min-h-[44px]
              shadow-inner shadow-red-500/10 text-sm md:text-base
            "
          >
            <span className="truncate">{selectedChainLabel}</span>
            <ChevronDown
              className={`ml-1 md:ml-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="
              absolute top-full left-0 right-0 mt-1 z-50
              bg-white/10 backdrop-blur-md border border-red-400/40
              rounded-xl shadow-lg shadow-red-500/20 overflow-hidden
              min-w-max
            ">
              {chains.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleChainSelect(option)}
                  className="
                    w-full px-3 md:px-4 py-3 text-left text-white text-sm md:text-base
                    hover:bg-white/10 transition-colors duration-150
                    first:rounded-t-xl last:rounded-b-xl
                    whitespace-nowrap
                  "
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!address.trim() || !chain}
          className="
            flex items-center justify-center px-4 md:px-6 py-3 flex-shrink-0
            bg-gradient-to-r from-red-500 to-red-600
            hover:from-red-600 hover:to-red-700
            disabled:from-gray-500 disabled:to-gray-600
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-medium rounded-xl
            transition-all duration-200 transform
            hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-red-400/50
            min-h-[44px] min-w-[44px] text-sm md:text-base
          "
        >
          <Search className="h-4 w-4 text-cyan-300" />
          <span className="ml-1 md:ml-2 hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Click outside handler */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;
