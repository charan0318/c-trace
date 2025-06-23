'use client'
import React, { useState, useCallback, useMemo } from 'react'
import Spline from '@splinetool/react-spline'

const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChain, setSelectedChain] = useState('')
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [splineError, setSplineError] = useState(false)

  // Memoized blockchain options
  const blockchains = useMemo(() => [
    { id: '88888', name: 'Chiliz Chain' },
    { id: '1', name: 'Ethereum' },
    { id: '56', name: 'BSC' },
    { id: '137', name: 'Polygon' }
  ], [])

  // Memoized feature cards
  const featureCards = useMemo(() => [
    { 
      title: 'Check Balance', 
      desc: 'Explore token balances easily through AI prompts.',
      icon: '💰'
    },
    { 
      title: 'Get Contract Info', 
      desc: 'Discover smart contract details and functions.',
      icon: '📄'
    },
    { 
      title: 'Decode Transaction', 
      desc: 'Analyze transaction data with natural language.',
      icon: '🔍'
    }
  ], [])

  const handleSearch = useCallback(() => {
    if (!selectedChain || !searchTerm.trim()) {
      alert('Please select a chain and enter a search term')
      return
    }

    try {
      // Navigate to explorer (you can implement your routing logic here)
      console.log(`Searching for: ${searchTerm} on chain: ${selectedChain}`)
      // router.push(/explorer?chainId=${selectedChain}&searchTerm=${encodeURIComponent(searchTerm)})
    } catch (error) {
      console.error('Navigation error:', error)
      alert('Failed to navigate to explorer')
    }
  }, [selectedChain, searchTerm])

  const handleSplineLoad = useCallback(() => {
    console.log('✅ Spline scene loaded successfully')
    setSplineLoaded(true)
  }, [])

  const handleSplineError = useCallback((error) => {
    console.error('❌ Spline scene failed to load:', error)
    setSplineError(true)
    setSplineLoaded(false)
  }, [])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Spline Background Scene */}
      <div className="fixed inset-0 w-full h-full z-0">
        {!splineError && (
          <Spline 
            scene="https://prod.spline.design/CzpaWhZatxJIV-bg/scene.splinecode"
            className="w-full h-full"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{ 
              width: '100%', 
              height: '100%',
              minHeight: '100vh',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        )}

        {/* Fallback gradient background */}
        {splineError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900"></div>
        )}

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white px-6">

        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              Blockchain
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-pink-400 to-red-500 bg-clip-text text-transparent">
              Explorer
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover, analyze, and explore blockchain data with AI-powered insights
          </p>
        </div>

        {/* Search Interface */}
        <div className="backdrop-blur-sm bg-black/30 border border-orange-400/30 rounded-3xl p-8 w-full max-w-4xl mb-16">
          <div className="flex flex-col lg:flex-row gap-4 items-end">

            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Search Query
              </label>
              <input
                type="text"
                placeholder="Enter contract address or question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:border-orange-400/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Chain Selector */}
            <div className="min-w-[200px]">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Blockchain
              </label>
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/20 text-white backdrop-blur-sm focus:border-orange-400/50 focus:outline-none transition-colors"
              >
                <option value="" className="bg-black">Select chain</option>
                {blockchains.map((chain) => (
                  <option
                    key={chain.id}
                    value={chain.id}
                    className="bg-black text-white"
                  >
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-orange-500/30 min-w-[140px]"
            >
              <span className="flex items-center gap-2 justify-center">
                🔍 Search
              </span>
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mb-16">
          {featureCards.map((item, index) => (
            <div
              key={index}
              className="group backdrop-blur-sm bg-black/30 border border-orange-400/20 rounded-3xl p-8 hover:bg-black/40 hover:border-orange-400/40 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mb-16">
          <div className="backdrop-blur-sm bg-black/20 border border-white/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">10M+</div>
            <div className="text-white/70 text-sm">Transactions</div>
          </div>
          <div className="backdrop-blur-sm bg-black/20 border border-white/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-white/70 text-sm">Contracts</div>
          </div>
          <div className="backdrop-blur-sm bg-black/20 border border-white/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">1K+</div>
            <div className="text-white/70 text-sm">Daily Users</div>
          </div>
          <div className="backdrop-blur-sm bg-black/20 border border-white/20 rounded-2xl px-6 py-4 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
            <div className="text-white/70 text-sm">Uptime</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-white/40 text-sm">
          <p>&copy; {new Date().getFullYear()} Chiliz AI Explorer | Crafted with ❤ by Dexra</p>
        </footer>
      </div>

      {/* Loading Indicator */}
      {!splineLoaded && !splineError && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-orange-400/30 border-t-orange-400 rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-white/80">Loading 3D Environment...</p>
          </div>
        </div>
      )}

      {/* Floating Elements for Visual Appeal */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-3/4 right-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </div>
  )
}

export default Hero