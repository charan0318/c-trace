'use client';

import { useState, useEffect } from 'react';
import { Search, Zap, TrendingUp, Shield, Sparkles, ChevronRight, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import SearchBar from './ui/SearchBar';
import Silk from './ui/Silk';

const Hero = () => {
  const [searchInput, setSearchInput] = useState('');
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const [showSpline, setShowSpline] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const features = [
    {
      icon: <Zap className="w-4 h-4 md:w-5 md:h-5" />,
      title: "AI-Powered Analysis",
      description: "Get intelligent insights from blockchain data using advanced AI"
    },
    {
      icon: <Shield className="w-4 h-4 md:w-5 md:h-5" />,
      title: "Chiliz Chain Focus",
      description: "Specialized explorer for fan tokens and sports blockchain"
    },
    {
      icon: <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />,
      title: "Real-time Data",
      description: "Live blockchain data with instant analysis and updates"
    },
    {
      icon: <Sparkles className="w-4 h-4 md:w-5 md:h-5" />,
      title: "Natural Language",
      description: "Ask questions in plain English and get smart answers"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const encodedQuery = encodeURIComponent(query);
      window.location.href = `/explorer?q=${encodedQuery}`;
    }
  };

  const handleSplineError = () => {
    setShowSpline(false);
  };

  const quickPrompts = [
    "Analyze contract security",
    "Check token balance",
    "Explain transaction",
    "Fan token details"
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-chiliz-dark flex flex-col justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Silk Background */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <Silk
            speed={isMobile ? 1 : 1.5}
            scale={isMobile ? 1.5 : 2.2}
            color="#4a4a7e"
            noiseIntensity={isMobile ? 0.6 : 0.8}
            rotation={0}
          />
        </div>

        {/* 3D Spline Background - Only on desktop */}
        {showSpline && !isMobile && (
          <div className="absolute inset-0 opacity-30" style={{ zIndex: 2 }}>
            <Spline
              scene="https://prod.spline.design/kzJ8kJkjPYT8LQrq/scene.splinecode"
              onLoad={() => setIs3DLoaded(true)}
              onError={handleSplineError}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                pointerEvents: 'none'
              }}
            />
          </div>
        )}

        {/* Gradient Overlays */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60"
          style={{ zIndex: 3 }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"
          style={{ zIndex: 3 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 safe-area-inset-bottom">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-6 md:mb-12">
            {/* Logo and Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 md:mb-8"
            >
              <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-6">
                <div className="relative">
                  <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-chiliz-primary to-red-600 flex items-center justify-center shadow-2xl shadow-chiliz-primary/25">
                    <Zap className="w-5 h-5 md:w-8 md:h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-chiliz-primary to-red-600 opacity-30 blur-lg animate-pulse"></div>
                </div>
                <div className="text-left">
                  <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                    C-TRACE
                  </h1>
                  <p className="text-xs md:text-lg font-medium text-chiliz-primary/80 tracking-wider uppercase">
                    AI Blockchain Explorer
                  </p>
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-sm md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed px-2 md:px-4"
              >
                Explore the Chiliz blockchain with the power of AI. 
                <span className="text-chiliz-primary font-semibold block md:inline"> Ask questions in natural language</span> and get intelligent insights about contracts, transactions, and fan tokens.
              </motion.p>
            </motion.div>

            {/* Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-6 md:mb-12"
            >
              <div className="max-w-2xl mx-auto">
                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                  onSearch={handleSearch}
                  placeholder="Ask anything about Chiliz blockchain..."
                  className="w-full"
                />

                {/* Quick Prompts */}
                <div className="mt-3 md:mt-6">
                  <p className="text-xs md:text-sm text-white/60 mb-2 md:mb-3">Try these prompts:</p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
                    {quickPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(prompt)}
                        className="px-2.5 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-chiliz-primary/50 rounded-full text-white/80 hover:text-white transition-all duration-200 backdrop-blur-sm touch-manipulation"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features Carousel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-6 md:mb-12"
            >
              <div className="max-w-sm md:max-w-md mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20"
                  >
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <div className="p-1.5 md:p-2 rounded-lg bg-chiliz-primary/20 text-chiliz-primary">
                        {features[currentFeature].icon}
                      </div>
                      <h3 className="text-base md:text-xl font-bold text-white">
                        {features[currentFeature].title}
                      </h3>
                    </div>
                    <p className="text-white/80 text-xs md:text-base line-clamp-2">
                      {features[currentFeature].description}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Feature Indicators */}
                <div className="flex justify-center gap-1.5 md:gap-2 mt-3 md:mt-4">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeature(index)}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-200 touch-manipulation ${
                        index === currentFeature 
                          ? 'bg-chiliz-primary w-4 md:w-6' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col gap-3 md:gap-4 justify-center items-center"
            >
              <button
                onClick={() => window.location.href = '/explorer'}
                className="group flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-chiliz-primary to-red-600 hover:from-red-600 hover:to-chiliz-primary text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-chiliz-primary/25 hover:shadow-chiliz-primary/40 w-full max-w-xs md:max-w-none md:w-auto justify-center touch-manipulation"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Start Exploring</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => window.location.href = '/docs'}
                className="group flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-chiliz-primary/50 text-white font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm w-full max-w-xs md:max-w-none md:w-auto justify-center touch-manipulation"
              >
                <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">View Docs</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 hidden md:block"
      >
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs font-medium">Scroll for more</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;