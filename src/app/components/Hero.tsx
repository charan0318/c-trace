"use client";

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});
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

const blockchains = [{ id: '88888', name: 'Chiliz Chain' }];

export function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
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
      {/* Spline Background */}
      <div className="absolute inset-0 z-0">
        <Spline 
          scene="https://my.spline.design/r4xbot-j18mmSGvHZoYHkC5n0B2EB0H"
          onLoad={() => console.log('Spline loaded successfully')}
          onError={(error) => console.error('Spline loading error:', error)}
        />
      </div>

      {/* Foreground UI */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white px-4">
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

        {/* Footer Restored */}
        <footer className="mt-24 text-sm text-white/40 text-center">
          &copy; {new Date().getFullYear()} Chiliz AI | Crafted with ❤️
        </footer>
      </div>
    </div>
  );
}