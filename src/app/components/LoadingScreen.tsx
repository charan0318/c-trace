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
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            alt="Loading Animation"
            className="w-96 h-64 md:w-[600px] md:h-96 object-contain"
            style={{
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23000000'/%3E%3Cg stroke='%2300bcd4' stroke-width='2' fill='none'%3E%3C!-- Central hexagonal pattern --%3E%3Cpolygon points='400,250 450,275 450,325 400,350 350,325 350,275' stroke-width='3'/%3E%3Ccircle cx='400' cy='300' r='15' fill='%2300bcd4' opacity='0.8'/%3E%3C!-- Corner brackets --%3E%3Cpath d='M100,100 L100,150 M100,100 L150,100' stroke-width='3'/%3E%3Cpath d='M700,100 L700,150 M700,100 L650,100' stroke-width='3'/%3E%3Cpath d='M100,500 L100,450 M100,500 L150,500' stroke-width='3'/%3E%3Cpath d='M700,500 L700,450 M700,500 L650,500' stroke-width='3'/%3E%3C!-- Side panels --%3E%3Crect x='150' y='220' width='80' height='160' stroke-width='1' fill='%2300bcd4' fill-opacity='0.1'/%3E%3Crect x='570' y='220' width='80' height='160' stroke-width='1' fill='%2300bcd4' fill-opacity='0.1'/%3E%3C!-- Connection lines --%3E%3Cline x1='230' y1='300' x2='350' y2='300' stroke-width='1' opacity='0.6'/%3E%3Cline x1='450' y1='300' x2='570' y2='300' stroke-width='1' opacity='0.6'/%3E%3C!-- Data displays --%3E%3Ctext x='190' y='250' fill='%2300bcd4' font-family='monospace' font-size='12'%3E28900%3C/text%3E%3Ctext x='590' y='250' fill='%2300bcd4' font-family='monospace' font-size='12'%3E49300%3C/text%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
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