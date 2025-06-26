'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, ExternalLink, MessageSquare, Search, Zap, Globe, Shield, Rocket, Heart } from 'lucide-react';
import Navigation from '../components/Navigation';
import Silk from '../components/ui/Silk';

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);

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
      title: 'Welcome',
      icon: <Heart className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Rocket className="w-4 h-4" />,
      subsections: [
        { id: 'search-basics', title: 'Search Basics' },
        { id: 'wallet-connection', title: 'Wallet Connection' },
        { id: 'input-types', title: 'Input Types' }
      ]
    },
    {
      id: 'understanding-output',
      title: 'Understanding Output',
      icon: <Search className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'ai-superpowers',
      title: 'AI Superpowers',
      icon: <Zap className="w-4 h-4" />,
      subsections: []
    },
    {
      id: 'features',
      title: 'Feature Showcase',
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
      id: 'whats-next',
      title: "What's Next",
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
                C-TRACE is an AI-powered blockchain explorer specifically designed for the Chiliz ecosystem. 
                We make complex blockchain data accessible through natural language queries and intelligent insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-chiliz-primary mb-3">What is C-TRACE?</h3>
                <p className="text-white/80 leading-relaxed">
                  C-TRACE bridges the gap between complex blockchain data and user-friendly insights on the Chiliz network. 
                  Ask questions in plain English and get intelligent responses about contracts, transactions, and fan tokens.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-chiliz-primary mb-3">Why Chiliz Chain?</h3>
                <p className="text-white/80 leading-relaxed">
                  Chiliz powers the sports blockchain revolution with fan tokens and sports-related DeFi. 
                  C-TRACE helps you explore this unique ecosystem with AI-powered insights and analysis.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-chiliz-primary/10 to-transparent p-6 rounded-2xl border border-chiliz-primary/20">
              <h3 className="text-xl font-bold text-white mb-3">Different from Traditional Explorers</h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>AI-Powered:</strong> Ask questions in natural language instead of navigating complex interfaces</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Chiliz-Focused:</strong> Specialized for fan tokens and sports blockchain applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong>Context-Aware:</strong> Understands the sports and entertainment context of transactions</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'getting-started':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Getting Started</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Learn how to use C-TRACE effectively with these essential guides.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">How to Use the Search Bar</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-white/80 mb-4">
                    The search bar is your gateway to blockchain insights. You can enter:
                  </p>
                  <ul className="space-y-2 text-white/70 mb-4">
                    <li>• Contract addresses (0x...)</li>
                    <li>• Wallet addresses</li>
                    <li>• Transaction hashes</li>
                    <li>• Natural language questions</li>
                  </ul>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <p className="text-green-400 font-mono text-sm">
                      💡 Tip: Try asking "What does this contract do?" after entering an address
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">Example Prompts</h2>
                <div className="space-y-4">
                  <ExamplePrompt 
                    prompt="0x1234...abcd"
                    description="Analyze any contract address on Chiliz Chain"
                  />
                  <ExamplePrompt 
                    prompt="What does this contract do?"
                    description="Get AI-powered analysis of transaction details"
                  />
                  <ExamplePrompt 
                    prompt="Show me fan token details for FC Barcelona"
                    description="Explore specific fan token information"
                  />
                  <ExamplePrompt 
                    prompt="Check balance of 0x1234...abcd"
                    description="View wallet balances and token holdings"
                  />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">Supported Input Types</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Addresses</h4>
                    <p className="text-white/70 text-sm">Contract and wallet addresses (0x format)</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Transactions</h4>
                    <p className="text-white/70 text-sm">Transaction hashes for detailed analysis</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Questions</h4>
                    <p className="text-white/70 text-sm">Natural language queries about blockchain data</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Token Names</h4>
                    <p className="text-white/70 text-sm">Fan token symbols and names</p>
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
              <h1 className="text-3xl font-bold text-white mb-4">Understanding the Output</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Learn how to interpret C-TRACE's AI-generated insights and data visualizations.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">Contract Analysis Results</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-3">What You'll See:</h4>
                  <ul className="space-y-2 text-white/80">
                    <li>• <strong>Contract Type:</strong> ERC-20, ERC-721, or custom contract identification</li>
                    <li>• <strong>Functions:</strong> Available methods and their purposes</li>
                    <li>• <strong>Events:</strong> Recent activity and transaction logs</li>
                    <li>• <strong>Security:</strong> Basic security analysis and flags</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">Token Balance Interpretation</h2>
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-white mb-2">CHZ Balance</h4>
                      <p className="text-white/70">Native Chiliz token balance for transaction fees</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">Fan Tokens</h4>
                      <p className="text-white/70">Team-specific tokens for fan engagement and voting</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-2">NFTs</h4>
                      <p className="text-white/70">Unique digital collectibles and memorabilia</p>
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
              <h1 className="text-3xl font-bold text-white mb-4">AI Superpowers</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Discover the advanced AI capabilities that make C-TRACE unique in blockchain exploration.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">Supported Prompt Types</h2>
                <div className="grid gap-4">
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">🔍 Analysis Queries</h4>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="Analyze this smart contract's security"
                        description="Get security insights and potential vulnerabilities"
                      />
                      <ExamplePrompt 
                        prompt="What are the recent trends for this fan token?"
                        description="Market analysis and usage patterns"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">💬 Conversational Queries</h4>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="How do I buy this fan token?"
                        description="Step-by-step guidance for token acquisition"
                      />
                      <ExamplePrompt 
                        prompt="What voting rights does this token give me?"
                        description="Understanding governance and utility features"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-3">📊 Data Queries</h4>
                    <div className="space-y-2">
                      <ExamplePrompt 
                        prompt="Show me the transaction history for this address"
                        description="Comprehensive transaction analysis"
                      />
                      <ExamplePrompt 
                        prompt="Compare fan token performance across teams"
                        description="Comparative analysis and insights"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">AI Limitations</h2>
                <div className="bg-gradient-to-r from-yellow-600/10 to-transparent p-6 rounded-2xl border border-yellow-600/20">
                  <ul className="space-y-2 text-white/80">
                    <li>• <strong>Read-Only:</strong> C-TRACE provides analysis but cannot execute transactions</li>
                    <li>• <strong>Real-Time:</strong> Data is current but may have slight delays during high network activity</li>
                    <li>• <strong>Scope:</strong> Focused on Chiliz Chain - other networks require different tools</li>
                    <li>• <strong>Accuracy:</strong> AI insights are analytical - always verify critical information</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">Tips for Better AI Responses</h2>
                <div className="space-y-4">
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">✅ Be Specific</h4>
                    <p className="text-white/70 text-sm">Instead of &quot;analyze this,&quot; try &quot;analyze this contract&apos;s token distribution&quot;</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">✅ Provide Context</h4>
                    <p className="text-white/70 text-sm">Mention if you&apos;re looking for security, functionality, or market insights</p>
                  </div>
                  <div className="bg-gray-900/60 border border-white/10 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">✅ Ask Follow-ups</h4>
                    <p className="text-white/70 text-sm">Continue the conversation to dive deeper into specific aspects</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Feature Showcase</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Explore the powerful features that make C-TRACE the ultimate Chiliz blockchain explorer.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-6 h-6 text-chiliz-primary" />
                  <h3 className="text-xl font-bold text-white">Smart Search</h3>
                </div>
                <p className="text-white/80 mb-4">
                  Our intelligent search understands context and can handle multiple input types simultaneously.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li>• Auto-detection of addresses, hashes, and questions</li>
                  <li>• Fuzzy matching for partial inputs</li>
                  <li>• Search history and suggestions</li>
                  <li>• Multi-chain support (Chiliz-focused)</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-chiliz-primary" />
                  <h3 className="text-xl font-bold text-white">AI Chat Interface</h3>
                </div>
                <p className="text-white/80 mb-4">
                  Conversational blockchain exploration with persistent context and intelligent responses.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li>• Natural language processing</li>
                  <li>• Context-aware follow-up questions</li>
                  <li>• Formatted code and data responses</li>
                  <li>• Session persistence across queries</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-chiliz-primary" />
                  <h3 className="text-xl font-bold text-white">3D Interactive UI</h3>
                </div>
                <p className="text-white/80 mb-4">
                  Immersive 3D backgrounds and animations powered by Spline and Three.js.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li>• Dynamic 3D scenes that respond to interactions</li>
                  <li>• Smooth animations and transitions</li>
                  <li>• Optimized for all devices and screen sizes</li>
                  <li>• Chiliz-themed visual elements</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-chiliz-primary" />
                  <h3 className="text-xl font-bold text-white">Real-Time Blockchain Data</h3>
                </div>
                <p className="text-white/80 mb-4">
                  Live blockchain data integration with Chiliz Chain for up-to-date insights.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li>• Real-time transaction monitoring</li>
                  <li>• Live contract state updates</li>
                  <li>• Current market data integration</li>
                  <li>• Automated data refresh</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-chiliz-primary" />
                  <h3 className="text-xl font-bold text-white">Security Analysis</h3>
                </div>
                <p className="text-white/80 mb-4">
                  AI-powered security insights and vulnerability detection for smart contracts.
                </p>
                <ul className="space-y-2 text-white/70">
                  <li>• Automated security scanning</li>
                  <li>• Common vulnerability detection</li>
                  <li>• Risk assessment scoring</li>
                  <li>• Best practices recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Troubleshooting</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Common issues and solutions to help you get the most out of C-TRACE.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-900/20 to-gray-800/40 p-6 rounded-2xl border border-red-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Blank or Failed AI Responses</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Possible Causes:</h4>
                    <ul className="space-y-1 text-white/70">
                      <li>• Invalid contract address format</li>
                      <li>• Network connectivity issues</li>
                      <li>• Rate limiting or API timeouts</li>
                      <li>• Unsupported chain or contract type</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Solutions:</h4>
                    <ul className="space-y-1 text-white/70">
                      <li>• Verify the address format (0x followed by 40 characters)</li>
                      <li>• Check your internet connection</li>
                      <li>• Wait a moment and try again</li>
                      <li>• Try a different query or contract</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/20 to-gray-800/40 p-6 rounded-2xl border border-yellow-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Wallet Connection Issues</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Common Problems:</h4>
                    <ul className="space-y-1 text-white/70">
                      <li>• Wallet not detected or installed</li>
                      <li>• Wrong network selected</li>
                      <li>• Browser compatibility issues</li>
                      <li>• Popup blockers preventing connection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white/90 mb-2">Solutions:</h4>
                    <ul className="space-y-1 text-white/70">
                      <li>• Install MetaMask or another supported wallet</li>
                      <li>• Switch to Chiliz Chain (Chain ID: 88888)</li>
                      <li>• Try a different browser (Chrome, Firefox recommended)</li>
                      <li>• Allow popups for C-TRACE</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-gray-800/40 p-6 rounded-2xl border border-blue-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Common Error Messages</h3>
                <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-lg">
                    <code className="text-red-400 text-sm">Error: Invalid address format</code>
                    <p className="text-white/70 text-sm mt-2">
                      Make sure the address starts with '0x' and has exactly 42 characters.
                    </p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <code className="text-red-400 text-sm">Error: Network timeout</code>
                    <p className="text-white/70 text-sm mt-2">
                      The blockchain network is slow. Wait a moment and try again.
                    </p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg">
                    <code className="text-red-400 text-sm">Error: Contract not found</code>
                    <p className="text-white/70 text-sm mt-2">
                      The contract address doesn't exist on Chiliz Chain. Verify the address.
                    </p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        );

      case 'whats-next':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">What&apos;s Next</h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Discover upcoming features and how to stay connected with the C-TRACE community.
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">Planned Features</h2>
                <div className="grid gap-4">
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">⛽ Gas Insights</h4>
                    <p className="text-white/70">Real-time gas price tracking and optimization suggestions for Chiliz Chain transactions.</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">🚀 Smart Contract Deployer</h4>
                    <p className="text-white/70">Visual interface for deploying and managing smart contracts on Chiliz Chain.</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">🖼️ NFT Scanner</h4>
                    <p className="text-white/70">Advanced NFT collection analysis and rarity scoring for sports memorabilia.</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">🏆 Fan Token Leaderboard</h4>
                    <p className="text-white/70">Rankings and analytics for fan token performance across different sports teams.</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">📱 Mobile App</h4>
                    <p className="text-white/70">Native mobile applications for iOS and Android with push notifications.</p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/40 p-6 rounded-2xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">🔔 Alert System</h4>
                    <p className="text-white/70">Custom notifications for contract events, price changes, and network updates.</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-chiliz-primary mb-4">Submit Feature Requests</h2>
                <div className="bg-gradient-to-r from-chiliz-primary/10 to-transparent p-6 rounded-2xl border border-chiliz-primary/20">
                  <p className="text-white/80 mb-4">
                    Have an idea for a new feature? We'd love to hear from you! Your feedback helps shape the future of C-TRACE.
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="https://t.me/ch04niverse" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-chiliz-primary hover:bg-chiliz-primary/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors block text-center"
                    >
                      Submit Feature Request
                    </a>
                  </div>
                </div>
              </section>

              <div className="bg-gradient-to-r from-chiliz-primary/20 to-chiliz-secondary/20 p-8 rounded-2xl border border-chiliz-primary/30 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-white">Built with ❤️ by ch04niverse</span>
                </div>
                <p className="text-white/80 mb-4">
                  C-TRACE is crafted with passion for the Chiliz community and blockchain exploration.
                </p>
                <p className="text-white/70 text-sm">
                  Thanks for being part of our journey to make blockchain data accessible to everyone.
                </p>
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
        {/* Sidebar */}
        <div className="w-64 bg-gray-900/60 backdrop-blur-sm border-r border-white/10 overflow-y-auto">
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
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
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