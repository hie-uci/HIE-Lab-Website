'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionHeader from '@/components/SectionHeader';
import CircuitBackground from '@/components/CircuitBackground';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const positions = [
  {
    title: 'Postdoctoral Scholars',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
    description: 'We are looking for candidates with expertise in the following areas:',
    skills: [
      'RF/mm-wave circuit design',
      'Microwave theory',
      'Solid-state device physics',
      'Nonlinear dynamics',
    ],
    requirements: 'Please send a cover letter, CV, and research statement to haghasi@uci.edu. Applicants must also provide contact information for 2–3 references.',
    gradient: 'from-[#0064a4] to-[#00386d]',
  },
  {
    title: 'Graduate Students',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    description: 'We welcome students with backgrounds in circuit design and microwave theory. Prospective students should:',
    skills: [
      'Apply through UCI\'s graduate program',
      'Email haghasi@uci.edu with CV and transcripts',
      'Mention interest in joining the group during the formal application process',
    ],
    requirements: null,
    gradient: 'from-[#203043] to-[#528188]',
  },
  {
    title: 'Undergraduate Researchers',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    description: 'Current UCI undergraduates interested in mm-wave circuit design should email haghasi@uci.edu with:',
    skills: [
      'Academic transcript',
      'Brief summary of research interests',
    ],
    requirements: 'We also provide a list of suggested textbooks which cover the prerequisite knowledge for students seeking foundational preparation in this research area.',
    gradient: 'from-[#00386d] to-[#528188]',
  },
];

export default function AvailablePositionsPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-slate-warm via-white to-white">
        <CircuitBackground className="opacity-30" density={40} />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeader
            badge="Join Us"
            title="Available Positions"
            subtitle="Our laboratory always welcomes motivated and enthusiastic new members!"
          />
        </div>
      </section>

      {/* Welcome message */}
      <section className="relative py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl bg-gradient-to-r from-uci-blue/5 via-eecs-teal/5 to-uci-gold/5 border border-uci-blue/10 text-center"
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              The HIE Lab at UC Irvine is actively recruiting motivated individuals at all levels —
              postdoctoral scholars, graduate students, and undergraduate researchers — to push the
              boundaries of high-speed integrated electronics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Position cards */}
      <section className="relative py-16 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="space-y-8"
          >
            {positions.map((pos, i) => (
              <motion.div
                key={pos.title}
                variants={fadeUp}
                custom={i}
                className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:shadow-uci-blue/8 transition-all duration-500"
              >
                {/* Gradient header */}
                <div className={`relative bg-gradient-to-r ${pos.gradient} px-8 py-6 flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white">
                    {pos.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-white">{pos.title}</h2>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-gray-700 leading-relaxed mb-5">{pos.description}</p>

                  <ul className="space-y-3 mb-6">
                    {pos.skills.map((skill) => (
                      <li key={skill} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-uci-blue flex-shrink-0" />
                        <span className="text-gray-600">{skill}</span>
                      </li>
                    ))}
                  </ul>

                  {pos.requirements && (
                    <div className="p-5 rounded-xl bg-slate-warm border border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed">{pos.requirements}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-br from-eng-blue via-navy to-eng-blue overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <pattern id="pos-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pos-grid)" />
          </svg>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Interested?</h2>
            <p className="text-lg text-white/60 mb-8 leading-relaxed">
              Reach out to Prof. Hamidreza Aghasi to discuss opportunities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:haghasi@uci.edu"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-uci-gold text-eng-blue font-bold rounded-xl shadow-lg shadow-uci-gold/20 hover:shadow-xl hover:shadow-uci-gold/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                Email haghasi@uci.edu
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                Contact Page
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
