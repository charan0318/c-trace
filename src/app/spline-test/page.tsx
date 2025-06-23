'use client';

import Spline from '@splinetool/react-spline/next';

export default function SplineTest() {
  return (
    <div className="h-screen bg-black">
      <Spline scene="https://prod.spline.design/CzpaWhZatxJIV-bg/scene.splinecode" />
    </div>
  );
}
