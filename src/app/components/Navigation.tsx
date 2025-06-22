'use client';

import Link from 'next/link';
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { inAppWallet } from "thirdweb/wallets";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="glass-panel !p-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-chiliz-primary transition-colors">
              🌶️ Chiliz AI Explorer
            </Link>

            <div className="flex items-center space-x-6">
              <Link href="/explorer" className="text-white/80 hover:text-chiliz-secondary transition-colors font-medium">
                Explorer
              </Link>
              <Link href="/docs" className="text-white/80 hover:text-chiliz-secondary transition-colors font-medium">
                Docs
              </Link>
              <div className="glass-panel !p-2 !rounded-xl">
                <ConnectButton
                  client={client}
                  wallets={[
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
                    label: "Connect Wallet",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}