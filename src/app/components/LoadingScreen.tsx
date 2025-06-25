
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
      {/* Main HUD Container */}
      <div className="relative w-full h-full max-w-6xl max-h-4xl flex items-center justify-center">
        {/* Animated HUD Interface */}
        <div className="relative w-full h-full scale-75 md:scale-90 lg:scale-100">
          {/* Central Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-32 border-2 border-cyan-400 rounded-full relative animate-pulse">
              <div className="absolute inset-4 border border-cyan-400/50 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-cyan-400/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Corner Brackets */}
          <div className="absolute top-20 left-20">
            <div className="w-20 h-20 border-l-2 border-t-2 border-cyan-400 animate-fade-in-out"></div>
          </div>
          <div className="absolute top-20 right-20">
            <div className="w-20 h-20 border-r-2 border-t-2 border-cyan-400 animate-fade-in-out" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="absolute bottom-20 left-20">
            <div className="w-20 h-20 border-l-2 border-b-2 border-cyan-400 animate-fade-in-out" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="absolute bottom-20 right-20">
            <div className="w-20 h-20 border-r-2 border-b-2 border-cyan-400 animate-fade-in-out" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Triangular Elements */}
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-cyan-400 animate-pulse"></div>
          </div>
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-16 border-l-transparent border-r-transparent border-t-cyan-400 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
          </div>

          {/* Side Panels */}
          <div className="absolute left-32 top-1/2 transform -translate-y-1/2">
            <div className="w-32 h-48 border border-cyan-400/50 bg-cyan-400/5 backdrop-blur-sm animate-slide-in-left">
              <div className="p-4 space-y-2">
                <div className="h-1 bg-cyan-400 w-3/4 animate-pulse"></div>
                <div className="h-1 bg-cyan-400/60 w-1/2"></div>
                <div className="h-1 bg-cyan-400/40 w-2/3"></div>
                <div className="mt-4 text-xs text-cyan-400 font-mono">SYS</div>
                <div className="text-xs text-cyan-400/80 font-mono">28900</div>
              </div>
            </div>
          </div>
          <div className="absolute right-32 top-1/2 transform -translate-y-1/2">
            <div className="w-32 h-48 border border-cyan-400/50 bg-cyan-400/5 backdrop-blur-sm animate-slide-in-right">
              <div className="p-4 space-y-2">
                <div className="h-1 bg-cyan-400 w-3/4 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="h-1 bg-cyan-400/60 w-1/2"></div>
                <div className="h-1 bg-cyan-400/40 w-2/3"></div>
                <div className="mt-4 text-xs text-cyan-400 font-mono">DAT</div>
                <div className="text-xs text-cyan-400/80 font-mono">49300</div>
              </div>
            </div>
          </div>

          {/* Connecting Lines */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg width="800" height="600" className="animate-draw-lines">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#00bcd4" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              
              {/* Connecting lines to corners */}
              <line x1="300" y1="300" x2="100" y2="100" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
              <line x1="300" y1="300" x2="500" y2="100" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
              <line x1="300" y1="300" x2="100" y2="500" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
              <line x1="300" y1="300" x2="500" y2="500" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.6" />
              
              {/* Grid pattern */}
              <g opacity="0.3">
                {Array.from({ length: 10 }, (_, i) => (
                  <line key={i} x1={50 + i * 50} y1="50" x2={50 + i * 50} y2="550" stroke="#00bcd4" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 10 }, (_, i) => (
                  <line key={i} x1="50" y1={50 + i * 50} x2="550" y2={50 + i * 50} stroke="#00bcd4" strokeWidth="0.5" />
                ))}
              </g>
            </svg>
          </div>

          {/* Loading Text */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-cyan-400 text-2xl md:text-3xl font-bold mb-4 animate-glow">
              C-TRACE
            </div>
            <div className="text-cyan-400/80 text-sm font-mono mb-4">
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

          {/* Floating particles */}
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes slide-in-left {
          0% { transform: translateX(-100px) translateY(-50%); opacity: 0; }
          100% { transform: translateX(0) translateY(-50%); opacity: 1; }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(100px) translateY(-50%); opacity: 0; }
          100% { transform: translateX(0) translateY(-50%); opacity: 1; }
        }
        @keyframes draw-lines {
          0% { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
          100% { stroke-dasharray: 1000; stroke-dashoffset: 0; }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px #00bcd4; }
          50% { text-shadow: 0 0 20px #00bcd4, 0 0 30px #00bcd4; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 1; }
        }
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out;
        }
        .animate-draw-lines {
          animation: draw-lines 3s ease-out;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
