'use client';

import Spline from '@splinetool/react-spline';
import { useState, useCallback } from 'react';
import SearchBar from '@/app/components/ui/SearchBar';
import Silk from '@/app/components/ui/Silk';

import { useRouter } from 'next/navigation';

const blockchains = [
  { value: '88888', label: 'Chiliz Mainnet' },
];

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('88888'); // Default to Chiliz Chain
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback((searchInput: string, chain: string) => {
    const finalChain = chain || '88888'; // Default to Chiliz Chain if no chain selected
    if (!searchInput.trim()) {
      alert('Please enter a contract address or search term');
      return;
    }

    const trimmedInput = searchInput.trim();

    // Check if input looks like a contract address (starts with 0x and is 40-42 characters)
    const isContractAddress = /^0x[a-fA-F0-9]{40}$/.test(trimmedInput);

    try {
      if (isContractAddress) {
        // Navigate with contract address
        console.log('Navigating to explorer with contract address:', { address: trimmedInput, chain: finalChain });
        router.push(
          `/explorer?chainId=${finalChain}&searchTerm=${encodeURIComponent(trimmedInput)}`
        );
      } else {
        const normalizedInput = trimmedInput.trim();
        const isTokenSymbol = /^[A-Za-z]+$/.test(normalizedInput);

        if (isTokenSymbol) {
        // Handle token symbol queries with ChilizScan integration
        const tokenQuery = `Search for ${normalizedInput} token on Chiliz Chain using ChilizScan. If found, provide: 1) Contract address 2) Token symbol 3) Total supply 4) Decimals 5) Current holders. If not found on Chiliz, check spelling and suggest alternatives.`;
        console.log('Navigating to explorer with token query:', { query: tokenQuery, chain: finalChain });
        router.push(
          `/explorer?chainId=${finalChain}&query=${encodeURIComponent(tokenQuery)}&searchType=token&symbol=${encodeURIComponent(normalizedInput)}`
        );
      } else {
        // Handle specific token name searches (like chilizinu, kayen, etc.)
        const lowerInput = normalizedInput.toLowerCase();
        let searchQuery;

        if (lowerInput.includes('inu') || lowerInput.includes('token') || lowerInput.includes('coin')) {
          searchQuery = `Find the contract address and complete details for "${normalizedInput}" token on Chiliz Chain. Search the Chiliz blockchain explorer at https://scan.chiliz.com/tokens and provide: 1) Contract address 2) Token symbol 3) Total supply 4) Decimals 5) Current holders. If not found on Chiliz, check if it exists on other networks.`;
        } else {
          searchQuery = normalizedInput.toLowerCase();
        }

        console.log('Navigating to explorer with enhanced query:', { query: searchQuery, chain: finalChain });
        router.push(
          `/explorer?chainId=${finalChain}&query=${encodeURIComponent(searchQuery)}&searchType=general`
        );
      }
      }
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Failed to navigate to explorer');
    }
  }, [router]);

  const handleAddressChange = useCallback((address: string) => {
    setSearchTerm(address);
  }, []);

  const handleChainChange = useCallback((chain: string) => {
    setSelectedChain(chain);
  }, []);

  const handleSplineLoad = useCallback(() => {
    console.log('✅ Spline scene loaded successfully');
    setSplineLoaded(true);
  }, []);

  const handleSplineError = useCallback((error: any) => {
    console.warn('⚠️ Spline scene failed to load, using fallback background:', error);
    setSplineError(true);
    setSplineLoaded(false);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden pt-20">
      {/* Silk Background - Bottom Layer */}
      <div className="absolute inset-0" style={{ zIndex: -10 }}>
        <Silk
          speed={2}
          scale={1.8}
          color="#4a4a7e"
          noiseIntensity={1.2}
          rotation={0}
        />
      </div>

      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black/40 to-gray-900/20" style={{ zIndex: -5 }} />

      {/* Spline Scene - Above Silk */}
      {!splineError && (
        <Spline 
          scene="https://prod.spline.design/lX0ekK8OK9dc4DlA/scene.splinecode"
          onLoad={handleSplineLoad}
          onError={handleSplineError}
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '100vh',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      {splineError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-black/80 to-gray-900/60 flex items-center justify-center text-white/60" style={{ zIndex: 1 }}>
          <p>3D Scene unavailable - Using Silk background</p>
        </div>
      )}


      {/* AI Meets Chiliz Banner */}
      <div className="absolute top-36 md:top-32 left-0 transform -translate-x-0 flex justify-center w-full px-4" style={{ zIndex: 9999 }}>
        <button
          onClick={() => router.push('/explorer')}
          className="group relative px-4 md:px-6 py-2 md:py-3 rounded-2xl bg-transparent border-2 border-chiliz-primary hover:bg-chiliz-primary/10 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-md min-h-[44px] min-w-[44px] max-w-full"
          style={{
            boxShadow: '0 0 20px rgba(255, 178, 102, 0.3), inset 0 0 20px rgba(255, 178, 102, 0.1)'
          }}
        >
          {/* Neon glow background */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chiliz-primary/20 to-red-600/20 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

          {/* Content */}
          <div className="relative z-10 flex items-center gap-2 md:gap-3 justify-center">
            <span className="font-semibold text-sm md:text-lg text-white transition-colors text-center leading-tight whitespace-nowrap">
              <span className="hidden sm:inline">AI Meets Chiliz: </span>C-TRACE is Live
            </span>
            <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-pulse flex-shrink-0"></div>
          </div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-chiliz-primary opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
        </button>
      </div>

      {/* Search box at bottom */}
      <div className="absolute bottom-24 md:bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl px-4" style={{ zIndex: 999 }}>
        <SearchBar
          contractAddress={searchTerm}
          selectedChain={selectedChain}
          onSearch={handleSearch}
          onAddressChange={handleAddressChange}
          onChainChange={handleChainChange}
          placeholder="Enter contract address or ask about Chiliz..."
          chains={blockchains}
          className="w-full"
        />
      </div>

      {/* Check out docs Button - Fixed Position Left */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => router.push('/docs')}
          className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900/80 border border-white/30 hover:border-chiliz-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-chiliz-primary/20 rounded-full backdrop-blur-md"
        >
          {/* Gradient background on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chiliz-primary/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

          {/* Button content */}
          <span className="relative z-10 whitespace-nowrap group-hover:text-chiliz-primary transition-colors">Check out docs</span>
        </button>
      </div>

      {/* Got Feedback Button - Fixed Position */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://t.me/ch04niverse"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900/80 border border-white/30 hover:border-chiliz-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-chiliz-primary/20 rounded-full backdrop-blur-md"
        >
          {/* Gradient background on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chiliz-primary/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

          {/* Button content */}
          <span className="relative z-10 whitespace-nowrap group-hover:text-chiliz-primary transition-colors">Got Feedback?</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 text-xs md:text-sm text-white/40 text-center px-4 max-w-full">
        <div className="space-y-1">
          <p className="text-red-500 font-semibold">#BuiltOnChiliz</p>
          <span className="block">&copy; {new Date().getFullYear()} c-trace | Crafted with ❤️ by ch04niverse</span>
        </div>
      </footer>
    </div>
  );
}