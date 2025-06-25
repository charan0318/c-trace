'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { Search, Zap, Globe, Menu, X } from "lucide-react";
import { isFeatureEnabled } from "../lib/features";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Hide navigation on explorer page
  if (pathname === '/explorer') {
    return null;
  }

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9999] backdrop-blur-xl bg-gradient-to-r from-black/20 via-gray-900/30 to-black/20 border-b border-white/5 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-black/40 via-gray-900/50 to-black/40 backdrop-blur-2xl shadow-2xl">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-chiliz-primary/5 via-transparent to-red-600/5 opacity-50"></div>

          <div className="relative flex justify-between items-center px-4 md:px-6 py-4">
            {/* Logo and Brand */}
            <Link href="/" className="group flex items-center space-x-2 md:space-x-3 text-xl md:text-2xl font-bold text-white hover:text-chiliz-primary transition-all duration-300">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-chiliz-primary to-red-600 flex items-center justify-center shadow-lg shadow-chiliz-primary/25 group-hover:shadow-chiliz-primary/40 transition-all duration-300 group-hover:scale-110">
                  <Zap className="w-4 h-4 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-chiliz-primary to-red-600 opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-black tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  C-TRACE
                </span>
                <span className="text-xs font-medium text-chiliz-primary/80 tracking-wider uppercase hidden sm:block">
                  AI Explorer
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {/* Docs Link */}
              <Link 
                href="/docs" 
                className="group flex items-center space-x-2 text-white/70 hover:text-white font-medium transition-all duration-200 hover:scale-105 min-h-[44px] min-w-[44px] justify-center"
              >
                <Globe className="w-4 h-4 text-chiliz-primary/60 group-hover:text-chiliz-primary transition-colors" />
                <span className="hidden lg:block">Docs</span>
              </Link>

              {/* Explorer Link */}
              <Link 
                href="/explorer" 
                className="group flex items-center space-x-2 text-white/70 hover:text-white font-medium transition-all duration-200 hover:scale-105 min-h-[44px] min-w-[44px] justify-center"
              >
                <Search className="w-4 h-4 text-chiliz-primary/60 group-hover:text-chiliz-primary transition-colors" />
                <span className="hidden lg:block">Explorer</span>
              </Link>

              {/* Enhanced Connect Wallet Button */}
              {isFeatureEnabled('WALLET_CONNECTION') && (
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-chiliz-primary/20 to-red-600/20 blur-lg opacity-50"></div>

                  <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-pulse duration-1000"></div>

                    <div className="relative">
                      <ConnectButton
                        client={client}
                        wallets={[
                          createWallet("io.metamask"),
                          createWallet("com.coinbase.wallet"),
                          createWallet("me.rainbow"),
                          createWallet("io.rabby"),
                          inAppWallet({
                            auth: {
                              options: ["email", "google", "apple", "facebook", "phone"],
                            },
                          }),
                        ]}
                        connectModal={{ 
                          size: "compact",
                          title: "Connect to C-TRACE",
                          titleIcon: "",
                        }}
                        connectButton={{
                          label: "Connect Wallet",
                          style: {
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px',
                            padding: '12px 20px',
                            minWidth: '140px',
                            borderRadius: '12px',
                            display: 'block',
                            width: 'auto',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gradient-to-r from-gray-900/80 to-black/80 border border-white/20 text-white hover:text-chiliz-primary transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-gradient-to-r from-gray-900/90 to-black/90 backdrop-blur-xl">
              <div className="px-4 py-4 space-y-4">
                {/* Docs Link */}
                <Link 
                  href="/docs" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-white/70 hover:text-white font-medium transition-all duration-200 p-3 rounded-xl hover:bg-white/10 min-h-[44px]"
                >
                  <Globe className="w-5 h-5 text-chiliz-primary/60" />
                  <span>Documentation</span>
                </Link>

                {/* Explorer Link */}
                <Link 
                  href="/explorer" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 text-white/70 hover:text-white font-medium transition-all duration-200 p-3 rounded-xl hover:bg-white/10 min-h-[44px]"
                >
                  <Search className="w-5 h-5 text-chiliz-primary/60" />
                  <span>Explorer</span>
                </Link>

                {/* Mobile Connect Wallet Button */}
                {isFeatureEnabled('WALLET_CONNECTION') && (
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl">
                      <ConnectButton
                        client={client}
                        wallets={[
                          createWallet("io.metamask"),
                          createWallet("com.coinbase.wallet"),
                          createWallet("me.rainbow"),
                          createWallet("io.rabby"),
                          inAppWallet({
                            auth: {
                              options: ["email", "google", "apple", "facebook", "phone"],
                            },
                          }),
                        ]}
                        connectModal={{ 
                          size: "compact",
                          title: "Connect to C-TRACE",
                          titleIcon: "",
                        }}
                        connectButton={{
                          label: "Connect Wallet",
                          style: {
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '16px',
                            padding: '16px 24px',
                            minWidth: '160px',
                            borderRadius: '12px',
                            display: 'block',
                            width: '100%',
                            textAlign: 'center',
                            minHeight: '44px',
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}