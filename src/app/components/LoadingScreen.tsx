'use client';

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div data-loading-screen className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Main Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">

        {/* Animated HUD GIF */}
        <div className="relative mb-8">
          <img 
            src="/attached_assets/original-b3d5d666729bb0b3f8ca0bdae7936251_1750872466898.gif"
            alt="Loading Animation"
            className="w-96 h-64 md:w-[600px] md:h-96 object-contain"
            onError={(e) => {
              // Fallback if GIF doesn't load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>

        {/* Loading Text and Progress */}
        <div className="text-center">
          <div className="text-cyan-400 text-3xl md:text-4xl font-bold mb-4 animate-pulse">
            C-TRACE
          </div>
          <div className="text-cyan-400/80 text-sm font-mono mb-6">
            INITIALIZING BLOCKCHAIN INTERFACE...
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-gray-800 border border-cyan-400/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-cyan-400/60 text-xs font-mono mt-2">
            {progress}% COMPLETE
          </div>
        </div>
      </div>
    </div>
  );
}