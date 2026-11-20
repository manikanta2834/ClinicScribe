'use client';

import React from 'react';

export interface ClinicScribeHeaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'cream' | 'dark' | 'transparent';
  animated?: boolean;
}

/**
 * ClinicScribe Brand Header Lockup
 * Combines the animated Warm Chrome Liquid Metal icon with crisp static brand typography.
 * Automatically respects `prefers-reduced-motion` with a static high-res poster fallback.
 */
export function ClinicScribeHeader({
  className = '',
  size = 'md',
  variant = 'cream',
  animated = true,
}: ClinicScribeHeaderProps) {
  // Dimensions per size tier
  const sizeMap = {
    sm: { icon: 44, titleSize: 'text-xl', taglineSize: 'text-[8px]', tracking: 'tracking-[0.16em]' },
    md: { icon: 60, titleSize: 'text-2xl', taglineSize: 'text-[9.5px]', tracking: 'tracking-[0.18em]' },
    lg: { icon: 84, titleSize: 'text-4xl', taglineSize: 'text-[12px]', tracking: 'tracking-[0.20em]' },
  };

  const currentSize = sizeMap[size];

  // Theme colors
  const isDark = variant === 'dark';
  const textColor = isDark ? 'text-[#FFF6E9]' : 'text-[#075D55]';
  const taglineColor = isDark ? 'text-[#3BDBC5]' : 'text-[#169785]';

  return (
    <header className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Liquid Metal Icon Container */}
      <div
        className="relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        {animated ? (
          <>
            {/* Seamless 60fps Loop Video (Hidden when reduced motion is preferred) */}
            <video
              className="w-full h-full object-contain motion-reduce:hidden drop-shadow-md"
              autoPlay
              loop
              muted
              playsInline
              poster="/assets/clinicscribe-liquid-metal-poster.png"
              aria-label="ClinicScribe animated liquid metal emblem"
            >
              {/* Transparent WebM (Chrome, Firefox, Edge, Android) */}
              <source src="/assets/clinicscribe-liquid-metal-alpha.webm" type="video/webm" />
              {/* MP4 Fallback on Cream (#FFF6E9) */}
              <source src="/assets/clinicscribe-liquid-metal-cream.mp4" type="video/mp4" />
              {/* Poster fallback image */}
              <img
                src="/assets/clinicscribe-liquid-metal-poster.png"
                alt="ClinicScribe Logo Emblem"
                className="w-full h-full object-contain"
              />
            </video>

            {/* Static High-Res Poster Fallback for prefers-reduced-motion */}
            <img
              src="/assets/clinicscribe-liquid-metal-poster.png"
              alt="ClinicScribe Logo Emblem"
              className="w-full h-full object-contain hidden motion-reduce:block drop-shadow-md"
            />
          </>
        ) : (
          <img
            src="/assets/clinicscribe-icon-solid-1024.png"
            alt="ClinicScribe Brand Icon"
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-black ${textColor} ${currentSize.titleSize} font-sans tracking-tight`}
          style={{ letterSpacing: '-0.025em' }}
        >
          ClinicScribe
        </span>
        <span
          className={`font-bold ${taglineColor} ${currentSize.taglineSize} uppercase ${currentSize.tracking} mt-1`}
        >
          TURNING CONVERSATIONS INTO CARE
        </span>
      </div>
    </header>
  );
}

export default ClinicScribeHeader;

