'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import CircuitBackground from '@/components/CircuitBackground';
import GradientMesh from '@/components/GradientMesh';
import AnimatedResearchIcon from '@/components/AnimatedResearchIcon';
import WaveformDivider from '@/components/WaveformDivider';
import SectionHeader from "@/components/SectionHeader";
import ParticleField from "@/components/ParticleField";
import ChipMarquee from '@/components/ChipMarquee';

/* ──────────────────────────── helpers ──────────────────────────── */

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 40, stiffness: 100 });

  useEffect(() => {
    if (inView) {
      animate(motionVal, target, { duration: 2, ease: 'easeOut' });
    }
  }, [inView, motionVal, target]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v) + suffix;
    });
    return unsub;
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ──────────────────────────── data ──────────────────────────── */

const stats = [
  { value: 50, suffix: '+', label: 'Publications' },
  { value: 9, suffix: '', label: 'Active Members' },
  { value: 8, suffix: '', label: 'Awards & Honors' },
];

const researchAreas: { title: string; description: string; iconVariant: 'radar' | 'thz' | 'siggen' | 'ai' | 'device'; gradient: string }[] = [
  {
    title: 'Multi-Band mm-Wave Radars',
    description: 'Phase-frequency-locked radar architectures for vital signs monitoring, human-robot interaction, and 3D defect detection.',
    iconVariant: 'radar',
    gradient: 'from-[#0064a4] to-[#00386d]',
  },
  {
    title: 'Sub-THz & THz Power Generation',
    description: 'Breaking transistor frequency limits with Volterra-Weiner theory-based design methodology across MOSFET, BJT, HBT, and HEMT.',
    iconVariant: 'thz',
    gradient: 'from-[#203043] to-[#528188]',
  },
  {
    title: 'Wideband Signal Generation',
    description: 'Novel oscillator structures overcoming phase-noise degradation for mm-wave and THz communications and sensing.',
    iconVariant: 'siggen',
    gradient: 'from-[#00386d] to-[#528188]',
  },
  {
    title: 'AI-Driven Analog/RF Design',
    description: 'Layout-aware ML pipelines, graph-based predictors, and attention-guided beam control for radar and circuit synthesis.',
    iconVariant: 'ai',
    gradient: 'from-[#0064a4] via-[#203043] to-[#528188]',
  },
  {
    title: 'Emerging Device Technologies',
    description: 'All-spin-logic smart detector cells and Janus 2D material tunneling FETs with sub-60 mV/dec switching.',
    iconVariant: 'device',
    gradient: 'from-[#528188] to-[#00386d]',
  },
];

const newsItems = [
  {
    date: 'Oct 2025',
    text: "Hedayat's RWW paper selected as finalist for best student paper award.",
    tag: 'Award',
  },
  {
    date: 'Sep 2025',
    text: 'Xuyang successfully defends his PhD dissertation. Congratulations, Dr. Liu!',
    tag: 'Milestone',
  },
  {
    date: 'Sep 2025',
    text: 'IEEE Radar Conference paper by Allen and Xuyang nominated in top 5 for best student paper.',
    tag: 'Award',
  },
  {
    date: 'Apr 2025',
    text: 'FALCON accepted to NeurIPS 2025 -- bridging AI and analog circuit design.',
    tag: 'Publication',
  },
];

const venues = ['JSSC', 'ISSCC', 'NeurIPS', 'Nature Comm.', 'RFIC', 'ESSCIRC', 'TCAS'];

/* ──────────────────────────── component ──────────────────────────── */

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <main className="overflow-hidden">
      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-warm via-white to-white">
        {/* Background layers */}
        <CircuitBackground className="opacity-40" density={55} interactive />
        <ParticleField className="opacity-30 z-[2]" />
        <GradientMesh />

        {/* Floating chip die photos — decorative background mosaic */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          {/* Top-left cluster */}
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet1-01-pmcw-radar.png" alt="" width={240} height={240} unoptimized
            className="absolute top-[6%] left-[3%] opacity-[0.16] blur-[0.5px] rotate-[-8deg]" />
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet1-05-3.1-4.7-ghz-class-d-vco.png" alt="" width={160} height={160} unoptimized
            className="absolute top-[22%] left-[12%] opacity-[0.12] blur-[1px] rotate-[5deg]" />

          {/* Top-right cluster */}
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet1-06-174-232-ghz-sige-vco.png" alt="" width={200} height={200} unoptimized
            className="absolute top-[4%] right-[6%] opacity-[0.15] blur-[0.5px] rotate-[12deg]" />
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet2-01-23-27-and-69-81-ghz-mimo-fmcw-radar.png" alt="" width={170} height={170} unoptimized
            className="absolute top-[18%] right-[18%] opacity-[0.11] blur-[1px] rotate-[-4deg]" />

          {/* Middle-left */}
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet1-03-110-143-ghz-pa-in-65nm-cmos.png" alt="" width={190} height={190} unoptimized
            className="absolute top-[42%] left-[2%] opacity-[0.14] blur-[0.5px] rotate-[3deg]" />
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet3-02-90-ghz-efficient-oscillator.png" alt="" width={140} height={140} unoptimized
            className="absolute top-[55%] left-[14%] opacity-[0.10] blur-[1.5px] rotate-[-10deg]" />

          {/* Middle-right */}
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet1-02-low-noise-76-82-ghz-vco.png" alt="" width={210} height={210} unoptimized
            className="absolute top-[38%] right-[3%] opacity-[0.16] blur-[0.5px] rotate-[-5deg]" />
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet2-4-channel-tia-for-mems-pnt.png" alt="" width={150} height={150} unoptimized
            className="absolute top-[52%] right-[16%] opacity-[0.11] blur-[1px] rotate-[7deg]" />

          {/* Bottom-left */}
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet2-0.48-thz-frequency-doubler.png" alt="" width={180} height={180} unoptimized
            className="absolute bottom-[18%] left-[6%] opacity-[0.13] blur-[1px] rotate-[9deg]" />

          {/* Bottom-right cluster */}
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet2-0.32-thz-sige-transmitter.png" alt="" width={260} height={260} unoptimized
            className="absolute bottom-[8%] right-[5%] opacity-[0.18] blur-[0.3px] rotate-[6deg]" />
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet1-04-49-63-ghz-fmcw-radar.png" alt="" width={150} height={150} unoptimized
            className="absolute bottom-[25%] right-[22%] opacity-[0.10] blur-[1.5px] rotate-[-12deg]" />

          {/* Center-bottom accent */}
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet2-02-monostatic-50-60-ghz-fmcw-radar.png" alt="" width={170} height={170} unoptimized
            className="absolute bottom-[12%] left-[38%] opacity-[0.09] blur-[1.5px] rotate-[3deg]" />
          <Image src="/HIE-Lab-Website/images/chips/individual/sheet2-0.92-thz-sige-quadrupler.png" alt="" width={130} height={130} unoptimized
            className="absolute bottom-[30%] left-[28%] opacity-[0.08] blur-[2px] rotate-[-6deg]" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20"
        >
          {/* UCI Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-uci-blue/10 shadow-sm mb-8"
          >
            <Image
              src="/HIE-Lab-Website/images/logo/hie-logo.png"
              alt="HIE Lab Logo"
              width={28}
              height={28}
              className="rounded-full"
            />
            <a href="https://engineering.uci.edu/dept/eecs" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-eng-blue hover:text-uci-blue transition-colors">UC Irvine EECS</a>
            <div className="w-1 h-1 rounded-full bg-uci-gold" />
            <a href="https://engineering.uci.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-eecs-teal hover:text-uci-blue transition-colors">Samueli School of Engineering</a>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span className="gradient-text">High-speed Integrated</span>
            <br />
            <span className="gradient-text">Electronics Laboratory</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Pioneering mm-wave and terahertz electronic circuits and systems
            for next-generation sensing, imaging, and communications.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/research"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-uci-blue to-eng-blue text-white font-semibold rounded-xl shadow-lg shadow-uci-blue/25 hover:shadow-xl hover:shadow-uci-blue/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Research
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact#positions"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-eng-blue font-semibold rounded-xl border border-eng-blue/15 shadow-sm hover:shadow-md hover:border-uci-blue/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Join Our Team
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate={mounted ? 'visible' : 'hidden'}
            variants={stagger}
            className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i + 10}
                whileHover={{ boxShadow: '0 0 20px rgba(0, 100, 164, 0.3), 0 0 60px rgba(0, 100, 164, 0.1)' }}
                className="relative p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 shadow-sm transition-shadow"
              >
                <div className="text-3xl sm:text-4xl font-bold text-eng-blue mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border-2 border-gray-300 flex items-start justify-center p-1"
          >
            <motion.div className="w-1 h-2 rounded-full bg-uci-blue" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ ABOUT ═══════ */}
      <section className="relative py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="About the Lab"
            title="Designing the Future of High-Frequency Electronics"
            subtitle="We design, implement, and test mm-wave and terahertz electronic circuits and systems -- pushing the boundaries of what silicon can achieve."
          />

          <div className="mt-16 grid lg:grid-cols-5 gap-10 items-start">
            {/* PI Spotlight */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2"
            >
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-eng-blue to-navy text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-uci-gold/20 to-transparent rounded-bl-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                      <Image
                        src="/HIE-Lab-Website/images/members/pi-aghasi.jpeg"
                        alt="Prof. Hamidreza Aghasi"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Prof. Hamidreza Aghasi</h3>
                      <p className="text-sm text-white/70">Assistant Professor, EECS</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-white/80 leading-relaxed">
                    <p>Principal Investigator of the HIE Lab at UC Irvine, specializing in mm-wave/THz integrated circuits and AI-driven design methodologies.</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Cornell PhD', 'NSF CAREER 2025', 'IEEE Sr. Member'].map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/15 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Research themes */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="lg:col-span-3 grid sm:grid-cols-2 gap-4"
            >
              {[
                {
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12h4l3-9 4 18 3-9h4" />
                    </svg>
                  ),
                  label: 'mm-Wave & THz Circuits',
                  desc: 'Signal generation beyond transistor limits',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 5V3M12 21v-2M5 12H3M21 12h-2" />
                      <path d="M7.05 7.05 5.64 5.64M18.36 18.36l-1.41-1.41M7.05 16.95l-1.41 1.41M18.36 5.64l-1.41 1.41" />
                    </svg>
                  ),
                  label: 'Radar & Sensing',
                  desc: 'Vital signs, imaging, chemical detection',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11h3a3 3 0 0 1 3 3v1.5a2.5 2.5 0 0 1-5 0V14H9v1.5a2.5 2.5 0 0 1-5 0V14a3 3 0 0 1 3-3h3V9.5A4 4 0 0 1 12 2z" />
                      <circle cx="12" cy="19.5" r="2.5" />
                      <path d="M12 17v-3" />
                    </svg>
                  ),
                  label: 'AI + Circuit Design',
                  desc: 'ML-driven layout-aware synthesis',
                },
                {
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ),
                  label: 'Emerging Devices',
                  desc: 'Spin-logic, 2D materials, tunneling FETs',
                },
              ].map((theme, i) => (
                <motion.div
                  key={theme.label}
                  variants={fadeUp}
                  custom={i}
                  className="group p-5 rounded-xl border border-gray-100 bg-slate-warm hover:border-uci-blue/20 hover:shadow-lg hover:shadow-uci-blue/5 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-uci-blue/10 to-eecs-teal/10 flex items-center justify-center text-uci-blue mb-3 group-hover:from-uci-blue/20 group-hover:to-eecs-teal/20 transition-colors">
                    {theme.icon}
                  </div>
                  <h4 className="font-semibold text-eng-blue mb-1">{theme.label}</h4>
                  <p className="text-sm text-gray-500">{theme.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ SILICON SHOWCASE ═══════ */}
      <section className="relative py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Silicon Showcase"
            title="Our Fabricated Chips"
            subtitle="A selection of integrated circuits designed and fabricated by the HIE Lab -- from mm-wave radars to THz transmitters."
          />
          <div className="mt-10">
            <ChipMarquee />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link
              href="/chip-gallery"
              className="inline-flex items-center gap-2 text-sm font-medium text-uci-blue hover:text-eng-blue transition-colors animated-underline"
            >
              View full chip gallery
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <WaveformDivider color="blue" />

      {/* ═══════ RESEARCH HIGHLIGHTS ═══════ */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white via-slate-warm to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Research"
            title="Research Highlights"
            subtitle="Five active research thrusts spanning circuit innovation, system design, and computational intelligence."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
          >
            {researchAreas.map((area, i) => (
              <motion.div
                key={area.title}
                variants={fadeUp}
                custom={i}
                whileHover={{
                  boxShadow: '0 0 30px rgba(0, 100, 164, 0.2), 0 0 80px rgba(0, 100, 164, 0.06)',
                  y: -8,
                }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`group relative rounded-2xl bg-white border border-gray-100 hover:border-uci-blue/25 overflow-hidden transition-colors duration-500 ${
                  i === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-uci-blue via-uci-gold to-eecs-teal opacity-30 blur-sm" />
                </div>

                {/* Number badge */}
                <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xs font-bold text-white/80 border border-white/20">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Gradient icon banner */}
                <div className={`relative w-full h-44 bg-gradient-to-br ${area.gradient} flex items-center justify-center overflow-hidden`}>
                  {/* Animated dot grid overlay */}
                  <div className="absolute inset-0 opacity-[0.07]">
                    <svg width="100%" height="100%">
                      <pattern id={`dots-${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="10" cy="10" r="1" fill="white" />
                      </pattern>
                      <rect width="100%" height="100%" fill={`url(#dots-${i})`} />
                    </svg>
                  </div>
                  {/* Animated radial glow */}
                  <div className="absolute w-40 h-40 rounded-full bg-white/10 blur-3xl group-hover:bg-white/15 group-hover:scale-125 transition-all duration-700" />
                  {/* Scan line effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{ animation: 'scan-line 2s ease-in-out infinite' }} />
                  </div>
                  <div className="relative text-white/90 [&>div]:!text-inherit group-hover:scale-110 transition-transform duration-500">
                    <AnimatedResearchIcon variant={area.iconVariant} className="w-16 h-16 drop-shadow-lg" />
                  </div>
                </div>

                <div className="p-6 relative">
                  <h3 className="text-lg font-bold text-eng-blue mb-2 group-hover:text-uci-blue transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{area.description}</p>
                  <Link
                    href="/research"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-uci-blue opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  >
                    Learn more
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ LATEST NEWS ═══════ */}
      <section className="relative py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="News"
            title="Latest News"
            subtitle="Recent highlights and achievements from the HIE Lab."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="max-w-3xl mx-auto space-y-4"
          >
            {newsItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="group flex gap-5 p-5 rounded-xl border border-gray-100 bg-white hover:border-uci-blue/15 hover:shadow-md transition-all duration-300"
              >
                <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-uci-blue/5 to-eecs-teal/5 border border-uci-blue/10">
                  <span className="text-[11px] font-bold text-uci-blue uppercase leading-tight">{item.date.split(' ')[0]}</span>
                  <span className="text-xs text-gray-400">{item.date.split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.tag === 'Award'
                        ? 'bg-uci-gold/15 text-yellow-700'
                        : item.tag === 'Milestone'
                        ? 'bg-eecs-teal/10 text-eecs-teal'
                        : 'bg-uci-blue/10 text-uci-blue'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10"
          >
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-medium text-uci-blue hover:text-eng-blue transition-colors animated-underline"
            >
              View all news
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <WaveformDivider color="gold" />

      {/* ═══════ PUBLICATIONS HIGHLIGHT ═══════ */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-slate-warm to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,100,164,0.04),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Publications"
            title="Impactful Research Output"
            subtitle="Our work is published in the most prestigious venues in electronics and computer science."
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="inline-block mb-10"
          >
            <div className="text-7xl sm:text-8xl lg:text-9xl font-bold gradient-text leading-none">
              <AnimatedCounter target={50} suffix="+" />
            </div>
            <p className="text-lg text-gray-500 mt-2">Peer-Reviewed Publications</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {venues.map((venue, i) => (
              <motion.span
                key={venue}
                variants={fadeUp}
                custom={i}
                className="px-5 py-2.5 rounded-xl bg-white border border-gray-100 text-sm font-semibold text-eng-blue shadow-sm hover:border-uci-blue/20 hover:shadow-md transition-all duration-300"
              >
                {venue}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-eng-blue font-semibold rounded-xl border border-eng-blue/15 shadow-sm hover:shadow-md hover:border-uci-blue/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Browse All Publications
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════ JOIN US CTA ═══════ */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-eng-blue via-navy to-eng-blue overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-uci-blue/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-uci-gold/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <pattern id="cta-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>

        {/* Floating chip die photos — decorative CTA background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Image
            src="/HIE-Lab-Website/images/chips/individual/sheet1-04-49-63-ghz-fmcw-radar.png"
            alt=""
            width={240}
            height={240}
            unoptimized
            className="absolute top-[8%] left-[3%] opacity-[0.07] blur-sm rotate-[-10deg]"
          />
          <Image
            src="/HIE-Lab-Website/images/chips/individual/sheet2-0.92-thz-sige-quadrupler.png"
            alt=""
            width={220}
            height={220}
            unoptimized
            className="absolute bottom-[6%] right-[4%] opacity-[0.06] blur-sm rotate-[8deg]"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-white/80 border border-white/15 mb-6">
              Open Positions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              Join the HIE Lab
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              We are looking for passionate and talented researchers at all levels --
              PhD students, MS students, and undergraduate researchers -- to push the
              boundaries of high-speed electronics.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact#positions"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-uci-gold text-eng-blue font-bold rounded-xl shadow-lg shadow-uci-gold/20 hover:shadow-xl hover:shadow-uci-gold/30 transition-all duration-300 hover:-translate-y-0.5 hover:glow-gold"
              >
                View Open Positions
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
