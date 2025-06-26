'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
          }, 300);
          return 100;
        }
        return prev + 4; // Faster increment
      });
    }, 50); // Faster updates

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div data-loading-screen className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Main Container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">

        {/* Animated HUD GIF */}
        <div className="relative mb-8">
          <Image 
            src="/loading-animation.gif"
            alt="Loading Animation"
            width={600}
            height={400}
            className="w-96 h-64 md:w-[600px] md:h-96 object-contain"
            priority
            unoptimized
            onLoad={() => {
              console.log('✅ Loading GIF loaded successfully');
            }}
            onError={(e) => {
              console.error('❌ Loading GIF failed to load');
              // Fallback if GIF doesn't load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>

        {/* Loading Text and Progress */}
        <div className="text-center">
          <div className="text-chiliz-primary text-3xl md:text-4xl font-bold mb-4 animate-pulse">
            C-TRACE
          </div>
          <div className="text-chiliz-primary/80 text-sm font-mono mb-6">
            INITIALIZING BLOCKCHAIN INTERFACE...
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-gray-800 border border-chiliz-primary/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-chiliz-primary to-red-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-chiliz-primary/60 text-xs font-mono mt-2">
            {progress}% COMPLETE
          </div>
        </div>
      </div>
    </div>
  );
}