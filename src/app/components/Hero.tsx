
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { SearchIcon } from "@/app/components/SearchIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";

const blockchains = [
  { id: "88888", name: "Chiliz Chain" }, // Chiliz Mainnet
];

export function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [typingText, setTypingText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const texts = [
    'Explore Smart Contracts ⚙️',
    'Check Token Balances 💰',
    'Inspect Transactions 🔍',
    'Query Blockchain Data 📊'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentText = texts[textIndex];
      
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setTypingText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setTypingText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex, texts]);

  const handleSearch = () => {
    if (!selectedChain || !searchTerm.trim()) {
      alert("Please select a chain and enter a search term");
      return;
    }
    console.log("Searching:", searchTerm, "on chain:", selectedChain);
    router.push(
      `/explorer?chainId=${selectedChain}&searchTerm=${encodeURIComponent(
        searchTerm
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans p-4">
      <main className="flex flex-col items-center mt-24 text-center">
        <motion.h1
          className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg min-h-[80px]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {typingText}
          <span className="animate-pulse">|</span>
        </motion.h1>
        <p className="text-lg text-white/70 mt-6 max-w-xl">
          A sleek interface to query and explore Chiliz chain data with natural language.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center w-full sm:w-[600px]">
          <Input
            type="text"
            placeholder="Enter contract address or question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-pink-600 placeholder-white/50 text-white backdrop-blur-md"
          />
          <Select value={selectedChain} onValueChange={setSelectedChain}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white/10 border border-white/10 text-white backdrop-blur-md">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/10">
              {blockchains.map((chain) => (
                <SelectItem 
                  key={chain.id} 
                  value={chain.id}
                  className="text-white hover:bg-white/10"
                >
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button 
            onClick={handleSearch}
            className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg text-white font-semibold shadow-[0_0_12px_#ec4899] transition-all"
          >
            🔍 Search
          </button>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {[
            { title: 'Check Balance', desc: 'Explore token balances easily through AI prompts.' },
            { title: 'Get Contract Info', desc: 'Discover smart contract details and functions.' },
            { title: 'Decode Transaction', desc: 'Analyze transaction data with natural language.' }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className="glass-card rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-xl font-bold text-chiliz-primary mb-2">{item.title}</h3>
              <p className="text-white/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="mt-24 text-sm text-white/40 text-center">
        &copy; {new Date().getFullYear()} Chiliz AI | Crafted with ❤️
      </footer>
    </div>
  );
}
