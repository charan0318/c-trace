'use client';

import Spline from '@splinetool/react-spline';
import { useState, useCallback, useEffect, useRef } from 'react';
import SearchBar from '@/app/components/ui/SearchBar';
import Silk from '@/app/components/ui/Silk';
import { useRouter } from 'next/navigation';

const blockchains = [
  { value: '88888', label: 'Chiliz Mainnet' },
];

const hundredThings = [
  // Fan Token Analysis (20 items)
  { category: "Fan Tokens", title: "PSG Fan Token Analysis", description: "Get detailed information about Paris Saint-Germain fan token", prompt: "What is PSG fan token?", requiresWallet: false },
  { category: "Fan Tokens", title: "Barcelona Token Details", description: "Explore FC Barcelona fan token metrics and usage", prompt: "Explain BAR fan token", requiresWallet: false },
  { category: "Fan Tokens", title: "Juventus Token Info", description: "Deep dive into Juventus fan token ecosystem", prompt: "What is JUV fan token?", requiresWallet: false },
  { category: "Fan Tokens", title: "AC Milan Token Guide", description: "Comprehensive AC Milan fan token analysis", prompt: "Tell me about ACM fan token", requiresWallet: false },
  { category: "Fan Tokens", title: "AS Roma Token Stats", description: "AS Roma fan token performance and utility", prompt: "What is ASR fan token?", requiresWallet: false },
  { category: "Fan Tokens", title: "Compare PSG vs BAR", description: "Side-by-side comparison of top fan tokens", prompt: "Compare PSG and BAR fan tokens", requiresWallet: false },
  { category: "Fan Tokens", title: "Compare JUV vs ACM", description: "Italian football fan tokens comparison", prompt: "Compare JUV and ACM fan tokens", requiresWallet: false },
  { category: "Fan Tokens", title: "CHZ Token Overview", description: "Learn about the native Chiliz token", prompt: "What is CHZ token?", requiresWallet: false },
  { category: "Fan Tokens", title: "Fan Token Market Analysis", description: "Overall fan token market trends and insights", prompt: "Analyze the fan token market on Chiliz", requiresWallet: false },
  { category: "Fan Tokens", title: "Top Fan Tokens Ranking", description: "Ranking of most popular fan tokens", prompt: "List top fan tokens on Chiliz Chain", requiresWallet: false },
  { category: "Fan Tokens", title: "Fan Token Use Cases", description: "Practical applications of fan tokens", prompt: "What can I do with fan tokens?", requiresWallet: false },
  { category: "Fan Tokens", title: "Fan Token Staking Options", description: "Staking opportunities for fan tokens", prompt: "How to stake fan tokens on Chiliz?", requiresWallet: false },
  { category: "Fan Tokens", title: "Fan Token Trading Guide", description: "Best practices for trading fan tokens", prompt: "How to trade fan tokens safely?", requiresWallet: false },
  { category: "Fan Tokens", title: "Fan Token Governance", description: "Voting and governance with fan tokens", prompt: "How does fan token governance work?", requiresWallet: false },
  { category: "Fan Tokens", title: "Premier League Tokens", description: "English Premier League fan tokens", prompt: "Show me Premier League fan tokens", requiresWallet: false },
  { category: "Fan Tokens", title: "La Liga Fan Tokens", description: "Spanish La Liga team tokens", prompt: "List La Liga fan tokens", requiresWallet: false },
  { category: "Fan Tokens", title: "Serie A Fan Tokens", description: "Italian Serie A team tokens", prompt: "Show Serie A fan tokens", requiresWallet: false },
  { category: "Fan Tokens", title: "Fan Token Partnerships", description: "Club partnerships and collaborations", prompt: "What partnerships do fan tokens have?", requiresWallet: false },
  { category: "Fan Tokens", title: "Fan Token Rewards", description: "Rewards and benefits for holders", prompt: "What rewards do fan token holders get?", requiresWallet: false },
  { category: "Fan Tokens", title: "Fan Token Price History", description: "Historical price analysis of fan tokens", prompt: "Show PSG fan token price history", requiresWallet: false },

  // Wallet & Balance Features (15 items)
  { category: "Wallet", title: "Check CHZ Balance", description: "View your native CHZ token balance", prompt: "What is my CHZ balance?", requiresWallet: true },
  { category: "Wallet", title: "Check PSG Balance", description: "View your PSG fan token balance", prompt: "What is my PSG token balance?", requiresWallet: true },
  { category: "Wallet", title: "Check All Balances", description: "Complete portfolio overview", prompt: "Show all my token balances", requiresWallet: true },
  { category: "Wallet", title: "Transfer CHZ", description: "Send CHZ to another address", prompt: "execute transfer 10 CHZ to 0x67f6d0F49F43a48D5f5A75205AF95c72b5186d9f", requiresWallet: true },
  { category: "Wallet", title: "Transfer PSG Tokens", description: "Send PSG tokens to friends", prompt: "execute transfer 5 PSG to 0x67f6d0F49F43a48D5f5A75205AF95c72b5186d9f", requiresWallet: true },
  { category: "Wallet", title: "Wallet Transaction History", description: "View your transaction history", prompt: "Show my recent transactions", requiresWallet: true },
  { category: "Wallet", title: "Portfolio Value", description: "Calculate total portfolio value", prompt: "What is my total portfolio value?", requiresWallet: true },
  { category: "Wallet", title: "Token Distribution", description: "Analyze your token holdings", prompt: "Show my token distribution", requiresWallet: true },
  { category: "Wallet", title: "Wallet Security Check", description: "Security analysis of your wallet", prompt: "Check my wallet security", requiresWallet: true },
  { category: "Wallet", title: "Gas Fee Estimation", description: "Estimate transaction costs", prompt: "What are current gas fees?", requiresWallet: true },
  { category: "Wallet", title: "Wallet Address Info", description: "Information about your wallet address", prompt: "Tell me about my wallet address", requiresWallet: true },
  { category: "Wallet", title: "Connect Multiple Wallets", description: "Guide for managing multiple wallets", prompt: "How to connect multiple wallets?", requiresWallet: false },
  { category: "Wallet", title: "Wallet Recovery Guide", description: "Steps to recover your wallet", prompt: "How to recover my wallet?", requiresWallet: false },
  { category: "Wallet", title: "Hardware Wallet Setup", description: "Using hardware wallets with Chiliz", prompt: "How to use hardware wallet with Chiliz?", requiresWallet: false },
  { category: "Wallet", title: "Mobile Wallet Guide", description: "Best mobile wallets for Chiliz", prompt: "Best mobile wallets for Chiliz Chain", requiresWallet: false },

  // Smart Contract Analysis (20 items)
  { category: "Contracts", title: "Analyze PSG Contract", description: "Deep dive into PSG token contract", prompt: "Analyze contract 0x54625fab2bee8b8e3fd0a2cd3c1fb1b7e85b3e7", requiresWallet: false },
  { category: "Contracts", title: "Contract Security Audit", description: "Security analysis of any contract", prompt: "Security audit of contract 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Source Code", description: "View and analyze contract source code", prompt: "Show source code for contract 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Functions", description: "List all contract functions", prompt: "What functions does this contract have 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Events", description: "Analyze contract events and logs", prompt: "Show events for contract 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Interactions", description: "View recent contract interactions", prompt: "Recent interactions with contract 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Gas Usage", description: "Analyze gas consumption patterns", prompt: "Gas usage analysis for contract 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "NFT Contract Analysis", description: "Analyze NFT smart contracts", prompt: "Analyze NFT contract 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "DeFi Contract Review", description: "Review DeFi protocol contracts", prompt: "Review DeFi contract 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Upgrade Analysis", description: "Check if contract is upgradeable", prompt: "Is contract 0x1234567890abcdef1234567890abcdef12345678 upgradeable?", requiresWallet: false },
  { category: "Contracts", title: "Contract Owner Analysis", description: "Identify contract ownership", prompt: "Who owns contract 0x1234567890abcdef1234567890abcdef12345678?", requiresWallet: false },
  { category: "Contracts", title: "Contract Vulnerabilities", description: "Scan for common vulnerabilities", prompt: "Scan for vulnerabilities in 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Documentation", description: "Generate contract documentation", prompt: "Generate documentation for 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Deployment Info", description: "Contract deployment details", prompt: "When was contract 0x1234567890abcdef1234567890abcdef12345678 deployed?", requiresWallet: false },
  { category: "Contracts", title: "Contract Token Standards", description: "Identify token standards used", prompt: "What token standard does 0x1234567890abcdef1234567890abcdef12345678 use?", requiresWallet: false },
  { category: "Contracts", title: "Contract ABI Analysis", description: "Analyze contract ABI structure", prompt: "Analyze ABI for contract 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Multi-sig Contract Check", description: "Check if contract is multi-signature", prompt: "Is 0x1234567890abcdef1234567890abcdef12345678 a multi-sig contract?", requiresWallet: false },
  { category: "Contracts", title: "Contract State Variables", description: "View contract state variables", prompt: "Show state variables for 0x1234567890abcdef1234567890abcdef12345678", requiresWallet: false },
  { category: "Contracts", title: "Contract Modifiers", description: "Analyze contract modifiers", prompt: "What modifiers does 0x1234567890abcdef1234567890abcdef12345678 use?", requiresWallet: false },
  { category: "Contracts", title: "Contract Dependencies", description: "Analyze contract dependencies", prompt: "What libraries does 0x1234567890abcdef1234567890abcdef12345678 import?", requiresWallet: false },

  // Blockchain Explorer (15 items)
  { category: "Explorer", title: "Latest Blocks", description: "View recent blocks on Chiliz Chain", prompt: "Show latest blocks on Chiliz Chain", requiresWallet: false },
  { category: "Explorer", title: "Transaction Details", description: "Analyze specific transaction", prompt: "Analyze transaction 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab", requiresWallet: false },
  { category: "Explorer", title: "Address Analysis", description: "Deep dive into any address", prompt: "Analyze address 0x67f6d0F49F43a48D5f5A75205AF95c72b5186d9f", requiresWallet: false },
  { category: "Explorer", title: "Network Statistics", description: "Chiliz Chain network stats", prompt: "Show Chiliz Chain network statistics", requiresWallet: false },
  { category: "Explorer", title: "Top Token Holders", description: "Find top holders of any token", prompt: "Who are the top PSG token holders?", requiresWallet: false },
  { category: "Explorer", title: "Block Analysis", description: "Analyze specific block", prompt: "Analyze block 1234567", requiresWallet: false },
  { category: "Explorer", title: "Validator Information", description: "Information about Chiliz validators", prompt: "Show Chiliz Chain validators", requiresWallet: false },
  { category: "Explorer", title: "Transaction Volume", description: "Daily transaction volume analysis", prompt: "What is daily transaction volume on Chiliz?", requiresWallet: false },
  { category: "Explorer", title: "Address Activity", description: "Track address activity patterns", prompt: "Show activity for address 0x67f6d0F49F43a48D5f5A75205AF95c72b5186d9f", requiresWallet: false },
  { category: "Explorer", title: "Token Transfer Analysis", description: "Analyze token transfer patterns", prompt: "Show PSG token transfers in last 24 hours", requiresWallet: false },
  { category: "Explorer", title: "Smart Contract Creation", description: "Recent smart contract deployments", prompt: "Show recent smart contract deployments", requiresWallet: false },
  { category: "Explorer", title: "Large Transactions", description: "Find large value transactions", prompt: "Show largest transactions today", requiresWallet: false },
  { category: "Explorer", title: "Failed Transactions", description: "Analyze failed transactions", prompt: "Why do transactions fail on Chiliz?", requiresWallet: false },
  { category: "Explorer", title: "Gas Price Trends", description: "Gas price analysis and trends", prompt: "Show gas price trends on Chiliz", requiresWallet: false },
  { category: "Explorer", title: "Network Congestion", description: "Network congestion analysis", prompt: "Is Chiliz Chain congested right now?", requiresWallet: false },

  // DeFi & Trading (10 items)
  { category: "DeFi", title: "DEX Analysis", description: "Analyze decentralized exchanges", prompt: "What DEXs are available on Chiliz?", requiresWallet: false },
  { category: "DeFi", title: "Liquidity Pools", description: "Find liquidity pools for tokens", prompt: "Show PSG liquidity pools", requiresWallet: false },
  { category: "DeFi", title: "Yield Farming", description: "Yield farming opportunities", prompt: "What yield farming options exist on Chiliz?", requiresWallet: false },
  { category: "DeFi", title: "Token Swaps", description: "Guide for token swapping", prompt: "How to swap CHZ for PSG tokens?", requiresWallet: false },
  { category: "DeFi", title: "Price Impact Analysis", description: "Calculate price impact for trades", prompt: "What is price impact for swapping 1000 CHZ to PSG?", requiresWallet: false },
  { category: "DeFi", title: "Arbitrage Opportunities", description: "Find arbitrage opportunities", prompt: "Are there arbitrage opportunities on Chiliz?", requiresWallet: false },
  { category: "DeFi", title: "Lending Protocols", description: "Lending and borrowing on Chiliz", prompt: "What lending protocols exist on Chiliz?", requiresWallet: false },
  { category: "DeFi", title: "Cross-chain Bridges", description: "Bridge tokens to/from Chiliz", prompt: "How to bridge tokens to Chiliz Chain?", requiresWallet: false },
  { category: "DeFi", title: "Impermanent Loss", description: "Calculate impermanent loss", prompt: "Calculate impermanent loss for PSG/CHZ pool", requiresWallet: false },
  { category: "DeFi", title: "DeFi Security", description: "DeFi security best practices", prompt: "How to stay safe in Chiliz DeFi?", requiresWallet: false },

  // Educational & Guide (15 items)
  { category: "Education", title: "Chiliz Chain Basics", description: "Introduction to Chiliz blockchain", prompt: "What is Chiliz Chain?", requiresWallet: false },
  { category: "Education", title: "Fan Token Explained", description: "Complete guide to fan tokens", prompt: "How do fan tokens work?", requiresWallet: false },
  { category: "Education", title: "Blockchain Fundamentals", description: "Basic blockchain concepts", prompt: "Explain blockchain technology simply", requiresWallet: false },
  { category: "Education", title: "Sports & Crypto", description: "Intersection of sports and crypto", prompt: "How does crypto relate to sports?", requiresWallet: false },
  { category: "Education", title: "NFT Guide", description: "Understanding NFTs on Chiliz", prompt: "What are NFTs and how do they work?", requiresWallet: false },
  { category: "Education", title: "Tokenomics Explained", description: "Understanding token economics", prompt: "What is tokenomics?", requiresWallet: false },
  { category: "Education", title: "Consensus Mechanisms", description: "How blockchain consensus works", prompt: "What consensus mechanism does Chiliz use?", requiresWallet: false },
  { category: "Education", title: "Web3 Introduction", description: "Introduction to Web3 concepts", prompt: "What is Web3?", requiresWallet: false },
  { category: "Education", title: "Crypto Trading Basics", description: "Basic cryptocurrency trading", prompt: "How to start trading cryptocurrencies?", requiresWallet: false },
  { category: "Education", title: "Wallet Security", description: "Keeping your wallet secure", prompt: "How to secure my crypto wallet?", requiresWallet: false },
  { category: "Education", title: "Private Keys Explained", description: "Understanding private keys", prompt: "What are private keys and why are they important?", requiresWallet: false },
  { category: "Education", title: "Gas Fees Explained", description: "Understanding transaction fees", prompt: "What are gas fees and how do they work?", requiresWallet: false },
  { category: "Education", title: "Smart Contracts 101", description: "Introduction to smart contracts", prompt: "What are smart contracts?", requiresWallet: false },
  { category: "Education", title: "DAO Governance", description: "Decentralized governance explained", prompt: "What is a DAO and how does governance work?", requiresWallet: false },
  { category: "Education", title: "Staking Explained", description: "Understanding staking mechanisms", prompt: "What is staking and how does it work?", requiresWallet: false },

  // Technical Analysis (5 items)
  { category: "Technical", title: "API Documentation", description: "Chiliz Chain API reference", prompt: "Show me Chiliz Chain API documentation", requiresWallet: false },
  { category: "Technical", title: "Developer Resources", description: "Resources for developers", prompt: "What resources are available for Chiliz developers?", requiresWallet: false },
  { category: "Technical", title: "SDK Integration", description: "Integrating with Chiliz SDKs", prompt: "How to integrate Chiliz SDK?", requiresWallet: false },
  { category: "Technical", title: "Testnet Guide", description: "Using Chiliz testnet", prompt: "How to use Chiliz testnet?", requiresWallet: false },
  { category: "Technical", title: "Smart Contract Development", description: "Developing on Chiliz Chain", prompt: "How to develop smart contracts on Chiliz?", requiresWallet: false }
];

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChain, setSelectedChain] = useState('88888');
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const thingsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to 100 things section
  const scrollToThings = useCallback(() => {
    if (thingsRef.current) {
      thingsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, []);

  const handleSearch = useCallback((searchInput: string, chain: string) => {
    const finalChain = chain || '88888';
    if (!searchInput.trim()) {
      alert('Please enter a contract address or search term');
      return;
    }

    const trimmedInput = searchInput.trim();
    const isContractAddress = /^0x[a-fA-F0-9]{40}$/.test(trimmedInput);

    try {
      if (isContractAddress) {
        console.log('Navigating to explorer with contract address:', { address: trimmedInput, chain: finalChain });
        router.push(
          `/explorer?chainId=${finalChain}&searchTerm=${encodeURIComponent(trimmedInput)}`
        );
      } else {
        const normalizedInput = trimmedInput.trim();
        const isTokenSymbol = /^[A-Za-z]+$/.test(normalizedInput);

        if (isTokenSymbol) {
          const tokenQuery = `Search for ${normalizedInput} token on Chiliz Chain using ChilizScan. If found, provide: 1) Contract address 2) Token symbol 3) Total supply 4) Decimals 5) Current holders. If not found on Chiliz, check spelling and suggest alternatives.`;
          console.log('Navigating to explorer with token query:', { query: tokenQuery, chain: finalChain });
          router.push(
            `/explorer?chainId=${finalChain}&query=${encodeURIComponent(tokenQuery)}&searchType=token&symbol=${encodeURIComponent(normalizedInput)}`
          );
        } else {
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
    <>
      {/* MAIN HERO SECTION - EXACTLY AS BEFORE */}
      <div className="relative overflow-hidden pt-20 h-screen">
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

        {/* Spline Scene */}
        {!splineError && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          >
            <Spline 
              scene="https://prod.spline.design/lX0ekK8OK9dc4DlA/scene.splinecode"
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
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chiliz-primary/20 to-red-600/20 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-2 md:gap-3 justify-center">
              <span className="font-semibold text-sm md:text-lg text-white transition-colors text-center leading-tight whitespace-nowrap">
                <span className="hidden sm:inline">AI Meets Chiliz: </span>C-TRACE is Live
              </span>
              <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-pulse flex-shrink-0"></div>
            </div>
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3" style={{ zIndex: 999 }}>
          <button
            onClick={scrollToThings}
            className="group flex flex-col items-center gap-2 text-white/70 hover:text-chiliz-primary transition-all duration-300"
          >
            <span className="text-sm font-medium">Discover 100 Things</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center group-hover:border-chiliz-primary/60 transition-colors">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce group-hover:bg-chiliz-primary/80"></div>
            </div>
          </button>
        </div>

        {/* Check out docs Button - Fixed Position Left */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => router.push('/docs')}
            className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900/80 border border-white/30 hover:border-chiliz-primary/60 transition-all duration-300 hover:shadow-lg hover:shadow-chiliz-primary/20 rounded-full backdrop-blur-md"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chiliz-primary/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
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
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chiliz-primary/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <span className="relative z-10 whitespace-nowrap group-hover:text-chiliz-primary transition-colors">Got Feedback?</span>
          </a>
        </div>
      </div>

      {/* SEPARATE 100 THINGS SECTION - SAME BACKGROUND AS MAIN */}
      <div ref={thingsRef} className="relative min-h-screen py-20 px-4 overflow-hidden">
        {/* Same Silk Background as main hero */}
        <div className="absolute inset-0" style={{ zIndex: -10 }}>
          <Silk
            speed={2}
            scale={1.8}
            color="#4a4a7e"
            noiseIntensity={1.2}
            rotation={0}
          />
        </div>

        {/* Same fallback background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black/40 to-gray-900/20" style={{ zIndex: -5 }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header without parallax */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              100 Things You Can Do
              <span className="block text-chiliz-primary">with C-TRACE</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Discover the endless possibilities of AI-powered blockchain exploration on Chiliz Chain.
              From fan token analysis to smart contract security audits, C-TRACE makes blockchain accessible to everyone.
            </p>
          </div>

          {/* Cards Grid without parallax */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {hundredThings.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-chiliz-primary/30"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {item.requiresWallet ? (
                        <div className="w-6 h-6 bg-chiliz-primary/20 rounded-full flex items-center justify-center border border-chiliz-primary/40">
                          <div className="w-2 h-2 bg-chiliz-primary rounded-full"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/40">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-chiliz-primary/80 text-xs font-mono">#{(index + 1).toString().padStart(3, '0')}</span>
                        <span className="text-xs text-white/60">{item.category}</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-white/70 text-xs leading-relaxed mb-3">
                        {item.description}
                      </p>
                      <div className="bg-black/20 rounded-lg p-2 mb-3">
                        <code className="text-chiliz-primary text-xs font-mono break-all">
                          "{item.prompt}"
                        </code>
                      </div>
                      <button
                        onClick={() => {
                          // Navigate to explorer with the prompt pre-filled in the input
                          const searchParams = new URLSearchParams({
                            chainId: '88888',
                            prefill: item.prompt
                          });
                          router.push(`/explorer?${searchParams.toString()}`);
                        }}
                        className="w-full bg-chiliz-primary/10 hover:bg-chiliz-primary/20 border border-chiliz-primary/30 text-chiliz-primary text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105"
                      >
                        Try Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Legend without parallax */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white/80 text-sm">Works without wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chiliz-primary rounded-full"></div>
                  <span className="text-white/80 text-sm">Requires wallet connection</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 text-center">
            <div className="space-y-1">
              <p className="text-red-500 font-semibold">#BuiltOnChiliz</p>
              <span className="text-white/40 text-sm">&copy; {new Date().getFullYear()} c-trace | Crafted with ❤️ by ch04niverse</span>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}