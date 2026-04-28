'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionHeader from '@/components/SectionHeader';
import CircuitBackground from '@/components/CircuitBackground';
import WaveformDivider from '@/components/WaveformDivider';

type Category = 'award' | 'defense' | 'publication' | 'conference' | 'milestone';

interface NewsItem {
  date: string;
  month: number;
  year: number;
  title: string;
  category: Category;
}

const newsItems: NewsItem[] = [
  // 2025
  { date: 'Oct 2025', month: 10, year: 2025, title: "Hedayat's IEEE RWW paper among finalists for best student paper award", category: 'award' },
  { date: 'Sep 2025', month: 9, year: 2025, title: 'Xuyang successfully defends his Ph.D. dissertation', category: 'defense' },
  { date: 'Sep 2025', month: 9, year: 2025, title: 'IEEE Radar Conference paper top 5 nominated for best student paper award (Allen and Xuyang)', category: 'award' },
  { date: 'Jul 2025', month: 7, year: 2025, title: 'Mahdi presented two articles at IEEE APS 2025', category: 'conference' },
  { date: 'Apr 2025', month: 4, year: 2025, title: 'FALCON accepted to NeurIPS 2025', category: 'milestone' },
  { date: 'Feb 2025', month: 2, year: 2025, title: "Xuyang's JSSC paper on phase-locked radar transceiver published", category: 'publication' },
  { date: 'Feb 2025', month: 2, year: 2025, title: 'Sub-THz communication paper published in Nature Communications Engineering', category: 'publication' },
  // 2024
  { date: 'Dec 2024', month: 12, year: 2024, title: "Behnam's TCAS-I paper on low-noise mm-wave VCOs published", category: 'publication' },
  { date: 'Oct 2024', month: 10, year: 2024, title: "Xuyang's TCAS-II paper on ultra-low-power Class-D VCOs published", category: 'publication' },
  { date: 'Sep 2024', month: 9, year: 2024, title: 'Behnam successfully defends his Ph.D. dissertation', category: 'defense' },
  { date: 'Jun 2024', month: 6, year: 2024, title: "Amin's NeurIPS ML4PS Workshop paper received Reproducibility Award", category: 'award' },
  { date: 'Mar 2024', month: 3, year: 2024, title: 'Xuyang and Hedayat advanced to doctoral candidacy', category: 'milestone' },
  // 2023
  { date: 'Oct 2023', month: 10, year: 2023, title: "Behnam's TCAS-I publication on mm-wave VCO design", category: 'publication' },
  { date: 'Jul 2023', month: 7, year: 2023, title: "Amin's IEEE MWTL paper on hybrid CMOS-polyimide force-sensing array published", category: 'publication' },
  { date: 'Mar 2023', month: 3, year: 2023, title: 'Hedayat receives IEEE MTT-S Pre-Doctoral Fellowship', category: 'award' },
  { date: 'Feb 2023', month: 2, year: 2023, title: "Hedayat's broadband terahertz antenna paper published in IEEE Access", category: 'publication' },
  { date: 'Jan 2023', month: 1, year: 2023, title: 'Collaborative paper with FIU accepted in IEEE TAP', category: 'publication' },
  // 2022
  { date: 'Dec 2022', month: 12, year: 2022, title: 'MFLEX Inc. sponsors lab for multi-phase research proposal', category: 'milestone' },
  { date: 'Nov 2022', month: 11, year: 2022, title: 'Behnam receives NSF Travel Grant Award to attend IEEE ESSCIRC', category: 'award' },
  { date: 'Oct 2022', month: 10, year: 2022, title: "Hedayat's first journal paper accepted in IEEE TCAS-II", category: 'publication' },
  { date: 'Sep 2022', month: 9, year: 2022, title: 'Collaborative paper accepted in IEEE TAP on sub-THz stacked-patch antenna', category: 'publication' },
  { date: 'Jul 2022', month: 7, year: 2022, title: 'Hedayat receives IEEE CICC Student Education Grant 2022', category: 'award' },
  { date: 'Jun 2022', month: 6, year: 2022, title: "Behnam and Xuyang's 76–82 GHz VCO paper accepted at IEEE RFIC", category: 'conference' },
  { date: 'Mar 2022', month: 3, year: 2022, title: "Hedayat's first HIE Lab paper accepted in IEEE MWTL", category: 'publication' },
  { date: 'Feb 2022', month: 2, year: 2022, title: 'Xuyang and Hedayat pass Ph.D. preliminary exams', category: 'milestone' },
  // 2021
  { date: 'Dec 2021', month: 12, year: 2021, title: 'mm-Wave Radars-on-Chip paper published in IEEE Communications Magazine', category: 'publication' },
  // 2020
  { date: 'Sep 2020', month: 9, year: 2020, title: 'Xuyang Liu joins HIE Lab as Ph.D. student', category: 'milestone' },
  { date: 'Sep 2020', month: 9, year: 2020, title: 'Hedayat Maktoomi joins HIE Lab as Ph.D. student', category: 'milestone' },
  // 2019
  { date: 'Jun 2019', month: 6, year: 2019, title: 'UCI Samueli School highlights our Applied Physics Reviews article', category: 'milestone' },
  { date: 'May 2019', month: 5, year: 2019, title: 'Applied Physics Reviews article featured as Editor\'s Pick', category: 'award' },
  { date: 'Apr 2019', month: 4, year: 2019, title: 'IEEE TAP paper selected as featured article', category: 'award' },
  { date: 'Mar 2019', month: 3, year: 2019, title: 'Hafsah Arain joins HIE Lab as undergraduate researcher', category: 'milestone' },
  { date: 'Jan 2019', month: 1, year: 2019, title: 'Marcus Clark Wong joins HIE Lab as undergraduate researcher', category: 'milestone' },
];

const categoryConfig: Record<Category, { color: string; bg: string; border: string; icon: React.ReactNode; label: string }> = {
  award: {
    color: 'text-uci-gold',
    bg: 'bg-uci-gold/10',
    border: 'border-uci-gold/30',
    label: 'Award',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  defense: {
    color: 'text-eecs-teal',
    bg: 'bg-eecs-teal/10',
    border: 'border-eecs-teal/30',
    label: 'Defense',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
      </svg>
    ),
  },
  publication: {
    color: 'text-uci-blue',
    bg: 'bg-uci-blue/10',
    border: 'border-uci-blue/30',
    label: 'Publication',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
    ),
  },
  conference: {
    color: 'text-eng-gold',
    bg: 'bg-eng-gold/10',
    border: 'border-eng-gold/30',
    label: 'Conference',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
      </svg>
    ),
  },
  milestone: {
    color: 'text-accent-glow',
    bg: 'bg-accent-glow/10',
    border: 'border-accent-glow/30',
    label: 'Milestone',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z" />
      </svg>
    ),
  },
};

const categories: Category[] = ['award', 'defense', 'publication', 'conference', 'milestone'];

export default function NewsPage() {
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const filtered = filter === 'all' ? newsItems : newsItems.filter(n => n.category === filter);

  const years = [...new Set(filtered.map(n => n.year))].sort((a, b) => b - a);

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-eng-blue via-navy to-uci-blue-dark text-white py-20 overflow-hidden">
        <CircuitBackground density={30} variant="radar" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="News & Highlights"
            subtitle="Latest achievements, publications, and milestones from the HIE Lab"
            badge="Stay Updated"
            centered
            light
          />
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 lg:top-20 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-eng-blue text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  filter === cat
                    ? `${categoryConfig[cat].bg} ${categoryConfig[cat].color} border ${categoryConfig[cat].border} shadow-md`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className={filter === cat ? categoryConfig[cat].color : 'text-gray-400'}>
                  {categoryConfig[cat].icon}
                </span>
                {categoryConfig[cat].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <WaveformDivider color="teal" />

      {/* Timeline */}
      <section className="py-16 bg-slate-warm min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {years.map(year => {
            const yearItems = filtered.filter(n => n.year === year);
            return (
              <div key={year} className="mb-12">
                {/* Year Divider */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-uci-blue/20" />
                  <span className="text-2xl font-bold text-eng-blue bg-white px-6 py-2 rounded-full shadow-md border border-uci-blue/10">
                    {year}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-uci-blue/20" />
                </motion.div>

                {/* Timeline Items */}
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-uci-blue/30 via-eecs-teal/20 to-uci-gold/30 hidden md:block" />
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-uci-blue/30 via-eecs-teal/20 to-uci-gold/30 md:hidden" />

                  {yearItems.map((item, idx) => {
                    const isLeft = idx % 2 === 0;
                    const config = categoryConfig[item.category];
                    return (
                      <motion.div
                        key={`${item.date}-${idx}`}
                        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className={`relative flex items-center mb-8 ${
                          isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}
                      >
                        {/* Mobile layout - always left aligned */}
                        <div className="md:hidden flex items-start gap-4 w-full pl-2">
                          {/* Node */}
                          <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center ${config.color}`}>
                            {config.icon}
                          </div>
                          {/* Card */}
                          <div className="flex-1 glass rounded-xl p-4 shadow-md card-hover hover:shadow-lg hover:shadow-uci-blue/8">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.color} mb-2`}>
                              {config.icon}
                              {config.label}
                            </span>
                            <p className="text-gray-800 font-medium text-sm leading-relaxed">{item.title}</p>
                            <span className="text-xs text-gray-400 mt-2 block">{item.date}</span>
                          </div>
                        </div>

                        {/* Desktop layout - alternating */}
                        <div className={`hidden md:flex items-center w-full`}>
                          {/* Left content */}
                          <div className={`w-[calc(50%-24px)] ${isLeft ? '' : 'order-2'}`}>
                            <div className={`glass rounded-xl p-5 shadow-md card-hover hover:shadow-lg hover:shadow-uci-blue/8 ${isLeft ? 'mr-4 text-right' : 'ml-4 text-left'}`}>
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.color} mb-2`}>
                                {config.icon}
                                {config.label}
                              </span>
                              <p className="text-gray-800 font-medium leading-relaxed">{item.title}</p>
                              <span className="text-xs text-gray-400 mt-2 block">{item.date}</span>
                            </div>
                          </div>

                          {/* Center node */}
                          <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center ${config.color} shadow-lg bg-white ${isLeft ? '' : 'order-1'}`}>
                            {config.icon}
                          </div>

                          {/* Spacer */}
                          <div className={`w-[calc(50%-24px)] ${isLeft ? 'order-2' : 'order-0'}`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No news items match the selected filter.</p>
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
