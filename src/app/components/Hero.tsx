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
            {/* Search box at top */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2" style={{ zIndex: 999 }}>
              <div className="glass-panel w-[500px] p-4 backdrop-blur-xl bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/30 shadow-2xl">
                <div className="flex gap-3 items-center">
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
      </div>
      {/* Footer */}
      <footer className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-white/40 text-center">
        &copy; {new Date().getFullYear()} c-trace | Crafted with ❤ from ch04niverse
      </footer>
    </div>
  );
}