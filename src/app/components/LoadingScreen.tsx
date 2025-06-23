
'use client';

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [loadingText, setLoadingText] = useState('[INFO] Loading 3D environment...');
  const [dots, setDots] = useState('');

  const loadingSteps = [
    '[INFO] Loading 3D environment...',
    '[INFO] Initializing blockchain explorer...',
    '[INFO] Connecting to Chiliz network...',
    '[INFO] Preparing AI assistant...',
    '[INFO] Starting C-TRACE interface...'
  ];

  useEffect(() => {
    let stepIndex = 0;
    let dotCount = 0;

    const interval = setInterval(() => {
      // Update dots animation
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));

      // Change loading text every 1.5 seconds
      if (dotCount === 0) {
        stepIndex = (stepIndex + 1) % loadingSteps.length;
        setLoadingText(loadingSteps[stepIndex]);
        
        // Complete loading after all steps
        if (stepIndex === loadingSteps.length - 1) {
          setTimeout(() => {
            onLoadingComplete?.();
          }, 1500);
        }
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #E50046 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, #FF4EB5 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* C-TRACE Logo */}
        <h1 className="text-6xl font-bold mb-12 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
          C-TRACE
        </h1>

        {/* Terminal Window */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-2xl p-6 min-w-[500px]">
          {/* Terminal Header */}
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-gray-700">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm ml-4">c-trace</span>
          </div>

          {/* Terminal Content */}
          <div className="font-mono text-left">
            <div className="text-orange-400 mb-2">
              c-trace@server:~$ npm run initialize
            </div>
            <div className="text-blue-400 mb-4">
              {loadingText}
            </div>
            
            {/* Animated dots */}
            <div className="flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>

            <div className="text-gray-500 text-sm mt-4 text-center">
              Preparing your experience{dots}
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 mt-6 text-lg">
          Blockchain Explorer & AI Assistant
        </p>
      </div>
    </div>
  );
}
