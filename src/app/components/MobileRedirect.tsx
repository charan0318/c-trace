
'use client';

import { useEffect, useState } from 'react';
import { Monitor, Smartphone, Zap } from 'lucide-react';

export default function MobileRedirect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-chiliz-dark z-[10000] flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-chiliz-primary/20 to-red-600/20"></div>
      </div>

      <div className="relative max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-chiliz-primary to-red-600 flex items-center justify-center shadow-lg shadow-chiliz-primary/25">
              <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-chiliz-primary to-red-600 opacity-30 blur-lg"></div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-white">
            C-TRACE
          </h1>
          <div className="inline-flex items-center px-2 py-1 bg-chiliz-primary/20 border border-chiliz-primary/30 rounded-lg">
            <span className="text-xs font-bold text-chiliz-primary uppercase tracking-wider">
              BETA
            </span>
          </div>
        </div>

        {/* Icon Transition */}
        <div className="flex items-center justify-center space-x-4 py-6">
          <Smartphone className="w-8 h-8 text-gray-400" />
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-chiliz-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <Monitor className="w-8 h-8 text-chiliz-primary" />
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Desktop Experience Required
          </h2>
          <p className="text-gray-300 leading-relaxed">
            C-TRACE is optimized for desktop and laptop devices to provide the best blockchain analysis experience with full access to all professional tools and features.
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-gray-900/60 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">
            How to access:
          </h3>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">
                Open this link on a desktop or laptop computer
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">
                Use a screen width of at least 768px
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-chiliz-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300 text-sm">
                Ensure your browser supports modern web features
              </p>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="pt-6">
          <p className="text-gray-500 text-sm">
            Thank you for your understanding. We're working to bring you the best possible blockchain analysis experience.
          </p>
        </div>
      </div>
    </div>
  );
}
