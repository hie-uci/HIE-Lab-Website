'use client';

import Image from 'next/image';

const chipImages = [
  '/images/chips/individual/sheet1-01-pmcw-radar.png',
  '/images/chips/individual/sheet1-02-low-noise-76-82-ghz-vco.png',
  '/images/chips/individual/sheet1-03-110-143-ghz-pa-in-65nm-cmos.png',
  '/images/chips/individual/sheet1-04-49-63-ghz-fmcw-radar.png',
  '/images/chips/individual/sheet1-05-3.1-4.7-ghz-class-d-vco.png',
  '/images/chips/individual/sheet1-06-174-232-ghz-sige-vco.png',
  '/images/chips/individual/sheet2-01-23-27-and-69-81-ghz-mimo-fmcw-radar.png',
  '/images/chips/individual/sheet2-02-monostatic-50-60-ghz-fmcw-radar.png',
  '/images/chips/individual/sheet2-0.32-thz-sige-transmitter.png',
  '/images/chips/individual/sheet2-0.48-thz-frequency-doubler.png',
  '/images/chips/individual/sheet2-0.92-thz-sige-quadrupler.png',
  '/images/chips/individual/sheet2-4-channel-tia-for-mems-pnt.png',
  '/images/chips/individual/sheet3-01-0.1-6-ghz-negative-l-circuit.png',
  '/images/chips/individual/sheet3-02-90-ghz-efficient-oscillator.png',
];

/* Split into two rows: first 7 chips for row 1, last 7 for row 2 */
const row1 = chipImages.slice(0, 7);
const row2 = chipImages.slice(7);

export default function ChipMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />

      {/* Row 1 — scrolls left */}
      <div
        className="flex gap-4 mb-4 hover:[animation-play-state:paused]"
        style={{
          animation: 'marquee-left 30s linear infinite',
          width: 'max-content',
        }}
      >
        {[...row1, ...row1].map((src, i) => (
          <div
            key={`r1-${i}`}
            className="flex-shrink-0 w-[160px] h-[120px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm"
          >
            <Image
              src={src}
              alt="HIE Lab chip die photo"
              width={160}
              height={120}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Row 2 — scrolls right */}
      <div
        className="flex gap-4 hover:[animation-play-state:paused]"
        style={{
          animation: 'marquee-right 30s linear infinite',
          width: 'max-content',
        }}
      >
        {[...row2, ...row2].map((src, i) => (
          <div
            key={`r2-${i}`}
            className="flex-shrink-0 w-[160px] h-[120px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm"
          >
            <Image
              src={src}
              alt="HIE Lab chip die photo"
              width={160}
              height={120}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
