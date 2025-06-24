
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
      {/* Enhanced Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
        
        {/* Animated gradient overlays */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-red-500/30 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-radial from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-radial from-purple-500/25 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(229, 0, 70, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(229, 0, 70, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Spline Scene - Now with better integration */}
      {!splineError && (
        <div className="absolute inset-0 z-10 opacity-70">
          <Spline 
            scene="https://prod.spline.design/CzpaWhZatxJIV-bg/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{ 
              width: '100%', 
              height: '100%',
              minHeight: '100vh',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* Fallback background when Spline fails */}
      {splineError && (
        <div className="absolute inset-0 z-10">
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900/20 to-red-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,0,70,0.1),transparent_70%)]" />
        </div>
      )}

      {/* Content overlay with improved backdrop */}
      <div className="absolute inset-0 z-20">
        {/* Search box at top with enhanced styling */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
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
        </div>

        {/* Center content area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-red-200 to-pink-200 bg-clip-text text-transparent">
            Chiliz AI Explorer
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore the Chiliz blockchain with AI-powered insights and analytics
          </p>
        </div>

        {/* Enhanced footer */}
        <footer className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
          <div className="backdrop-blur-md bg-white/5 rounded-full px-6 py-3 border border-white/10">
            <p className="text-sm text-white/70">
              &copy; {new Date().getFullYear()} c-trace | Crafted with ❤ from ch04niverse
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
