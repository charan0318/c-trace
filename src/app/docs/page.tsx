
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, ExternalLink, MessageSquare, Search, Zap, Globe, Shield, Rocket, Heart, Wallet, ArrowRightLeft, Trophy, Users, CreditCard } from 'lucide-react';
import Navigation from '../components/Navigation';
import Silk from '../components/ui/Silk';

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sections = [
    {
      id: 'welcome',
      title: 'Welcome to C-TRACE',
      icon: <Heart className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Rocket className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'fan-tokens',
      title: 'Fan Token Guide',
      icon: <Trophy className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'wallet-features',
      title: 'Wallet & Transactions',
      icon: <Wallet className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'ai-superpowers',
      title: 'AI Superpowers',
      icon: <Zap className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'understanding-output',
      title: 'Understanding Results',
      icon: <Search className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      icon: <Globe className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <Shield className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'tips-tricks',
      title: 'Tips & Tricks',
      icon: <Users className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'whats-next',
      title: "What's Coming Next",
      icon: <ExternalLink className="w-4 h-4" />,
      subsections: []
    }
  ];

  const ExamplePrompt = ({ prompt, description }: { prompt: string; description: string }) => (
    <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <code className="text-chiliz-primary text-sm font-mono">{prompt}</code>
          <p className="text-white/70 text-sm mt-2">{description}</p>
        </div>
        <button
          onClick={() => copyToClipboard(prompt)}
          className="ml-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Copy className="w-4 h-4 text-white/70" />
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'welcome':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to C-TRACE</h1>
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                C-TRACE is the ultimate AI-powered blockchain explorer for the Chiliz ecosystem. 
                We make complex blockchain data accessible through natural language queries, intelligent insights, and seamless wallet integration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-chiliz-primary mb-3">🏟️ Sports Blockchain Explorer</h3>
                <p className="text-white/80 leading-relaxed">
                  C-TRACE specializes in the Chiliz Chain, home to fan tokens from major sports teams worldwide. 
                  Explore FC Barcelona, PSG, Juventus, and dozens of other team tokens with AI-powered insights.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-chiliz-primary mb-3">🤖 AI-First Approach</h3>
                <p className="text-white/80 leading-relaxed">
                  Ask questions in plain English and get intelligent responses about contracts, transactions, fan tokens, and blockchain data. 
                  No technical knowledge required!
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-chiliz-primary/10 to-transparent p-6 rounded-2xl border border-chiliz-primary/20">
              <h3 className="text-xl font-bold text-white mb-3">🚀 What Makes C-TRACE Special</h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Sports-Focused:</strong> Deep understanding of fan tokens, sports teams, and engagement mechanics</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Wallet Integration:</strong> Connect your wallet, check balances, and execute transactions directly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Real-Time Data:</strong> Live blockchain data from Chiliz Chain with intelligent analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>3D Interface:</strong> Beautiful, immersive UI with interactive 3D backgrounds</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">🎯 Perfect For</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-chiliz-primary mb-2">Sports Fans</h4>
                  <p className="text-white/70 text-sm">Explore your favorite team's fan tokens, voting power, and community activities</p>
                </div>
                <div>
                  <h4 className="font-semibold text-chiliz-primary mb-2">Crypto Enthusiasts</h4>
                  <p className="text-white/70 text-sm">Analyze smart contracts, track transactions, and discover new fan token opportunities</p>
                </div>
                <div>
                  <h4 className="font-semibold text-chiliz-primary mb-2">Developers</h4>
                  <p className="text-white/70 text-sm">Quick contract analysis, security insights, and blockchain development assistance</p>
                </div>
                <div>
                  <h4 className="font-semibold text-chiliz-primary mb-2">Newcomers</h4>
                  <p className="text-white/70 text-sm">Learn about blockchain and fan tokens through easy-to-understand AI explanations</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'getting-started':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Getting Started with C-TRACE</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Learn how to use C-TRACE effectively to explore the Chiliz blockchain and fan tokens.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔍 Using the Search Interface</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    C-TRACE's intelligent search understands multiple input types and automatically detects what you're looking for:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">📝 Contract Addresses</h4>
                      <p className="text-white/70 text-sm">Enter any 0x address for instant analysis</p>
                      <code className="text-chiliz-primary text-xs">0x1234...abcd</code>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">💬 Natural Questions</h4>
                      <p className="text-white/70 text-sm">Ask anything in plain English</p>
                      <code className="text-chiliz-primary text-xs">"What is PSG fan token?"</code>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">🏆 Team Names</h4>
                      <p className="text-white/70 text-sm">Search for any sports team or token</p>
                      <code className="text-chiliz-primary text-xs">Barcelona, PSG, Juventus</code>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">🔗 Transaction Hashes</h4>
                      <p className="text-white/70 text-sm">Analyze specific transactions</p>
                      <code className="text-chiliz-primary text-xs">0xabcd...1234</code>
                    </div>
                  </div>
                  <div className="bg-chiliz-primary/10 p-4 rounded-lg border border-chiliz-primary/20">
                    <p className="text-chiliz-primary font-semibold text-sm">
                      💡 Pro Tip: Start typing and watch the suggestions appear! C-TRACE learns from your searches to provide better results.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">⚡ Quick Start Examples</h2>
                <div className="space-y-4">
                  <ExamplePrompt 
                    prompt="what is my balance"
                    description="Check your CHZ and fan token balances (requires wallet connection)"
                  />
                  <ExamplePrompt 
                    prompt="explain PSG fan token"
                    description="Get detailed information about Paris Saint-Germain's fan token"
                  />
                  <ExamplePrompt 
                    prompt="compare BAR and PSG"
                    description="Side-by-side comparison of Barcelona and PSG fan tokens"
                  />
                  <ExamplePrompt 
                    prompt="0x3506424F91fD33084466F402d5D97f05F8e3b4AF"
                    description="Analyze any smart contract on Chiliz Chain"
                  />
                  <ExamplePrompt 
                    prompt="execute transfer 5 CHZ to 0x..."
                    description="Send CHZ tokens to another address (requires wallet)"
                  />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🎨 Interface Overview</h2>
                <div className="grid gap-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🌟 3D Background</h4>
                    <p className="text-white/70 text-sm">Interactive Spline 3D scenes that respond to your interactions and create an immersive experience</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">💬 AI Chat Interface</h4>
                    <p className="text-white/70 text-sm">Conversational blockchain exploration with memory - ask follow-up questions naturally</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">📊 Smart Suggestions</h4>
                    <p className="text-white/70 text-sm">Context-aware action buttons that appear based on your queries and results</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">💰 Wallet Panel</h4>
                    <p className="text-white/70 text-sm">Connect multiple wallet types and manage your Chiliz Chain assets directly</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'fan-tokens':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">🏆 Fan Token Guide</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Everything you need to know about sports fan tokens on the Chiliz blockchain.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🎯 What Are Fan Tokens?</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    Fan tokens are digital assets that give supporters a voice in their favorite sports teams' decisions. 
                    Built on Chiliz Chain, they enable voting on team polls, exclusive rewards, and unique fan experiences.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-chiliz-primary mb-2">🗳️ Voting Power</h4>
                      <p className="text-white/70 text-sm">Influence team decisions like jersey designs, celebration songs, and more</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-chiliz-primary mb-2">🎁 Exclusive Rewards</h4>
                      <p className="text-white/70 text-sm">Access VIP experiences, merchandise discounts, and special events</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-chiliz-primary mb-2">💎 Digital Collectibles</h4>
                      <p className="text-white/70 text-sm">Unique NFTs, badges, and memorabilia for passionate fans</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">⚽ Popular Fan Tokens</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-900/40 to-red-900/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">🔵 FC Barcelona ($BAR)</h4>
                    <p className="text-white/70 mb-3">One of the most popular fan tokens, giving Barça fans voting rights and exclusive access to club experiences.</p>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="explain BAR fan token"
                        description="Get comprehensive Barcelona fan token analysis"
                      />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/40 to-red-900/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">🔴 Paris Saint-Germain ($PSG)</h4>
                    <p className="text-white/70 mb-3">PSG's fan token offers voting on various club decisions and access to exclusive Parisian experiences.</p>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="explain PSG fan token"
                        description="Discover PSG fan token benefits and features"
                      />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">⚪ Juventus ($JUV)</h4>
                    <p className="text-white/70 mb-3">The Old Lady's token provides Juve fans with voting power and exclusive merchandise opportunities.</p>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="explain JUV fan token"
                        description="Learn about Juventus fan token utility"
                      />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-900/40 to-yellow-900/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">🔴 AS Roma ($ASR)</h4>
                    <p className="text-white/70 mb-3">Roma's fan token connects the passionate Giallorossi fanbase with their beloved club.</p>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="explain ASR fan token"
                        description="Explore AS Roma fan token features"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔍 How to Research Fan Tokens</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">📈 Token Performance</h4>
                    <p className="text-white/70 text-sm mb-2">Analyze price trends, trading volume, and market sentiment</p>
                    <ExamplePrompt 
                      prompt="show BAR token price history"
                      description="Get detailed price and volume analysis"
                    />
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🏆 Team Comparison</h4>
                    <p className="text-white/70 text-sm mb-2">Compare different fan tokens side by side</p>
                    <ExamplePrompt 
                      prompt="compare PSG and BAR tokens"
                      description="Side-by-side analysis of top fan tokens"
                    />
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">👥 Community Insights</h4>
                    <p className="text-white/70 text-sm mb-2">Understand holder distribution and community engagement</p>
                    <ExamplePrompt 
                      prompt="analyze PSG token holders"
                      description="Get insights into token distribution and community"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">💡 Fan Token Tips</h2>
                <div className="bg-gradient-to-r from-chiliz-primary/10 to-transparent p-6 rounded-2xl border border-chiliz-primary/20">
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Use "fan token" suffix:</strong> Add "fan token" after team names for better results (e.g., "PSG fan token")</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Check utility:</strong> Ask about voting rights, rewards, and exclusive benefits for each token</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Monitor activity:</strong> Track recent polls, events, and community engagement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Compare options:</strong> Use comparison queries to evaluate different fan tokens</span>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        );

      case 'wallet-features':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">💰 Wallet & Transaction Features</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Connect your wallet and manage your Chiliz Chain assets directly through C-TRACE.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔗 Wallet Connection</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    C-TRACE supports multiple wallet types for seamless access to your Chiliz Chain assets:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-white mb-3">🦊 Browser Wallets</h4>
                      <ul className="space-y-2 text-white/70 text-sm">
                        <li>• MetaMask (Recommended)</li>
                        <li>• Coinbase Wallet</li>
                        <li>• Rainbow Wallet</li>
                        <li>• Rabby Wallet</li>
                        <li>• Trust Wallet</li>
                        <li>• Phantom Wallet</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-3">📱 In-App Wallets</h4>
                      <ul className="space-y-2 text-white/70 text-sm">
                        <li>• Email Authentication</li>
                        <li>• Google Sign-in</li>
                        <li>• Apple ID</li>
                        <li>• Facebook Login</li>
                        <li>• Phone Authentication</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 bg-chiliz-primary/10 p-4 rounded-lg border border-chiliz-primary/20">
                    <p className="text-chiliz-primary font-semibold text-sm">
                      🔧 Network Setup: Make sure you're connected to Chiliz Chain (Chain ID: 88888) for full functionality.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">💳 Balance Checking</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">📊 Your Assets</h4>
                    <p className="text-white/70 text-sm mb-3">Check all your Chiliz Chain holdings in one command</p>
                    <ExamplePrompt 
                      prompt="what is my balance"
                      description="View your CHZ, fan tokens, and NFTs"
                    />
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🔍 Address Lookup</h4>
                    <p className="text-white/70 text-sm mb-3">Check any wallet's holdings on Chiliz Chain</p>
                    <ExamplePrompt 
                      prompt="check balance of 0x1234...abcd"
                      description="Analyze any address's token holdings"
                    />
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🏆 Fan Token Holdings</h4>
                    <p className="text-white/70 text-sm mb-3">Get detailed breakdown of your fan token portfolio</p>
                    <ExamplePrompt 
                      prompt="show my fan token portfolio"
                      description="Detailed analysis of your fan token investments"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">⚡ Transaction Execution</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    Execute transactions directly through C-TRACE with natural language commands:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">💸 CHZ Transfers</h4>
                      <p className="text-white/70 text-sm mb-2">Send native CHZ tokens to any address</p>
                      <ExamplePrompt 
                        prompt="execute transfer 10 CHZ to 0x67f6d0F49F43a48D5f5A75205AF95c72b5186d9f"
                        description="Transfer CHZ with wallet confirmation"
                      />
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">🎫 Fan Token Transfers</h4>
                      <p className="text-white/70 text-sm mb-2">Send fan tokens between wallets</p>
                      <ExamplePrompt 
                        prompt="execute transfer 5 PSG to 0x1234..."
                        description="Transfer fan tokens safely"
                      />
                    </div>
                  </div>
                  <div className="mt-4 bg-yellow-600/10 p-4 rounded-lg border border-yellow-600/20">
                    <p className="text-yellow-400 font-semibold text-sm">
                      ⚠️ Security: Always verify transaction details in your wallet before confirming. C-TRACE provides the transaction data, but you control the final approval.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔧 Network Configuration</h2>
                <div className="bg-gray-900/60 border border-white/10 rounded-lg p-6">
                  <h4 className="font-bold text-white mb-3">Chiliz Chain Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Chain ID:</span>
                      <code className="text-chiliz-primary">88888</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Network Name:</span>
                      <code className="text-chiliz-primary">Chiliz Chain</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">RPC URL:</span>
                      <code className="text-chiliz-primary">https://rpc.ankr.com/chiliz</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Currency:</span>
                      <code className="text-chiliz-primary">CHZ</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Explorer:</span>
                      <code className="text-chiliz-primary">https://scan.chiliz.com</code>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'ai-superpowers':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">🤖 AI Superpowers</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Discover the advanced AI capabilities that make C-TRACE the smartest blockchain explorer.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🧠 Natural Language Processing</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    C-TRACE understands context, intent, and relationships in your queries. Ask complex questions naturally:
                  </p>
                  <div className="grid gap-4">
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">🔗 Context Awareness</h4>
                      <p className="text-white/70 text-sm mb-2">Follow-up questions remember previous conversations</p>
                      <ExamplePrompt 
                        prompt="What's the price of PSG fan token? → How does it compare to Barcelona?"
                        description="AI remembers PSG context for comparison"
                      />
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">🎯 Intent Recognition</h4>
                      <p className="text-white/70 text-sm mb-2">Understanding what you want to accomplish</p>
                      <ExamplePrompt 
                        prompt="I want to buy some fan tokens for my favorite team"
                        description="AI guides you through the process step by step"
                      />
                    </div>
                    <div className="bg-black/40 p-4 rounded-lg">
                      <h4 className="font-bold text-white mb-2">🔍 Smart Detection</h4>
                      <p className="text-white/70 text-sm mb-2">Automatically identifies addresses, tokens, and commands</p>
                      <ExamplePrompt 
                        prompt="0x3506424F91fD33084466F402d5D97f05F8e3b4AF security analysis"
                        description="Detects contract address and performs security audit"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">⚡ Smart Suggestions</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">📊 Analysis Prompts</h4>
                    <p className="text-white/70 text-sm mb-3">AI suggests relevant follow-up analyses based on your queries</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      <button className="bg-chiliz-primary/20 text-chiliz-primary px-3 py-2 rounded text-sm">Security Analysis</button>
                      <button className="bg-chiliz-primary/20 text-chiliz-primary px-3 py-2 rounded text-sm">Token Comparison</button>
                      <button className="bg-chiliz-primary/20 text-chiliz-primary px-3 py-2 rounded text-sm">Price History</button>
                      <button className="bg-chiliz-primary/20 text-chiliz-primary px-3 py-2 rounded text-sm">Community Stats</button>
                    </div>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🎯 Action Buttons</h4>
                    <p className="text-white/70 text-sm mb-3">Context-aware buttons appear based on your search results</p>
                    <div className="flex flex-wrap gap-2">
                      <button className="bg-green-600/20 text-green-400 px-3 py-2 rounded text-sm">Check Balance</button>
                      <button className="bg-blue-600/20 text-blue-400 px-3 py-2 rounded text-sm">View on Explorer</button>
                      <button className="bg-purple-600/20 text-purple-400 px-3 py-2 rounded text-sm">Compare Tokens</button>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔒 Security Analysis</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    AI-powered security insights help you make informed decisions about smart contracts and tokens:
                  </p>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Contract Verification:</strong> Automatic verification of contract source code and legitimacy</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Risk Assessment:</strong> AI evaluates potential security risks and vulnerabilities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Scam Detection:</strong> Identifies suspicious patterns and potential scam contracts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Best Practices:</strong> Recommendations for safer interactions</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">💡 Tips for Better AI Interactions</h2>
                <div className="space-y-4">
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-bold text-green-400 mb-2">✅ Do This</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Be specific: "Analyze PSG token security" vs "analyze this"</li>
                      <li>• Ask follow-ups: "What about the trading volume?"</li>
                      <li>• Use team names: "Barcelona fan token" works better than just "BAR"</li>
                      <li>• Request comparisons: "Compare PSG and Juventus tokens"</li>
                    </ul>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2">❌ Avoid This</h4>
                    <ul className="space-y-1 text-white/80 text-sm">
                      <li>• Vague questions: "tell me about this"</li>
                      <li>• Multiple unrelated topics in one query</li>
                      <li>• Expecting real-time price data (use "approximate" or "recent")</li>
                      <li>• Asking for investment advice (we provide data, not financial advice)</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'understanding-output':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">📊 Understanding Results & Output</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Learn how to interpret C-TRACE's AI-generated insights and blockchain data visualizations.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔍 Contract Analysis Results</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-3">What You'll See in Contract Reports:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-black/40 p-3 rounded-lg">
                        <h5 className="font-semibold text-chiliz-primary text-sm">Contract Type</h5>
                        <p className="text-white/70 text-xs">ERC-20 (tokens), ERC-721 (NFTs), or custom contracts</p>
                      </div>
                      <div className="bg-black/40 p-3 rounded-lg">
                        <h5 className="font-semibold text-chiliz-primary text-sm">Security Score</h5>
                        <p className="text-white/70 text-xs">AI-generated risk assessment from 1-100</p>
                      </div>
                      <div className="bg-black/40 p-3 rounded-lg">
                        <h5 className="font-semibold text-chiliz-primary text-sm">Functions & Methods</h5>
                        <p className="text-white/70 text-xs">Available contract interactions and their purposes</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-black/40 p-3 rounded-lg">
                        <h5 className="font-semibold text-chiliz-primary text-sm">Token Details</h5>
                        <p className="text-white/70 text-xs">Supply, decimals, symbol, and distribution info</p>
                      </div>
                      <div className="bg-black/40 p-3 rounded-lg">
                        <h5 className="font-semibold text-chiliz-primary text-sm">Recent Activity</h5>
                        <p className="text-white/70 text-xs">Latest transactions and contract interactions</p>
                      </div>
                      <div className="bg-black/40 p-3 rounded-lg">
                        <h5 className="font-semibold text-chiliz-primary text-sm">Recommendations</h5>
                        <p className="text-white/70 text-xs">AI suggestions for safe interactions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">💰 Balance & Portfolio Reports</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">CHZ Holdings</h4>
                    <p className="text-white/70 text-sm mb-2">Your native Chiliz token balance for transaction fees and staking</p>
                    <div className="bg-black/40 p-3 rounded text-sm">
                      <span className="text-green-400">✓ Balance:</span> <span className="text-white">1,234.56 CHZ</span><br/>
                      <span className="text-blue-400">→ USD Value:</span> <span className="text-white">~$123.45</span>
                    </div>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">Fan Token Portfolio</h4>
                    <p className="text-white/70 text-sm mb-2">Your sports team token holdings and their voting power</p>
                    <div className="bg-black/40 p-3 rounded text-sm space-y-1">
                      <div><span className="text-blue-400">PSG:</span> <span className="text-white">50 tokens</span> <span className="text-green-400">(+5.2%)</span></div>
                      <div><span className="text-red-400">BAR:</span> <span className="text-white">25 tokens</span> <span className="text-red-400">(-2.1%)</span></div>
                      <div><span className="text-yellow-400">JUV:</span> <span className="text-white">75 tokens</span> <span className="text-green-400">(+1.8%)</span></div>
                    </div>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">NFT Collection</h4>
                    <p className="text-white/70 text-sm mb-2">Your digital collectibles and sports memorabilia</p>
                    <div className="bg-black/40 p-3 rounded text-sm">
                      <span className="text-purple-400">🏆 Total NFTs:</span> <span className="text-white">12 unique items</span><br/>
                      <span className="text-pink-400">🎨 Collections:</span> <span className="text-white">PSG Stadium, Messi Moments, etc.</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🎯 Fan Token Analysis</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-3">Comprehensive Token Reports Include:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-white">Team Information:</span>
                        <span className="text-white/70"> League, stadium, recent performance, and club history</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-white">Token Utility:</span>
                        <span className="text-white/70"> Voting rights, rewards, exclusive access, and governance features</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-white">Market Data:</span>
                        <span className="text-white/70"> Price trends, trading volume, market cap, and holder statistics</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-white">Recent Activity:</span>
                        <span className="text-white/70"> Latest polls, events, rewards distribution, and community engagement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">⚠️ Reading AI Confidence Levels</h2>
                <div className="space-y-4">
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-bold text-green-400 mb-2">🟢 High Confidence</h4>
                    <p className="text-white/80 text-sm">Direct blockchain data, verified contracts, and well-established facts</p>
                  </div>
                  <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-400 mb-2">🟡 Medium Confidence</h4>
                    <p className="text-white/80 text-sm">Inferred data, market analysis, and trends-based insights</p>
                  </div>
                  <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
                    <h4 className="font-bold text-red-400 mb-2">🔴 Lower Confidence</h4>
                    <p className="text-white/80 text-sm">Predictions, speculative analysis, or data requiring verification</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'advanced-features':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">🚀 Advanced Features</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Discover powerful advanced features that make C-TRACE a professional-grade blockchain tool.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔄 Batch Analysis</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    Analyze multiple contracts, addresses, or tokens simultaneously for comprehensive insights:
                  </p>
                  <div className="space-y-3">
                    <ExamplePrompt 
                      prompt="compare PSG, BAR, and JUV fan tokens"
                      description="Side-by-side analysis of multiple fan tokens"
                    />
                    <ExamplePrompt 
                      prompt="analyze top 5 Chiliz fan tokens"
                      description="Comprehensive overview of leading fan tokens"
                    />
                    <ExamplePrompt 
                      prompt="check balances for 0x123..., 0x456..., 0x789..."
                      description="Batch balance checking for multiple addresses"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">📈 Market Intelligence</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">📊 Price Analysis</h4>
                    <p className="text-white/70 text-sm mb-3">Advanced price trend analysis and market sentiment</p>
                    <ExamplePrompt 
                      prompt="analyze PSG token price trends over the last month"
                      description="Detailed price movement analysis with insights"
                    />
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">👥 Holder Analytics</h4>
                    <p className="text-white/70 text-sm mb-3">Distribution analysis and community insights</p>
                    <ExamplePrompt 
                      prompt="analyze holder distribution for Barcelona fan token"
                      description="Understand token concentration and community size"
                    />
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🔥 Trending Analysis</h4>
                    <p className="text-white/70 text-sm mb-3">Identify emerging trends and popular tokens</p>
                    <ExamplePrompt 
                      prompt="what are the trending fan tokens this week?"
                      description="Discover hot fan tokens and emerging opportunities"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔍 Deep Contract Analysis</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    Professional-grade smart contract analysis with security auditing capabilities:
                  </p>
                  <ul className="space-y-3 text-white/80">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Source Code Analysis:</strong> AI reviews contract source code for security issues</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Function Documentation:</strong> Detailed explanation of all contract methods</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Event Tracking:</strong> Monitor and analyze contract events and logs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Gas Optimization:</strong> Suggestions for more efficient contract interactions</span>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🎨 3D Visualization</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🌟 Interactive Backgrounds</h4>
                    <p className="text-white/70 text-sm">Dynamic 3D scenes powered by Spline that respond to your interactions and create an immersive experience</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">⚡ Performance Optimized</h4>
                    <p className="text-white/70 text-sm">Smooth animations that work on all devices, from mobile phones to high-end desktops</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🎯 Context-Aware</h4>
                    <p className="text-white/70 text-sm">Visual elements change based on your searches and the data being analyzed</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">⚡ Performance Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🚀 Fast Loading</h4>
                    <p className="text-white/70 text-sm">Optimized API calls and caching for lightning-fast responses</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">💾 Session Memory</h4>
                    <p className="text-white/70 text-sm">Conversations persist across page refreshes and browser sessions</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">📱 Mobile Optimized</h4>
                    <p className="text-white/70 text-sm">Full functionality on mobile devices with touch-optimized controls</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🔄 Real-Time Updates</h4>
                    <p className="text-white/70 text-sm">Live data feeds ensure you always have the latest blockchain information</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">🔧 Troubleshooting</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Common issues and solutions to help you get the most out of C-TRACE.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-900/20 to-gray-800/40 p-6 rounded-2xl border border-red-500/20">
                <h3 className="text-xl font-bold text-white mb-4">🚫 Wallet Connection Issues</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Problem: "Wrong Network" Error</h4>
                    <p className="text-white/70 text-sm mb-2">Your wallet shows "Wrong Network" or "Chain ID: Unknown"</p>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-green-400 text-sm font-semibold">Solution:</p>
                      <ul className="text-white/80 text-sm mt-1 space-y-1">
                        <li>• Open your wallet settings</li>
                        <li>• Add Chiliz Chain manually with Chain ID: 88888</li>
                        <li>• RPC URL: https://rpc.ankr.com/chiliz</li>
                        <li>• Currency Symbol: CHZ</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Problem: Wallet Not Detected</h4>
                    <p className="text-white/70 text-sm mb-2">C-TRACE can't find your wallet extension</p>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-green-400 text-sm font-semibold">Solution:</p>
                      <ul className="text-white/80 text-sm mt-1 space-y-1">
                        <li>• Install MetaMask or another supported wallet</li>
                        <li>• Refresh the page after installation</li>
                        <li>• Make sure wallet extension is enabled</li>
                        <li>• Try using In-App Wallet option</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/20 to-gray-800/40 p-6 rounded-2xl border border-yellow-500/20">
                <h3 className="text-xl font-bold text-white mb-4">⚠️ Transaction Problems</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Problem: Transaction Not Appearing in Wallet</h4>
                    <p className="text-white/70 text-sm mb-2">You see "ready to execute" but no wallet popup</p>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-yellow-400 text-sm font-semibold">Solution:</p>
                      <ul className="text-white/80 text-sm mt-1 space-y-1">
                        <li>• Check if popups are blocked in your browser</li>
                        <li>• Click the wallet icon to manually open the extension</li>
                        <li>• Make sure you're on the correct network (Chiliz Chain)</li>
                        <li>• Try disconnecting and reconnecting your wallet</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Problem: "Insufficient Funds" Error</h4>
                    <p className="text-white/70 text-sm mb-2">Transaction fails due to insufficient CHZ for gas</p>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-yellow-400 text-sm font-semibold">Solution:</p>
                      <ul className="text-white/80 text-sm mt-1 space-y-1">
                        <li>• Ensure you have enough CHZ for gas fees</li>
                        <li>• Typical gas cost is 0.001-0.01 CHZ per transaction</li>
                        <li>• Get CHZ from an exchange like Binance or KuCoin</li>
                        <li>• Bridge from other chains if needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-gray-800/40 p-6 rounded-2xl border border-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-4">🤖 AI Response Issues</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Problem: Blank or Empty Responses</h4>
                    <p className="text-white/70 text-sm mb-2">AI returns empty responses or fails to analyze</p>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-blue-400 text-sm font-semibold">Solution:</p>
                      <ul className="text-white/80 text-sm mt-1 space-y-1">
                        <li>• Verify the contract address format (0x + 40 characters)</li>
                        <li>• Make sure you're querying Chiliz Chain contracts</li>
                        <li>• Try rephrasing your question more specifically</li>
                        <li>• Wait 30 seconds and try again (rate limiting)</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Problem: Slow Response Times</h4>
                    <p className="text-white/70 text-sm mb-2">AI takes too long to respond to queries</p>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-blue-400 text-sm font-semibold">Solution:</p>
                      <ul className="text-white/80 text-sm mt-1 space-y-1">
                        <li>• Check your internet connection</li>
                        <li>• Simplify complex queries into smaller parts</li>
                        <li>• Avoid multiple questions in one prompt</li>
                        <li>• Try during off-peak hours if network is congested</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/20 to-gray-800/40 p-6 rounded-2xl border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4">🎨 Interface & Display Issues</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Problem: 3D Background Not Loading</h4>
                    <p className="text-white/70 text-sm mb-2">Black screen or missing interactive background</p>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-purple-400 text-sm font-semibold">Solution:</p>
                      <ul className="text-white/80 text-sm mt-1 space-y-1">
                        <li>• Enable hardware acceleration in browser settings</li>
                        <li>• Update your graphics drivers</li>
                        <li>• Try a different browser (Chrome recommended)</li>
                        <li>• Disable ad blockers temporarily</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Problem: Mobile Display Issues</h4>
                    <p className="text-white/70 text-sm mb-2">Interface doesn't display correctly on mobile</p>
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-purple-400 text-sm font-semibold">Solution:</p>
                      <ul className="text-white/80 text-sm mt-1 space-y-1">
                        <li>• Rotate device to landscape mode</li>
                        <li>• Zoom out to see full interface</li>
                        <li>• Clear browser cache and reload</li>
                        <li>• Use the latest version of your mobile browser</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-chiliz-primary/10 to-transparent p-6 rounded-2xl border border-chiliz-primary/20">
                <h3 className="text-xl font-bold text-white mb-4">📞 Still Need Help?</h3>
                <p className="text-white/80 mb-4">
                  If you're still experiencing issues after trying these solutions, don't hesitate to reach out:
                </p>
                <div className="space-y-3">
                  <a 
                    href="https://t.me/ch04niverse" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-chiliz-primary hover:bg-chiliz-primary/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Get Support on Telegram
                  </a>
                  <p className="text-white/60 text-sm">
                    Include your wallet address, browser type, and a description of the issue for faster support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tips-tricks':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">💡 Tips & Tricks</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Pro tips to become a C-TRACE power user and maximize your blockchain exploration efficiency.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🏆 Fan Token Mastery</h2>
                <div className="grid gap-4">
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">⚽ Search Like a Pro</h4>
                    <div className="space-y-3">
                      <div className="bg-green-900/20 border-l-4 border-green-500 p-3">
                        <p className="text-white/80 text-sm">✅ <strong>Good:</strong> "explain PSG fan token" or "PSG fan token utility"</p>
                      </div>
                      <div className="bg-red-900/20 border-l-4 border-red-500 p-3">
                        <p className="text-white/80 text-sm">❌ <strong>Avoid:</strong> "PSG" or "what is PSG" (too vague)</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">🔍 Comparison Techniques</h4>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="compare top 3 football fan tokens"
                        description="Get rankings and detailed comparison"
                      />
                      <ExamplePrompt 
                        prompt="PSG vs Barcelona fan token benefits"
                        description="Focus on utility and rewards comparison"
                      />
                      <ExamplePrompt 
                        prompt="which fan token has best voting power?"
                        description="Analysis of governance features across tokens"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🚀 Power User Commands</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">💰 Quick Balance Checks</h4>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="balance"
                        description="Your shortest path to check wallet holdings"
                      />
                      <ExamplePrompt 
                        prompt="my tokens"
                        description="Alternative quick balance command"
                      />
                      <ExamplePrompt 
                        prompt="portfolio summary"
                        description="Comprehensive overview with USD values"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">⚡ Speed Commands</h4>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="analyze [paste address]"
                        description="Instant contract analysis for any address"
                      />
                      <ExamplePrompt 
                        prompt="security [contract address]"
                        description="Quick security assessment"
                      />
                      <ExamplePrompt 
                        prompt="send 10 CHZ to [address]"
                        description="Fast transaction preparation"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🧠 Conversation Strategies</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-4">💬 Chain Your Questions</h4>
                  <p className="text-white/80 mb-4">C-TRACE remembers context, so build on previous questions:</p>
                  <div className="space-y-3">
                    <div className="bg-black/40 p-3 rounded-lg">
                      <p className="text-chiliz-primary text-sm">🔥 Example Conversation Flow:</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p className="text-white/80">1. "Explain Barcelona fan token"</p>
                        <p className="text-white/60">2. "What's the current price?"</p>
                        <p className="text-white/60">3. "How does it compare to Real Madrid?"</p>
                        <p className="text-white/60">4. "What are the voting benefits?"</p>
                        <p className="text-white/60">5. "Show me recent holder activity"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">⚡ Keyboard Shortcuts & UI Tips</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">⌨️ Keyboard Shortcuts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Focus Search:</span>
                        <code className="text-chiliz-primary">Ctrl/Cmd + K</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Clear Chat:</span>
                        <code className="text-chiliz-primary">Ctrl/Cmd + L</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Submit Query:</span>
                        <code className="text-chiliz-primary">Enter</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">New Line:</span>
                        <code className="text-chiliz-primary">Shift + Enter</code>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-3">🖱️ Click Tricks</h4>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>• Right-click addresses to copy instantly</li>
                      <li>• Click suggestion buttons for quick actions</li>
                      <li>• Use copy buttons on code blocks</li>
                      <li>• Double-click to select entire addresses</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🎯 Advanced Query Patterns</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🔍 Multi-Part Queries</h4>
                    <p className="text-white/70 text-sm mb-3">Combine multiple questions for comprehensive analysis</p>
                    <ExamplePrompt 
                      prompt="PSG fan token: price, holders, recent news, voting power"
                      description="Get everything about PSG token in one response"
                    />
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">📊 Data-Specific Requests</h4>
                    <p className="text-white/70 text-sm mb-3">Ask for specific data points you need</p>
                    <ExamplePrompt 
                      prompt="show me exact PSG token supply and holder count"
                      description="Get precise numerical data"
                    />
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">🏆 Trend Analysis</h4>
                    <p className="text-white/70 text-sm mb-3">Understand market movements and patterns</p>
                    <ExamplePrompt 
                      prompt="analyze Chiliz ecosystem growth over last 6 months"
                      description="Comprehensive market trend analysis"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🎓 Become a Chiliz Expert</h2>
                <div className="bg-gradient-to-r from-chiliz-primary/10 to-transparent p-6 rounded-2xl border border-chiliz-primary/20">
                  <p className="text-white/80 mb-4">
                    <strong>Daily Practice:</strong> Spend 10 minutes exploring different fan tokens each day. 
                    Ask about teams you don't know, compare different leagues, and understand the global sports token ecosystem.
                  </p>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Monday:</strong> Explore football/soccer fan tokens (PSG, BAR, JUV)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Tuesday:</strong> Check MMA and UFC tokens</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Wednesday:</strong> Analyze basketball team tokens</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Thursday:</strong> Compare different league tokens</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Friday:</strong> Track new launches and trends</span>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        );

      case 'whats-next':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">🚀 What's Coming Next</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Discover upcoming features and how to stay connected with the C-TRACE community.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🔮 Upcoming Features</h2>
                <div className="grid gap-4">
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-5 h-5 text-chiliz-primary" />
                      <h4 className="font-bold text-white">⛽ Advanced Gas Analytics</h4>
                    </div>
                    <p className="text-white/70 mb-3">Real-time gas price tracking, optimization suggestions, and transaction timing recommendations for Chiliz Chain.</p>
                    <div className="bg-chiliz-primary/10 p-3 rounded-lg">
                      <p className="text-chiliz-primary text-sm">🎯 Coming Soon</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <ArrowRightLeft className="w-5 h-5 text-chiliz-primary" />
                      <h4 className="font-bold text-white">🔄 Multi-Chain Support</h4>
                    </div>
                    <p className="text-white/70 mb-3">Cross-chain analysis for fan tokens on different networks, with bridge recommendations and liquidity insights.</p>
                    <div className="bg-chiliz-primary/10 p-3 rounded-lg">
                      <p className="text-chiliz-primary text-sm">🎯 Coming Soon</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="w-5 h-5 text-chiliz-primary" />
                      <h4 className="font-bold text-white">🏆 Fan Token Leaderboard</h4>
                    </div>
                    <p className="text-white/70 mb-3">Live rankings of fan tokens by performance, engagement, voting activity, and market metrics.</p>
                    <div className="bg-chiliz-primary/10 p-3 rounded-lg">
                      <p className="text-chiliz-primary text-sm">🎯 In Development</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-chiliz-primary" />
                      <h4 className="font-bold text-white">👥 Social Features</h4>
                    </div>
                    <p className="text-white/70 mb-3">Share analyses, create watchlists, follow other users, and get insights on fan tokens.</p>
                    <div className="bg-chiliz-primary/10 p-3 rounded-lg">
                      <p className="text-chiliz-primary text-sm">🎯 In Development</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="w-5 h-5 text-chiliz-primary" />
                      <h4 className="font-bold text-white">🔔 Smart Alerts</h4>
                    </div>
                    <p className="text-white/70 mb-3">Custom notifications for contract events, price changes, voting periods, and team announcements.</p>
                    <div className="bg-chiliz-primary/10 p-3 rounded-lg">
                      <p className="text-chiliz-primary text-sm">🎯 Planned</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="w-5 h-5 text-chiliz-primary" />
                      <h4 className="font-bold text-white">📱 Mobile App</h4>
                    </div>
                    <p className="text-white/70 mb-3">Native iOS and Android apps with push notifications, widget support, and offline analysis capabilities.</p>
                    <div className="bg-chiliz-primary/10 p-3 rounded-lg">
                      <p className="text-chiliz-primary text-sm">🎯 Planned</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">🎯 Development Roadmap</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-4">Our Development Vision</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-semibold">Foundation ✅</p>
                        <p className="text-white/70 text-sm">Core AI explorer, wallet integration, fan token database</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-semibold">Enhancement 🚧</p>
                        <p className="text-white/70 text-sm">Gas analytics, multi-chain support, advanced security features</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-semibold">Social Features 🔮</p>
                        <p className="text-white/70 text-sm">Leaderboards, social sharing, user profiles</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <p className="text-white font-semibold">Mobile Experience 📱</p>
                        <p className="text-white/70 text-sm">Native apps, notifications, offline capabilities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="bg-gradient-to-r from-chiliz-primary/20 to-chiliz-secondary/20 p-8 rounded-2xl border border-chiliz-primary/30 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-white">Built with ❤️ by ch04niverse</span>
                </div>
                <p className="text-white/80 mb-4">
                  C-TRACE is crafted with passion for the Chiliz community and the future of sports blockchain technology.
                </p>
                <p className="text-white/70 text-sm mb-4">
                  Thanks for being part of our journey to make blockchain data accessible to everyone in the sports world.
                </p>
                <div className="flex justify-center gap-4">
                  <a 
                    href="https://t.me/ch04niverse" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-chiliz-primary hover:bg-chiliz-primary/80 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Join Community
                  </a>
                  <a 
                    href="https://c-trace.replit.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Try C-TRACE
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-chiliz-dark">
      {/* Silk Background */}
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
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-black/60 to-gray-900/40" style={{ zIndex: -5 }} />

      <Navigation />

      <div className="flex h-screen pt-16">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-white/20 text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-30 top-16"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`w-64 bg-gray-900/60 backdrop-blur-sm border-r border-white/10 overflow-y-auto fixed md:relative top-16 md:top-0 left-0 h-full z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-4">
            <h2 className="text-lg font-bold text-white mb-4">Documentation</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      if (section.subsections.length > 0) {
                        toggleSection(section.id);
                      }
                      // Close mobile menu if it's open
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-chiliz-primary/20 text-chiliz-primary border border-chiliz-primary/30'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                    </div>
                    {section.subsections.length > 0 && (
                      <div className="text-white/50">
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </button>

                  {section.subsections.length > 0 && expandedSections.includes(section.id) && (
                    <div className="ml-6 mt-2 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => setActiveSection(subsection.id)}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            activeSection === subsection.id
                              ? 'text-chiliz-primary bg-chiliz-primary/10'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto md:ml-0">
          <div className="max-w-4xl mx-auto p-4 md:p-8 pt-16 md:pt-8">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Feedback Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <a 
          href="https://t.me/ch04niverse" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-chiliz-primary hover:bg-chiliz-primary/80 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Give Feedback</span>
        </a>
      </div>
    </div>
  );
};

export default DocsPage;
