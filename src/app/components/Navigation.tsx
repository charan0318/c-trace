
'use client';

import Link from 'next/link'

import { ConnectButton } from "thirdweb/react";
import { client } from "../client"

export function Navigation() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-md bg-white/5 rounded-xl shadow-md">
      <Link href="/" className="text-2xl font-bold tracking-wide">
        🌶️ Chiliz AI Explorer
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-white/70 hover:text-white transition-colors">
          Home
        </Link>
        <ConnectButton
          client={client}
          connectModal={{ size: "compact" }}
          connectButton={{
            className: "bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full font-semibold shadow-[0_0_12px_#ec4899]"
          }}
        />
      </div>
    </nav>
  )
}
