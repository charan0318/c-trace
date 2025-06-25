'use client';

import Spline from '@splinetool/react-spline';
import { useState, useCallback } from 'react';
import SearchBar from '@/app/components/ui/SearchBar';

import { useRouter } from 'next/navigation';

const blockchains = [
  { value: '88888', label: 'Chiliz Chain' }
];

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [sceneVersion, setSceneVersion] = useState(Date.now());
  const router = useRouter();

  const handleSearch = useCallback((address: string, chain: string) => {
    if (!chain || !address.trim()) {
      alert('Please select a chain and enter a search term');
      return;
    }
    try {
      router.push(
        `/explorer?chainId=${chain}&searchTerm=${encodeURIComponent(address)}`
      );
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
    console.error('❌ Spline scene failed to load:', error);
    setSplineError(true);
    setSplineLoaded(false);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden pt-20">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" style={{ zIndex: -1 }} />
      
      {/* Spline Scene */}
      {!splineError && (
        <Spline 
          scene={`https://prod.spline.design/lX0ekK8OK9dc4DlA/scene.splinecode?v=${sceneVersion}`}
          onLoad={handleSplineLoad}
          onError={handleSplineError}
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '100vh', // Ensure full screen height
            objectFit: 'cover', // Cover the entire screen
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />
      )}
      
      {splineError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center text-white/60" style={{ zIndex: 0 }}>
          <p>3D Scene unavailable - Using fallback background</p>
        </div>
      )}
            

      {/* AI Meets Chiliz Banner */}
      <div className="absolute top-8 md:top-12 left-0 transform -translate-x-0 flex justify-center w-full px-4" style={{ zIndex: 999 }}>
        <button
          onClick={() => router.push('/explorer')}
          className="group relative px-4 md:px-6 py-2 md:py-3 rounded-2xl bg-transparent border border-white/20 hover:border-chiliz-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-chiliz-primary/20 backdrop-blur-sm min-h-[44px] min-w-[44px] max-w-full"
        >
          {/* Gradient background on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chiliz-primary/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          
          {/* Content */}
          <div className="relative flex items-center gap-2 md:gap-3 justify-center">
            <span className="font-semibold text-sm md:text-lg text-white/90 group-hover:text-white transition-colors text-center leading-tight">
              <span className="hidden sm:inline">AI Meets Chiliz: </span>C-TRACE is Live
            </span>
            <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-pulse flex-shrink-0"></div>
          </div>
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
          placeholder="Enter contract address or question..."
          chains={blockchains}
          className="w-full"
        />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 text-xs md:text-sm text-white/40 text-center px-4 max-w-full">
        <span className="block">&copy; {new Date().getFullYear()} c-trace | Crafted with ❤ from ch04niverse</span>
      </footer>
    </div>
  );
}