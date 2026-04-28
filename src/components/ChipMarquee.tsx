'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

const chipImages = [
  { src: '/images/chips/individual/sheet1-01-pmcw-radar.png', name: 'PMCW Radar' },
  { src: '/images/chips/individual/sheet1-02-low-noise-76-82-ghz-vco.png', name: '76-82 GHz VCO' },
  { src: '/images/chips/individual/sheet1-03-110-143-ghz-pa-in-65nm-cmos.png', name: '110-143 GHz PA' },
  { src: '/images/chips/individual/sheet1-04-49-63-ghz-fmcw-radar.png', name: '49-63 GHz FMCW Radar' },
  { src: '/images/chips/individual/sheet1-05-3.1-4.7-ghz-class-d-vco.png', name: '3.1-4.7 GHz Class-D VCO' },
  { src: '/images/chips/individual/sheet1-06-174-232-ghz-sige-vco.png', name: '174-232 GHz SiGe VCO' },
  { src: '/images/chips/individual/sheet2-01-23-27-and-69-81-ghz-mimo-fmcw-radar.png', name: '23-27/69-81 GHz MIMO FMCW' },
  { src: '/images/chips/individual/sheet2-02-monostatic-50-60-ghz-fmcw-radar.png', name: '50-60 GHz FMCW Radar' },
  { src: '/images/chips/individual/sheet2-0.32-thz-sige-transmitter.png', name: '0.32 THz SiGe Tx' },
  { src: '/images/chips/individual/sheet2-0.48-thz-frequency-doubler.png', name: '0.48 THz Freq. Doubler' },
  { src: '/images/chips/individual/sheet2-0.92-thz-sige-quadrupler.png', name: '0.92 THz Quadrupler' },
  { src: '/images/chips/individual/sheet2-4-channel-tia-for-mems-pnt.png', name: '4-Ch TIA for MEMS PNT' },
  { src: '/images/chips/individual/sheet3-01-0.1-6-ghz-negative-l-circuit.png', name: '0.1-6 GHz Negative-L' },
  { src: '/images/chips/individual/sheet3-02-90-ghz-efficient-oscillator.png', name: '90 GHz Oscillator' },
];

const row1 = chipImages.slice(0, 7);
const row2 = chipImages.slice(7);

function ChipCard({ chip, onClick }: { chip: typeof chipImages[0]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex-shrink-0 w-[160px] h-[120px] rounded-xl overflow-hidden border border-uci-blue/10 bg-white/70 shadow-[0_10px_24px_rgba(0,56,109,0.08)] cursor-zoom-in group relative transition-all duration-300 hover:shadow-[0_16px_38px_rgba(0,100,164,0.18)] hover:border-uci-blue/30 hover:scale-105 dark:border-white/10 dark:bg-slate-950/65 dark:shadow-[0_0_28px_rgba(56,189,248,0.08)] dark:hover:shadow-[0_0_34px_rgba(56,189,248,0.18)]"
    >
      <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(135deg,rgba(255,255,255,0.26),transparent_38%,rgba(0,100,164,0.08))] opacity-80 mix-blend-screen dark:bg-[linear-gradient(135deg,rgba(125,211,252,0.18),transparent_40%,rgba(255,210,0,0.10))]" />
      <Image
        src={chip.src}
        alt={`HIE Lab chip: ${chip.name}`}
        width={160}
        height={120}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        unoptimized
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-eng-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
        <span className="text-[10px] font-semibold text-white/90 tracking-wide">{chip.name}</span>
      </div>
    </button>
  );
}

export default function ChipMarquee() {
  const [lightbox, setLightbox] = useState<{ open: boolean; src: string; name: string }>({
    open: false, src: '', name: '',
  });

  return (
    <>
      <div className="chip-marquee relative w-full overflow-hidden rounded-2xl py-5 sm:py-6">
        <div className="chip-marquee-edge chip-marquee-edge-left" aria-hidden="true" />
        <div className="chip-marquee-edge chip-marquee-edge-right" aria-hidden="true" />
        <div className="chip-marquee-stream chip-marquee-stream-left top-[18%]" />
        <div className="chip-marquee-stream chip-marquee-stream-right top-[38%]" />
        <div className="chip-marquee-stream chip-marquee-stream-left top-[62%]" />
        <div className="chip-marquee-stream chip-marquee-stream-right top-[82%]" />

        {/* Row 1 — scrolls left */}
        <div className="chip-marquee-row relative z-10 mb-4">
          <div
            className="chip-marquee-track flex gap-4 hover:[animation-play-state:paused]"
            style={{
              animation: 'marquee-left 30s linear infinite',
              width: 'max-content',
            }}
          >
            {[...row1, ...row1].map((chip, i) => (
              <ChipCard
                key={`r1-${i}`}
                chip={chip}
                onClick={() => setLightbox({ open: true, src: chip.src, name: chip.name })}
              />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="chip-marquee-row relative z-10">
          <div
            className="chip-marquee-track flex gap-4 hover:[animation-play-state:paused]"
            style={{
              animation: 'marquee-right 30s linear infinite',
              width: 'max-content',
            }}
          >
            {[...row2, ...row2].map((chip, i) => (
              <ChipCard
                key={`r2-${i}`}
                chip={chip}
                onClick={() => setLightbox({ open: true, src: chip.src, name: chip.name })}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        isOpen={lightbox.open}
        onClose={() => setLightbox({ open: false, src: '', name: '' })}
        src={lightbox.src}
        alt={`HIE Lab chip: ${lightbox.name}`}
        title={lightbox.name}
      />
    </>
  );
}
