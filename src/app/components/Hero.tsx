'use client';

import Spline from '@splinetool/react-spline';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function Hero() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);

  const handleSplineLoad = useCallback(() => {
    console.log('✅ Spline scene loaded successfully');
    setSplineLoaded(true);
  }, []);

  const handleSplineError = useCallback((error: any) => {
    console.error('❌ Spline scene failed to load:', error);
    setSplineError(true);
    setSplineLoaded(false);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Spline Background - Full screen */}
      <div className="fixed top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
        {!splineLoaded && !splineError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white/50 text-lg">Loading 3D Scene...</div>
          </div>
        )}
        {splineError && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
        )}
        {!splineError && (
          <Spline 
            scene="https://prod.spline.design/CzpaWhZatxJIV-bg/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{ 
              width: '100%', 
              height: '100%',
              opacity: splineLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}
          />
        )}
      </div>
    </div>