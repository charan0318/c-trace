
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
        relative flex items-center w-full max-w-4xl mx-auto
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
      <div className="flex-1 relative">
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="
            w-full px-4 py-3 bg-transparent text-white placeholder-white/60
            border border-gray-600/40 rounded-xl
            focus:outline-none focus:border-gray-500/70 focus:ring-2 focus:ring-gray-500/30
            transition-all duration-200
          "
        />
      </div>

      {/* Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="
            flex items-center justify-between min-w-[140px] px-4 py-3
            bg-transparent text-white border border-gray-600/40 rounded-xl
            hover:border-gray-500/70 focus:outline-none focus:border-gray-500/70
            focus:ring-2 focus:ring-gray-500/30 transition-all duration-200
          "
        >
          <span className="text-sm truncate">{selectedChainLabel}</span>
          <ChevronDown
            className={`ml-2 h-4 w-4 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="
            absolute top-full left-0 right-0 mt-1 z-50
            bg-white/10 backdrop-blur-md border border-gray-600/40
            rounded-xl shadow-lg overflow-hidden
          ">
            {chains.map((option) => (
              <button
                key={option.value}
                onClick={() => handleChainSelect(option)}
                className="
                  w-full px-4 py-3 text-left text-white text-sm
                  hover:bg-white/10 transition-colors duration-150
                  first:rounded-t-xl last:rounded-b-xl
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
          flex items-center justify-center px-6 py-3
          bg-gradient-to-r from-red-500 to-red-600
          hover:from-red-600 hover:to-red-700
          disabled:from-gray-500 disabled:to-gray-600
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white font-medium rounded-xl
          transition-all duration-200 transform
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-red-400/50
        "
      >
        <Search className="h-4 w-4 mr-2 text-cyan-300" />
        Search
      </button>

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
