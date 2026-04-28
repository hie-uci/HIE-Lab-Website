'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';

type ResearchVisualVariant = 'radar' | 'thz' | 'siggen' | 'ai' | 'device';

interface ResearchVisualProps {
  variant: ResearchVisualVariant;
  className?: string;
}

const pulseTransition = {
  duration: 3,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

function useSvgIds(prefix: string) {
  const id = useId().replace(/:/g, '');
  return {
    glow: `${prefix}-glow-${id}`,
    gradient: `${prefix}-gradient-${id}`,
    accent: `${prefix}-accent-${id}`,
    grid: `${prefix}-grid-${id}`,
  };
}

function RadarVisual() {
  const ids = useSvgIds('radar');
  const targets = [
    { cx: 44, cy: 38, delay: 0.2 },
    { cx: 66, cy: 58, delay: 0.9 },
    { cx: 36, cy: 66, delay: 1.4 },
  ];

  return (
    <svg viewBox="0 0 120 82" className="h-full w-full" role="img" aria-label="AI-style animated radar sensing visualization">
      <defs>
        <radialGradient id={ids.glow} cx="45%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ffd200" stopOpacity="0.9" />
          <stop offset="42%" stopColor="#38bdf8" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#00386d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.gradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="52%" stopColor="#528188" />
          <stop offset="100%" stopColor="#ffd200" />
        </linearGradient>
        <pattern id={ids.grid} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0v10" stroke="white" strokeOpacity="0.12" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="120" height="82" fill={`url(#${ids.grid})`} opacity="0.85" />
      <rect width="120" height="82" fill={`url(#${ids.glow})`} />
      <g transform="translate(60 48)">
        {[16, 27, 38].map((r, index) => (
          <motion.circle
            key={r}
            r={r}
            fill="none"
            stroke={`url(#${ids.gradient})`}
            strokeWidth="0.9"
            strokeDasharray="2.5 3.5"
            opacity="0.62"
            animate={{ scale: [0.92, 1.05, 0.92], opacity: [0.35, 0.8, 0.35] }}
            transition={{ ...pulseTransition, delay: index * 0.35 }}
          />
        ))}
        <motion.path
          d="M0 0 L34 -20"
          stroke="#ffd200"
          strokeWidth="1.6"
          strokeLinecap="round"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '0px 0px' }}
        />
        <circle r="3" fill="#ffd200" />
      </g>
      <path d="M8 70 C26 58 36 64 48 52 C60 40 73 48 88 31 C99 19 110 22 116 16" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
      {targets.map((target) => (
        <motion.g key={`${target.cx}-${target.cy}`} animate={{ opacity: [0.35, 1, 0.35] }} transition={{ ...pulseTransition, delay: target.delay }}>
          <circle cx={target.cx} cy={target.cy} r="2.4" fill="#ffd200" />
          <circle cx={target.cx} cy={target.cy} r="6.5" fill="none" stroke="#ffd200" strokeOpacity="0.55" strokeWidth="0.8" />
        </motion.g>
      ))}
    </svg>
  );
}

function THzVisual() {
  const ids = useSvgIds('thz');
  const waves = [
    'M6 46 C16 20 26 20 36 46 S56 72 66 46 S86 20 96 46 S110 70 118 42',
    'M4 54 C16 32 28 32 40 54 S64 76 76 54 S100 32 116 54',
  ];

  return (
    <svg viewBox="0 0 120 82" className="h-full w-full" role="img" aria-label="AI-style animated terahertz energy visualization">
      <defs>
        <radialGradient id={ids.glow} cx="58%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#ffd200" stopOpacity="0.95" />
          <stop offset="38%" stopColor="#38bdf8" stopOpacity="0.36" />
          <stop offset="100%" stopColor="#203043" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.gradient} x1="0" x2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="45%" stopColor="#ffd200" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
      <rect width="120" height="82" fill={`url(#${ids.glow})`} />
      <g opacity="0.28">
        {Array.from({ length: 8 }).map((_, index) => (
          <line key={index} x1={14 + index * 12} y1="10" x2={5 + index * 12} y2="78" stroke="white" strokeWidth="0.6" />
        ))}
      </g>
      {waves.map((path, index) => (
        <motion.path
          key={path}
          d={path}
          fill="none"
          stroke={`url(#${ids.gradient})`}
          strokeWidth={index === 0 ? 2.1 : 1.1}
          strokeLinecap="round"
          strokeDasharray={index === 0 ? '0 0' : '4 5'}
          animate={{ pathLength: [0.2, 1, 0.2], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 3.2 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        />
      ))}
      <motion.g animate={{ y: [0, -4, 0] }} transition={pulseTransition}>
        <rect x="45" y="27" width="30" height="28" rx="6" fill="#0f2742" fillOpacity="0.75" stroke="#7dd3fc" strokeOpacity="0.55" />
        <path d="M51 41h18M60 32v18M51 48h18M52 35h16" stroke="#ffd200" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
      </motion.g>
      {[
        [24, 24],
        [96, 30],
        [31, 62],
        [88, 61],
      ].map(([cx, cy], index) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2"
          fill="#ffd200"
          animate={{ scale: [0.8, 1.8, 0.8], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.35 }}
        />
      ))}
    </svg>
  );
}

function SignalVisual() {
  const ids = useSvgIds('siggen');

  return (
    <svg viewBox="0 0 120 82" className="h-full w-full" role="img" aria-label="AI-style animated signal generation visualization">
      <defs>
        <linearGradient id={ids.gradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="48%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffd200" />
        </linearGradient>
        <radialGradient id={ids.glow} cx="35%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#00386d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="120" height="82" fill={`url(#${ids.glow})`} />
      <g stroke="white" strokeOpacity="0.16" strokeWidth="0.6">
        <path d="M10 18h100M10 34h100M10 50h100M10 66h100" />
        <path d="M20 10v64M44 10v64M68 10v64M92 10v64" />
      </g>
      <motion.path
        d="M4 45 C12 16 22 16 30 45 S48 74 56 45 S74 16 82 45 S102 74 116 36"
        fill="none"
        stroke={`url(#${ids.gradient})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        animate={{ pathOffset: [0, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
      />
      <motion.path
        d="M11 58 C25 54 34 63 48 55 C60 48 70 57 84 49 C97 42 104 48 114 38"
        fill="none"
        stroke="#ffd200"
        strokeWidth="1"
        strokeDasharray="3 4"
        strokeLinecap="round"
        animate={{ opacity: [0.25, 0.75, 0.25] }}
        transition={pulseTransition}
      />
      <g transform="translate(62 42)">
        {[9, 16, 23].map((r, index) => (
          <motion.circle
            key={r}
            r={r}
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="0.8"
            strokeDasharray="2 4"
            animate={{ rotate: [0, index % 2 ? -360 : 360], opacity: [0.25, 0.8, 0.25] }}
            transition={{ duration: 5 + index, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '0px 0px' }}
          />
        ))}
      </g>
    </svg>
  );
}

function AIVisual() {
  const ids = useSvgIds('ai');
  const nodes = [
    [23, 23],
    [45, 18],
    [65, 34],
    [86, 20],
    [96, 55],
    [62, 62],
    [33, 56],
  ];
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 5],
    [4, 5],
    [5, 6],
    [0, 6],
    [3, 4],
  ];

  return (
    <svg viewBox="0 0 120 82" className="h-full w-full" role="img" aria-label="AI-style animated analog RF design visualization">
      <defs>
        <linearGradient id={ids.gradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="55%" stopColor="#528188" />
          <stop offset="100%" stopColor="#ffd200" />
        </linearGradient>
        <radialGradient id={ids.glow} cx="58%" cy="48%" r="68%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#203043" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="120" height="82" fill={`url(#${ids.glow})`} />
      <path d="M9 18h22v-8h25v14h16v-8h37M8 64h18v-13h27v9h25v-17h34" fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="1.2" />
      {links.map(([a, b], index) => {
        const [x1, y1] = nodes[a];
        const [x2, y2] = nodes[b];
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={`url(#${ids.gradient})`}
            strokeWidth="1.2"
            strokeOpacity="0.75"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.18 }}
          />
        );
      })}
      {nodes.map(([cx, cy], index) => (
        <motion.g key={`${cx}-${cy}`} animate={{ scale: [1, 1.22, 1] }} transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.16 }} style={{ transformOrigin: `${cx}px ${cy}px` }}>
          <circle cx={cx} cy={cy} r="4.2" fill="#07111f" stroke="#7dd3fc" strokeWidth="1.1" />
          <circle cx={cx} cy={cy} r="1.5" fill="#ffd200" />
        </motion.g>
      ))}
      <motion.rect
        x="42"
        y="31"
        width="36"
        height="22"
        rx="5"
        fill="#0f2742"
        fillOpacity="0.65"
        stroke="#ffffff"
        strokeOpacity="0.22"
        animate={{ opacity: [0.65, 0.95, 0.65] }}
        transition={pulseTransition}
      />
    </svg>
  );
}

function DeviceVisual() {
  const ids = useSvgIds('device');
  const cells = Array.from({ length: 20 }, (_, index) => ({
    x: 18 + (index % 5) * 17,
    y: 17 + Math.floor(index / 5) * 13,
  }));

  return (
    <svg viewBox="0 0 120 82" className="h-full w-full" role="img" aria-label="AI-style animated emerging device visualization">
      <defs>
        <linearGradient id={ids.gradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffd200" />
          <stop offset="48%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#528188" />
        </linearGradient>
        <radialGradient id={ids.glow} cx="50%" cy="45%" r="72%">
          <stop offset="0%" stopColor="#ffd200" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#00386d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="120" height="82" fill={`url(#${ids.glow})`} />
      <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
        <path d="M14 52 L43 36 L72 52 L43 68 Z" fill="#ffd200" fillOpacity="0.18" stroke="#ffd200" strokeOpacity="0.55" />
        <path d="M48 29 L78 13 L107 29 L78 45 Z" fill="#7dd3fc" fillOpacity="0.16" stroke="#7dd3fc" strokeOpacity="0.48" />
        <path d="M24 24 L52 9 L80 24 L52 40 Z" fill="#528188" fillOpacity="0.22" stroke="#ffffff" strokeOpacity="0.26" />
      </motion.g>
      {cells.map((cell, index) => (
        <motion.circle
          key={`${cell.x}-${cell.y}`}
          cx={cell.x}
          cy={cell.y}
          r="1.5"
          fill={index % 3 === 0 ? '#ffd200' : '#7dd3fc'}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.08 }}
        />
      ))}
      <g transform="translate(78 44)">
        <motion.ellipse
          rx="26"
          ry="10"
          fill="none"
          stroke={`url(#${ids.gradient})`}
          strokeWidth="1"
          strokeDasharray="4 3"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '0px 0px' }}
        />
        <motion.ellipse
          rx="10"
          ry="26"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="0.8"
          strokeDasharray="3 4"
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '0px 0px' }}
        />
        <circle r="4" fill="#ffd200" fillOpacity="0.8" />
      </g>
    </svg>
  );
}

const visualMap: Record<ResearchVisualVariant, () => React.JSX.Element> = {
  radar: RadarVisual,
  thz: THzVisual,
  siggen: SignalVisual,
  ai: AIVisual,
  device: DeviceVisual,
};

export default function ResearchVisual({ variant, className = '' }: ResearchVisualProps) {
  const Visual = visualMap[variant];

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(135deg,rgba(0,56,109,0.96),rgba(9,14,23,0.96))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:24px_24px] opacity-55" />
      <div className="absolute inset-0">
        <Visual />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07111f] to-transparent" />
    </div>
  );
}
