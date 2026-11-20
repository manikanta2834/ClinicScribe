import React from 'react';
import Link from 'next/link';
import { ClinicScribeHeader } from '@/components/ClinicScribeHeader';

export const metadata = {
  title: 'ClinicScribe — Liquid Metal Warm Chrome Experience',
  description: 'Warm Chrome liquid metal animation for ClinicScribe header and social branding',
};

export default function LiquidMetalPage() {
  return (
    <main className="min-h-screen bg-[#FFF6E9] text-[#1C2E2A] flex flex-col items-center py-12 px-6 font-sans">
      <div className="w-full max-w-5xl flex flex-col items-center gap-10">
        
        {/* Top Header Lockup Showcase */}
        <div className="w-full flex flex-col items-center text-center gap-4 bg-white/70 backdrop-blur-md border border-[#075D55]/15 p-8 rounded-3xl shadow-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28C38] bg-[#F28C38]/10 px-3 py-1 rounded-full border border-[#F28C38]/20">
            Brand Header Lockup Preview
          </span>
          <ClinicScribeHeader size="lg" variant="cream" animated={true} />
          <p className="text-sm text-[#4B635E] max-w-xl">
            Polished Warm Chrome emblem featuring champagne-gold highlights, warm amber reflections, and cream speculars. Automatically switches to static high-res poster for users with <code className="bg-[#075D55]/10 px-1.5 py-0.5 rounded text-[#075D55] text-xs">prefers-reduced-motion</code>.
          </p>
        </div>

        {/* Video Formats Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Transparent WebM / Cream MP4 Web Loop */}
          <div className="flex flex-col items-center bg-white/80 border border-[#075D55]/15 p-6 rounded-3xl shadow-sm gap-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="font-extrabold text-lg text-[#075D55]">Web Hero / Header Loop</h2>
              <span className="text-xs font-bold bg-[#075D55]/10 text-[#075D55] px-2.5 py-0.5 rounded-full">60 fps • 0.3 MB</span>
            </div>
            
            <div className="w-72 h-72 flex items-center justify-center bg-[#FFF6E9] rounded-2xl border border-[#075D55]/10 overflow-hidden shadow-inner">
              <video
                className="w-64 h-64 object-contain"
                autoPlay
                loop
                muted
                playsInline
                poster="/assets/clinicscribe-liquid-metal-poster.png"
              >
                <source src="/assets/clinicscribe-liquid-metal-alpha.webm" type="video/webm" />
                <source src="/assets/clinicscribe-liquid-metal-cream.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="flex gap-2 w-full mt-2">
              <a
                href="/assets/clinicscribe-liquid-metal-alpha.webm"
                download
                className="flex-1 text-center py-2.5 px-3 bg-[#075D55] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#0A7268] transition"
              >
                Download WebM (Alpha)
              </a>
              <a
                href="/assets/clinicscribe-liquid-metal-cream.mp4"
                download
                className="flex-1 text-center py-2.5 px-3 bg-[#F28C38] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#E07A26] transition"
              >
                Download MP4 (Cream)
              </a>
            </div>
          </div>

          {/* Card 2: Social Formats (1080x1080 & 9:16) */}
          <div className="flex flex-col items-center bg-white/80 border border-[#075D55]/15 p-6 rounded-3xl shadow-sm gap-4">
            <div className="flex items-center justify-between w-full">
              <h2 className="font-extrabold text-lg text-[#075D55]">Social Media Formats</h2>
              <span className="text-xs font-bold bg-[#F28C38]/10 text-[#C86518] px-2.5 py-0.5 rounded-full">Feed & Story</span>
            </div>

            <div className="w-72 h-72 flex items-center justify-center gap-4 bg-[#FFF6E9] rounded-2xl border border-[#075D55]/10 p-3 overflow-hidden shadow-inner">
              {/* Square */}
              <div className="w-32 h-32 relative rounded-xl overflow-hidden border border-[#075D55]/15 shadow-sm">
                <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                  <source src="/assets/clinicscribe-liquid-metal-social-1080x1080.mp4" type="video/mp4" />
                </video>
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">1:1</span>
              </div>

              {/* Vertical 9:16 */}
              <div className="w-24 h-44 relative rounded-xl overflow-hidden border border-[#075D55]/15 shadow-sm">
                <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
                  <source src="/assets/clinicscribe-liquid-metal-social-9x16.mp4" type="video/mp4" />
                </video>
                <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">9:16</span>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-2">
              <a
                href="/assets/clinicscribe-liquid-metal-social-1080x1080.mp4"
                download
                className="flex-1 text-center py-2.5 px-3 bg-[#075D55] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#0A7268] transition"
              >
                1080x1080 MP4
              </a>
              <a
                href="/assets/clinicscribe-liquid-metal-social-9x16.mp4"
                download
                className="flex-1 text-center py-2.5 px-3 bg-[#075D55] text-white font-bold text-xs rounded-xl shadow-sm hover:bg-[#0A7268] transition"
              >
                9:16 Reel MP4
              </a>
            </div>
          </div>

        </div>

        {/* Interactive Studio Banner */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-[#075D55] to-[#0A7268] text-[#FFF6E9] p-8 rounded-3xl shadow-lg">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black">Interactive Warm Chrome Shader Studio</h3>
            <p className="text-sm text-[#D4EBE9] max-w-xl">
              Tweak all 10 shader parameters in real time, compare the Subtle / Balanced / Bold colorway variants, toggle background modes, and export custom loops.
            </p>
          </div>
          <Link
            href="/liquid-metal-studio.html"
            className="px-6 py-3.5 bg-[#F28C38] text-white font-bold rounded-2xl hover:bg-[#E07A26] transition shadow-md whitespace-nowrap"
          >
            Open Live Studio ↗
          </Link>
        </div>

      </div>
    </main>
  );
}

