'use client';

import Spline from '@splinetool/react-spline/next';
import { useState } from 'react';
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

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('transaction');
  const [isLoading, setIsLoading] = useState(true);
  const [splineError, setSplineError] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/explorer?query=${encodeURIComponent(searchQuery)}&type=${searchType}`);
    }
  };

  const onSplineLoad = () => {
    console.log('✅ Spline scene loaded successfully');
    setIsLoading(false);
  };

  const onSplineError = (error: any) => {
    console.log('❌ Spline scene failed to load:', error);
    setSplineError(true);
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0" style={{ zIndex: -1 }}>
        {isLoading && !splineError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            <div className="text-white text-xl">Loading 3D Scene...</div>
          </div>
        )}
        
        {splineError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-pink-900/40" />
        ) : (
          <Spline
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            onLoad={onSplineLoad}
            onError={onSplineError}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* Foreground UI */}
      <div className="relative z-[999] text-center px-4 max-w-4xl mx-auto">
        <div className="glass-panel mb-8 p-8">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-chiliz-primary to-chiliz-secondary bg-clip-text text-transparent">
            🌶️ Chiliz AI Explorer
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Explore the Chiliz blockchain with AI-powered insights. Search transactions, addresses, and blocks with intelligent analysis.
          </p>
        </div>

        {/* Search Interface */}
        <div className="glass-panel p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transaction">Transaction</SelectItem>
                <SelectItem value="address">Address</SelectItem>
                <SelectItem value="block">Block</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Enter transaction hash, address, or block number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            
            <Button 
              onClick={handleSearch}
              className="bg-chiliz-primary hover:bg-chiliz-primary/80 text-white px-8"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="glass-panel p-6">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-white font-semibold mb-2">Smart Search</h3>
            <p className="text-white/70 text-sm">AI-powered blockchain exploration with intelligent insights</p>
          </div>
          
          <div className="glass-panel p-6">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-white font-semibold mb-2">Real-time Data</h3>
            <p className="text-white/70 text-sm">Live blockchain data with instant updates</p>
          </div>
          
          <div className="glass-panel p-6">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-white font-semibold mb-2">Secure & Fast</h3>
            <p className="text-white/70 text-sm">Built on reliable infrastructure for optimal performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const blockchains = [{ id: '88888', name: 'Chiliz Chain' }];

export function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (!selectedChain || !searchTerm.trim()) {
      alert('Please select a chain and enter a search term');
      return;
    }
    router.push(
      `/explorer?chainId=${selectedChain}&searchTerm=${encodeURIComponent(searchTerm)}`
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Spline Background - Fixed z-index and positioning */}
      <div className="fixed top-0 left-0 w-full h-full" style={{ zIndex: -1 }}>
        {!splineLoaded && !splineError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white/50 text-lg">Loading 3D Scene...</div>
          </div>
        )}
        {splineError && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
        )}
        <Spline 
          scene="https://prod.spline.design/CzpaWhZatxJIV-bg/scene.splinecode"
          onLoad={() => {
            console.log('✅ Spline scene loaded successfully');
            setSplineLoaded(true);
          }}
          onError={(error) => {
            console.error('❌ Spline scene failed to load:', error);
            setSplineError(true);
          }}
          style={{ 
            width: '100%', 
            height: '100%',
            opacity: splineLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            zIndex: -1
          }}
        />
      </div>

      {/* Foreground UI - Explicit high z-index */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-white px-4" style={{ zIndex: 999 }}>
        {/* Search box */}
        <div className="glass-panel w-full sm:w-[700px] p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              type="text"
              placeholder="Enter contract address or question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-xl"
            />
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white/5 border border-white/20 text-white backdrop-blur-xl rounded-xl">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-xl bg-chiliz-dark/90 border-white/10 rounded-xl">
                {blockchains.map((chain) => (
                  <SelectItem
                    key={chain.id}
                    value={chain.id}
                    className="text-white hover:bg-white/10 rounded-lg"
                  >
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleSearch}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl"
            >
              🔍 Search
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {[
            { title: 'Check Balance', desc: 'Explore token balances easily through AI prompts.' },
            { title: 'Get Contract Info', desc: 'Discover smart contract details and functions.' },
            { title: 'Decode Transaction', desc: 'Analyze transaction data with natural language.' }
          ].map((item, index) => (
            <div
              key={index}
              className="glass-panel hover:scale-105 transition-all cursor-pointer group"
            >
              <h3 className="text-xl font-bold text-chiliz-primary mb-3 group-hover:text-glow transition-all">
                {item.title}
              </h3>
              <p className="text-white/80 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-24 text-sm text-white/40 text-center">
          &copy; {new Date().getFullYear()} Chiliz AI | Crafted with ❤️
        </footer>
      </div>
    </div>
  );
}
