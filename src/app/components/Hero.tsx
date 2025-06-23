"use client";

import Spline from "@splinetool/react-spline";

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Interactive Spline Background */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/CzpaWhZatxJIV-bg/scene.splinecode" />
      </div>

      {/* Foreground UI */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* Search */}
        <div className="w-full max-w-3xl mb-8 bg-white bg-opacity-20 backdrop-blur rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter contract address or question..."
              className="flex-1 px-4 py-2 rounded-md bg-white bg-opacity-10 text-white placeholder:text-gray-300"
            />
            <select className="px-4 py-2 rounded-md bg-white bg-opacity-10 text-white">
              <option>Select chain</option>
            </select>
            <button className="px-4 py-2 bg-chiliz-primary rounded-md text-white shadow-glow">
              Search
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-6 text-left max-w-xs shadow-glow text-white">
            <h2 className="text-xl font-semibold text-chiliz-primary">Check Balance</h2>
            <p className="text-sm mt-2 text-white/80">Explore token balances easily through AI prompts.</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-6 text-left max-w-xs shadow-glow text-white">
            <h2 className="text-xl font-semibold text-chiliz-primary">Get Contract Info</h2>
            <p className="text-sm mt-2 text-white/80">Discover smart contract details and functions.</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-6 text-left max-w-xs shadow-glow text-white">
            <h2 className="text-xl font-semibold text-chiliz-primary">Decode Transaction</h2>
            <p className="text-sm mt-2 text-white/80">Analyze transaction data with natural language.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
