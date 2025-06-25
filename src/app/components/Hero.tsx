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
    <div className="relative min-h-screen overflow-hidden">
      {/* Fallback Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" style={{ zIndex: -1 }} />
      
      {/* Spline Scene */}
      {!splineError && (
        <Spline 
          scene="https://prod.spline.design/lX0ekK8OK9dc4DlA/scene.splinecode"
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
            {/* Explorer Button - Below Navigation */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2" style={{ zIndex: 999 }}>
        <button
          onClick={() => router.push('/explorer')}
          className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-semibold text-lg shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 border border-white/20 backdrop-blur-sm"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300"></div>
          <span className="relative flex items-center gap-3">
            AI Meets Chiliz: C-TRACE is Live
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </span>
        </button>
      </div>

      {/* Search box at bottom */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4" style={{ zIndex: 999 }}>
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
      <footer className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-white/40 text-center">
        &copy; {new Date().getFullYear()} c-trace | Crafted with ❤ from ch04niverse
      </footer>
    </div>
  );
}