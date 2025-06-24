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
    <div className="fixed inset-0 min-h-screen overflow-hidden">
      {/* Spline Scene */}
      <Spline 
        scene="https://prod.spline.design/CzpaWhZatxJIV-bg/scene.splinecode"
        onLoad={handleSplineLoad}
        onError={handleSplineError}
        style={{ 
          width: '100%', 
          height: '100%',
          minHeight: '100vh',
          objectFit: 'cover',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
      />
      {/* Search box at top */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4" style={{ zIndex: 999 }}>
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