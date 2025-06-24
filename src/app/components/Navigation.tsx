
'use client';

import Link from 'next/link';
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { Search, Zap, Globe } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-r from-black/20 via-gray-900/30 to-black/20 border-b border-white/5">
      <div className="container mx-auto px-4 py-3">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-black/40 via-gray-900/50 to-black/40 backdrop-blur-2xl shadow-2xl">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-chiliz-primary/5 via-transparent to-chiliz-secondary/5 opacity-50"></div>
          
          <div className="relative flex justify-between items-center px-6 py-4">
            {/* Logo and Brand */}
            <Link href="/" className="group flex items-center space-x-3 text-2xl font-bold text-white hover:text-chiliz-primary transition-all duration-300">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chiliz-primary to-chiliz-secondary flex items-center justify-center shadow-lg shadow-chiliz-primary/25 group-hover:shadow-chiliz-primary/40 transition-all duration-300 group-hover:scale-110">
                  <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-chiliz-primary to-chiliz-secondary opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  C-TRACE
                </span>
                <span className="text-xs font-medium text-chiliz-secondary/80 tracking-wider uppercase">
                  AI Explorer
                </span>
              </div>
            </Link>

            {/* Navigation Items */}
            <div className="flex items-center space-x-8">
              {/* Docs Link */}
              <Link 
                href="/docs" 
                className="group flex items-center space-x-2 text-white/70 hover:text-white font-medium transition-all duration-200 hover:scale-105"
              >
                <Globe className="w-4 h-4 text-chiliz-secondary/60 group-hover:text-chiliz-secondary transition-colors" />
                <span>Docs</span>
              </Link>

              {/* Explorer Link */}
              <Link 
                href="/explorer" 
                className="group flex items-center space-x-2 text-white/70 hover:text-white font-medium transition-all duration-200 hover:scale-105"
              >
                <Search className="w-4 h-4 text-chiliz-primary/60 group-hover:text-chiliz-primary transition-colors" />
                <span>Explorer</span>
              </Link>

              {/* Enhanced Connect Wallet Button */}
              <div className="relative">
                {/* Glow background */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chiliz-primary/20 to-chiliz-secondary/20 blur-lg opacity-50"></div>
                
                <div className="relative overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-pulse duration-1000"></div>
                  
                  <div className="relative px-6 py-3">
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
                          padding: '0',
                          minWidth: 'auto',
                          lineHeight: '1',
                          whiteSpace: 'nowrap',
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
