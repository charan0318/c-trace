'use client';

import Spline from '@splinetool/react-spline';
import { useState, useCallback } from 'react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useRouter } from 'next/navigation';

const blockchains = [{ id: '88888', name: 'Chiliz Chain' }];

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(() => {
    if (!selectedChain || !searchTerm.trim()) {
      alert('Please select a chain and enter a search term');
      return;
    }
    try {
      router.push(
        `/explorer?chainId=${selectedChain}&searchTerm=${encodeURIComponent(searchTerm)}`
      );
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Failed to navigate to explorer');
    }
  }, [selectedChain, searchTerm, router]);

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
      {/* Spline Scene */}
      <Spline 
        scene="https://prod.spline.design/CzpaWhZatxJIV-bg/scene.splinecode"
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

      {/* Foreground UI - Explicit high z-index */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4" style={{ zIndex: 999 }}>
        {/* Search box - moved higher */}
        <div className="glass-panel w-full sm:w-[700px] p-6 backdrop-blur-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/30 shadow-2xl mb-16">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              type="text"
              placeholder="Enter contract address or question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full p-4 rounded-xl bg-white/10 border border-purple-400/30 text-white placeholder-white/60 backdrop-blur-xl focus:border-pink-400/50 focus:ring-2 focus:ring-pink-400/20"
            />
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white/10 border border-purple-400/30 text-white backdrop-blur-xl rounded-xl focus:border-pink-400/50">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-xl bg-gray-900/95 border-purple-400/30 rounded-xl">
                {blockchains.map((chain) => (
                  <SelectItem
                    key={chain.id}
                    value={chain.id}
                    className="text-white hover:bg-purple-600/20 rounded-lg"
                  >
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-pink-500/25"
            >
              🔍 Search
            </Button>
          </div>
        </div>

        {/* Feature Cards - Only 2 cards, positioned left and right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full max-w-4xl px-4">
          <div className="glass-panel hover:scale-105 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-400/30 hover:border-blue-400/50">
            <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300 transition-all">
              Check Balance
            </h3>
            <p className="text-white/80 leading-relaxed">Explore token balances easily through AI prompts.</p>
          </div>
          
          <div className="glass-panel hover:scale-105 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-pink-900/20 to-red-900/20 border border-pink-400/30 hover:border-pink-400/50">
            <h3 className="text-xl font-bold text-pink-400 mb-3 group-hover:text-pink-300 transition-all">
              Get Contract Info
            </h3>
            <p className="text-white/80 leading-relaxed">Discover smart contract details and functions.</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-sm text-white/40 text-center">
          &copy; {new Date().getFullYear()} Chiliz AI | Crafted with ❤
        </footer>
      </div>
    </div>
  );
}