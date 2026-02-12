'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionHeader from '@/components/SectionHeader';
import CircuitBackground from '@/components/CircuitBackground';

// --------------- types ---------------

type PubType = 'journal' | 'conference' | 'patent';

interface Publication {
  authors: string;
  title: string;
  venue: string;
  year: number;
  type: PubType;
  highlight?: string; // e.g. "Best Student Paper Nominee"
  status?: string; // e.g. "Under Review"
  link?: string; // DOI or publisher URL
}

// --------------- data ---------------

const publications: Publication[] = [
  // 2025 Journals
  { authors: 'M. H. Maktoomi, X. Liu, H. R. Aghasi', title: 'A 19 dBm Psat 110–142 GHz Power Amplifier in 65-nm CMOS', venue: 'IEEE JSSC', year: 2025, type: 'journal', status: 'Under Review' },
  { authors: 'M. Alonso, X. Liu, H. R. Aghasi', title: 'Non-Linear Analog Processing in MIMO Systems', venue: 'IEEE JSAIT', year: 2025, type: 'journal', status: 'Under Review' },
  { authors: 'M. Alesheikh, A. Montazar, H. R. Aghasi', title: 'Effect of Object Shape and Radar Topology', venue: 'IEEE MWTL', year: 2025, type: 'journal', status: 'Under Review' },
  { authors: 'J. Gruber et al.', title: 'Sub-THz Communication Systems in Silicon', venue: 'Nature Communications Engineering', year: 2025, type: 'journal' },
  { authors: 'A. Montazar, X. Liu, Z. Zhang, H. R. Aghasi', title: 'A Hybrid CMOS–Polyimide Adaptive Force Radiometric Array', venue: 'IEEE MWTL', year: 2025, type: 'journal', link: 'https://ieeexplore.ieee.org/document/10969567' },
  { authors: 'M. Berahman, H. R. Aghasi', title: 'Tunneling FETs Based on Janus Monolayer PtSSe', venue: 'IEEE TNANO', year: 2025, type: 'journal', link: 'https://ieeexplore.ieee.org/document/11082011' },
  { authors: 'X. Liu, M. Maktoomi, M. Alesheikh, P. Heydari, H. R. Aghasi', title: 'A CMOS 49–63-GHz Phase-Locked Stepped-Chirp FMCW Radar Transceiver', venue: 'IEEE JSSC', year: 2025, type: 'journal', link: 'https://ieeexplore.ieee.org/document/10964133' },

  // 2026 Conferences
  { authors: 'Y. Huang et al.', title: 'EM-Aware Physical Synthesis', venue: 'IEEE ISCAS', year: 2026, type: 'conference', status: 'Submitted' },
  { authors: 'A. Montazar et al.', title: 'Energy-Autonomous Frequency-Domain Force Sensor', venue: 'IEEE ISCAS', year: 2026, type: 'conference', status: 'Submitted' },
  { authors: 'M. Maktoomi et al.', title: '110–142 GHz 19 dBm PA', venue: 'IEEE RWW', year: 2025, type: 'conference', highlight: 'Best Student Paper Nominee' },
  { authors: 'A. Ding, Y. Huang et al.', title: 'Attention-Based Cognitive Beam Steering', venue: 'IEEE RadarConf', year: 2025, type: 'conference', highlight: 'Best Student Paper Nominee' },
  { authors: 'A. Mehradfar et al.', title: 'FALCON: ML Framework for Analog Circuit Design', venue: 'NeurIPS', year: 2025, type: 'conference' },
  { authors: 'A. Montazar et al.', title: 'Hybrid CMOS-Polyimide Array', venue: 'IEEE IMS', year: 2025, type: 'conference' },
  { authors: 'M. Alesheikh et al.', title: '55–65 GHz Half-Width Leaky Wave Antenna', venue: 'IEEE APS', year: 2025, type: 'conference' },
  { authors: 'M. Alesheikh et al.', title: 'Curvature Effect of Flexible Antenna Arrays', venue: 'IEEE APS', year: 2025, type: 'conference' },

  // 2024 Journals
  { authors: 'A. Mahdavifar et al.', title: 'Supervised Learning for Analog and RF Circuit Design', venue: 'IEEE TCAD', year: 2024, type: 'journal', status: 'Under Review' },
  { authors: 'H. R. Aghasi et al.', title: 'Broadband Harmonic-Assisted Power Enhancement', venue: 'IEEE JSSC', year: 2024, type: 'journal', link: 'https://ieeexplore.ieee.org/document/10758425' },
  { authors: 'X. Liu, B. Moradi, H. R. Aghasi', title: 'Single-Switch 3.1–4.7 GHz Class-D VCO', venue: 'IEEE TCAS-II', year: 2024, type: 'journal', link: 'https://ieeexplore.ieee.org/document/10543114' },
  { authors: 'B. Moradi, X. Liu, H. R. Aghasi', title: '76–82 GHz VCO in 65 nm CMOS', venue: 'IEEE TCAS-I', year: 2024, type: 'journal', link: 'https://ieeexplore.ieee.org/document/10296176' },

  // 2024 Conferences
  { authors: 'A. Mahdavifar et al.', title: 'AICircuit: Multi-Level Dataset', venue: 'NeurIPS ML4PS Workshop', year: 2024, type: 'conference' },
  { authors: 'M. Alesheikh et al.', title: 'Electronically Tunable 28–34 GHz 2D Steerable LWA', venue: 'IEEE APS', year: 2024, type: 'conference' },

  // 2023
  { authors: 'H. Maktoomi et al.', title: 'Broadband Antenna Design for THz Communication', venue: 'IEEE Access', year: 2023, type: 'journal', link: 'https://ieeexplore.ieee.org/abstract/document/10056150' },
  { authors: 'X. Liu et al.', title: '49–63 GHz Phase-Locked FMCW Radar', venue: 'ESSCIRC', year: 2023, type: 'conference', link: 'https://ieeexplore.ieee.org/abstract/document/10268798' },
  { authors: 'D. Krylov et al.', title: 'Learning to Design Analog Circuits', venue: 'ICML', year: 2023, type: 'conference', link: 'https://openreview.net/forum?id=38W1BXgAqx' },

  // 2022
  { authors: 'H. Maktoomi et al.', title: 'Sub-THz Wideband Stacked-Patch Antenna', venue: 'IEEE TAP', year: 2022, type: 'journal', link: 'https://ieeexplore.ieee.org/abstract/document/9810798' },
  { authors: 'F. Shirani, H. R. Aghasi', title: 'Quantifying Capacity Gains', venue: 'IEEE Globecom', year: 2022, type: 'conference', link: 'https://ieeexplore.ieee.org/abstract/document/10008530' },
  { authors: 'F. Shirani, H. R. Aghasi', title: 'MIMO with One-Bit ADCs', venue: 'IEEE ISIT', year: 2022, type: 'conference', link: 'https://ieeexplore.ieee.org/abstract/document/9834405' },
  { authors: 'B. Moradi et al.', title: 'Compact CMOS 76–82 GHz Super-Harmonic VCO', venue: 'IEEE RFIC', year: 2022, type: 'conference', link: 'https://ieeexplore.ieee.org/abstract/document/9863140' },

  // 2020-2021
  { authors: 'H. R. Aghasi, P. Heydari', title: 'mm-Wave Radars-on-Chip', venue: 'IEEE Communications Magazine', year: 2020, type: 'journal', link: 'https://ieeexplore.ieee.org/abstract/document/9311904' },
  { authors: 'H. R. Aghasi et al.', title: 'THz Electronics: Wave Propagation and Nonlinear Processes', venue: 'Applied Physics Reviews', year: 2020, type: 'journal', highlight: "Editor's Choice", link: 'https://pubs.aip.org/aip/apr/article-abstract/7/2/021302/124062' },
  { authors: 'A. Mostajeran et al.', title: 'Fully Integrated Solutions for THz Imaging', venue: 'IEEE CICC', year: 2019, type: 'conference' },
  { authors: 'H. Maktoomi et al.', title: 'GSG-Excited Ultra-Wideband 103–147 GHz Stacked Patch Antenna', venue: 'IEEE APS', year: 2021, type: 'conference' },

  // 2015-2018
  { authors: 'H. R. Aghasi, E. Afshari', title: '88 GHz Compact Fundamental Oscillator', venue: 'IEEE SSCL', year: 2018, type: 'journal', link: 'https://ieeexplore.ieee.org/abstract/document/8490693' },
  { authors: 'H. R. Aghasi et al.', title: '0.92 THz SiGe Power Radiator', venue: 'IEEE JSSC', year: 2017, type: 'journal', link: 'https://ieeexplore.ieee.org/abstract/document/7819530' },
  { authors: 'H. R. Aghasi, E. Afshari', title: 'Power-Efficient THz Communication Circuits', venue: 'ACM NANOCOM', year: 2017, type: 'conference', link: 'https://dl.acm.org/citation.cfm?id=3122844' },
  { authors: 'H. R. Aghasi et al.', title: 'Smart Detector Cell', venue: 'IEEE TNANO', year: 2016, type: 'journal', link: 'https://ieeexplore.ieee.org/abstract/document/7407630' },
  { authors: 'H. R. Aghasi, E. Afshari', title: 'Broadband mm-Wave and THz Frequency Doublers', venue: 'ESSCIRC', year: 2016, type: 'conference', link: 'https://ieeexplore.ieee.org/abstract/document/7598318' },
  { authors: 'S. Saadat et al.', title: 'Low Power Negative Inductance IC', venue: 'IEEE MWCL', year: 2015, type: 'journal', link: 'https://ieeexplore.ieee.org/abstract/document/7004068' },
  { authors: 'R. Han et al.', title: '320 GHz Phase-Locked Transmitter', venue: 'IEEE ISSCC', year: 2015, type: 'conference' },

  // Patents
  { authors: 'A. Montazar, X. Liu, H. R. Aghasi', title: 'Hybrid CMOS-Polyimide Force Radiometric Array', venue: 'US Patent', year: 2025, type: 'patent' },
  { authors: 'H. R. Aghasi, P. Heydari', title: 'Integrated Wideband Stepped-Chirp Radar Sensor', venue: 'US Patent', year: 2022, type: 'patent' },
];

// --------------- helpers ---------------

const filterTabs: { label: string; value: PubType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Journal', value: 'journal' },
  { label: 'Conference', value: 'conference' },
  { label: 'Patent', value: 'patent' },
];

function venueColor(type: PubType) {
  switch (type) {
    case 'journal': return 'bg-uci-blue/10 text-uci-blue border-uci-blue/20';
    case 'conference': return 'bg-eecs-teal/10 text-eecs-teal border-eecs-teal/20';
    case 'patent': return 'bg-uci-gold/10 text-uci-gold-light border-uci-gold/20';
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// --------------- page ---------------

export default function PublicationsPage() {
  const [filter, setFilter] = useState<PubType | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = publications;
    if (filter !== 'all') list = list.filter((p) => p.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.toLowerCase().includes(q) ||
          p.venue.toLowerCase().includes(q),
      );
    }
    return list;
  }, [filter, search]);

  // Group by year, newest first; within each year: journals → conferences → patents
  const grouped = useMemo(() => {
    const typeOrder: Record<PubType, number> = { journal: 0, conference: 1, patent: 2 };
    const map = new Map<number, Publication[]>();
    for (const p of filtered) {
      const arr = map.get(p.year) ?? [];
      arr.push(p);
      map.set(p.year, arr);
    }
    const entries = Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
    for (const [, pubs] of entries) {
      pubs.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
    }
    return entries;
  }, [filtered]);

  // Stats
  const stats = useMemo(() => ({
    journals: publications.filter((p) => p.type === 'journal').length,
    conferences: publications.filter((p) => p.type === 'conference').length,
    patents: publications.filter((p) => p.type === 'patent').length,
  }), []);

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-eng-blue via-navy to-eng-blue py-24 overflow-hidden">
        <CircuitBackground density={50} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Publications"
            subtitle="Peer-reviewed research in mm-wave, THz electronics, and machine-learning-driven IC design."
            badge="Research Output"
            centered
            light
          />

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center gap-6 sm:gap-10 mt-2"
          >
            {[
              { label: 'Journals', count: stats.journals, color: 'text-uci-gold' },
              { label: 'Conferences', count: stats.conferences, color: 'text-eecs-teal-light' },
              { label: 'Patents', count: stats.patents, color: 'text-uci-gold' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-3xl sm:text-4xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-white/60 text-xs uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Controls */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row gap-4 items-center"
        >
          {/* Search */}
          <div className="relative flex-1 w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, author, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-uci-blue/30 focus:border-uci-blue transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.value
                    ? 'bg-uci-blue text-white shadow'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {grouped.length === 0 && (
          <p className="text-center text-gray-400 py-20">No publications match your search.</p>
        )}

        <div className="relative">
          {/* Vertical line */}
          {grouped.length > 0 && (
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-uci-blue/30 via-uci-blue/10 to-transparent" />
          )}

          <AnimatePresence mode="wait">
            <motion.div key={filter + search} initial="hidden" animate="visible" exit="exit">
              {grouped.map(([year, pubs], gi) => (
                <div key={year} className="mb-12 last:mb-0">
                  {/* Year label */}
                  <motion.div
                    variants={cardVariants}
                    className="flex items-center gap-4 mb-6 relative"
                  >
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-uci-blue to-uci-gold flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg relative z-10">
                      {year}
                    </div>
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">{pubs.length} publication{pubs.length !== 1 ? 's' : ''}</span>
                  </motion.div>

                  {/* Publications */}
                  <div className="pl-12 sm:pl-16 space-y-3">
                    {pubs.map((pub, pi) => (
                      <motion.div
                        key={pub.title}
                        variants={cardVariants}
                        transition={{ delay: pi * 0.05 }}
                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                        className="glass rounded-xl p-4 sm:p-5 group card-hover"
                      >
                        <div className="flex flex-wrap items-start gap-2 mb-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${venueColor(pub.type)}`}>
                            {pub.venue}
                          </span>
                          {pub.status && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                              {pub.status}
                            </span>
                          )}
                          {pub.highlight && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-uci-gold/10 text-uci-gold-light border border-uci-gold/20">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                              {pub.highlight}
                            </span>
                          )}
                        </div>
                        {pub.link ? (
                          <a href={pub.link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 group/link" onClick={(e) => e.stopPropagation()}>
                            <h3 className="text-sm sm:text-base font-semibold text-eng-blue leading-snug group-hover/link:text-uci-blue transition-colors hover:underline underline-offset-2">
                              {pub.title}
                            </h3>
                            <svg className="w-3.5 h-3.5 mt-1 shrink-0 text-gray-300 group-hover/link:text-uci-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <h3 className="text-sm sm:text-base font-semibold text-eng-blue leading-snug group-hover:text-uci-blue transition-colors">
                            {pub.title}
                          </h3>
                        )}
                        <p className="text-xs text-gray-400 mt-1.5">{pub.authors}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  );
}
