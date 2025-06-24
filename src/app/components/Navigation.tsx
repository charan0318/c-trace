'use client';

import Link from 'next/link';
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { GradientButton } from "./ui/gradient-button";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="glass-panel !p-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-chiliz-primary transition-colors">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/chiliz-logo.png" 
                  alt="Chiliz Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    console.error('Logo failed to load, using fallback');
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div 
                  className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded flex items-center justify-center text-white font-bold text-sm hidden"
                  style={{ display: 'none' }}
                >
                  C
                </div>
              </div>
              <span>Chiliz AI Explorer</span>
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/explorer" className="text-white/80 hover:text-chiliz-secondary transition-colors font-medium">
                Explorer
              </Link>
              <Link href="/docs" className="text-white/80 hover:text-chiliz-secondary transition-colors font-medium">
                Docs
              </Link>
              <ConnectButton
                client={client}
                wallets={[
                  createWallet("io.metamask"),
                  createWallet("com.coinbase.wallet"),
                  createWallet("me.rainbow"),
                  createWallet("io.rabby"),
                  createWallet("io.wallethub"),
                  inAppWallet({
                    auth: {
                      options: ["email", "google", "apple", "facebook", "phone"],
                    },
                  }),
                ]}
                connectModal={{ 
                  size: "compact",
                  title: "Connect Wallet",
                  titleIcon: "",
                }}
                connectButton={{
                  component: ({ connectModal }) => (
                    <GradientButton 
                      onClick={connectModal?.open}
                      className="gradient-button"
                    >
                      Connect Wallet
                    </GradientButton>
                  ),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}