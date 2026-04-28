'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import PageWrapper from '@/components/PageWrapper';
import SectionHeader from '@/components/SectionHeader';
import CircuitBackground from '@/components/CircuitBackground';

// --------------- data ---------------

const director = {
  name: 'Prof. Hamidreza Aghasi',
  initials: 'HA',
  image: '/HIE-Lab-Website/images/members/pi-aghasi.jpeg',
  title: 'Assistant Professor of EECS',
  email: 'haghasi@uci.edu',
  phone: '(949)-824-8810',
  education: 'B.Sc. in Electrical Engineering, Sharif University of Technology, Tehran, Iran (2011); M.S. and Ph.D. in Electrical Engineering, Cornell University (2015, 2017)',
  expertise: 'mm-wave and terahertz electronics for applications in communication, biomedical imaging, and molecular spectroscopy',
  experience: [
    'Samsung Research America Display Lab Intern (Summer 2014)',
    'Postdoctoral Fellow, University of Michigan (2017–2018)',
    'mm-Wave Research Scientist, Acacia Communications Inc. (2018–2019)',
  ],
  service: [
    'Associate Editor, IEEE Transactions on VLSI Systems (2025–present)',
    'Technical Program Committee, IEEE CICC (2020–present)',
    'Technical Program Committee, IEEE RFIC (2024–present)',
  ],
  memberships: [
    'Senior Member, IEEE',
    'IEEE Solid-State Circuits Society',
    'IEEE Microwave Theory and Techniques Society',
  ],
  achievements: [
    'NSF CAREER Award (2025)',
    'NeurIPS ML4PS Reproducibility Award (2024)',
    'Best Invited Paper Award, IEEE CICC (2019)',
    'IEEE TNANO "Article of the Month" (June 2016)',
    'Cornell Graduate Fellowship',
    'Jacobs Fellowship',
    'Cornell ECE Innovation Award',
    'Cornell Scale-Up and Prototyping Award',
  ],
};

interface Member {
  name: string;
  initials: string;
  image: string;
  focus: string;
  bio: string;
  gradientFrom: string;
  gradientTo: string;
}

const phdStudents: Member[] = [
  { name: 'Md Hedayatullah Maktoomi', initials: 'MH', image: '/HIE-Lab-Website/images/members/phd-maktoomi.png', focus: 'RF/microwave and power amplifier design', bio: 'B. Engg. from Jamia Millia Islamia, New Delhi (2015), M.S. from Washington State University (2020). Intern and research assistant at IIIT Delhi (2016-2017) on passive RF/microwave circuits. RF engineering intern at Wolfspeed Inc. (2019) working on Doherty power amplifier design. Published in IEEE TCAS-II and IEEE TMTT. Frequent reviewer for multiple IEEE journals.', gradientFrom: 'from-uci-blue', gradientTo: 'to-eecs-teal' },
  { name: 'Mahdi Alesheikh', initials: 'MA', image: '/HIE-Lab-Website/images/members/phd-alesheikh.png', focus: 'Analog/RF circuits', bio: 'BSc in Electronics from Sharif University of Technology, Tehran, Iran. BSc thesis on IoT circuits under Prof. Safarian. MSc in ECE from University of Alberta, with master\'s work on RFIC and microwave circuits under Prof. Karumudi and Hossain. Currently pursuing PhD at UCI.', gradientFrom: 'from-eng-blue', gradientTo: 'to-uci-gold' },
  { name: 'Allen (Yilun) Huang', initials: 'AH', image: '/HIE-Lab-Website/images/members/phd-allen-huang.png', focus: 'Analog/mixed-signal and mm-wave design', bio: 'B.S. in electrical engineering from Iowa State University (2022), M.S. from UCLA (2024). Currently pursuing Ph.D. at UCI. Research interests include analog/mixed-signal, RF, mm-wave circuit design, and machine learning applications in circuit and radar system design.', gradientFrom: 'from-uci-gold', gradientTo: 'to-eecs-teal' },
  { name: 'Mark (Zheng-yang) Zhang', initials: 'MZ', image: '/HIE-Lab-Website/images/members/phd-mark-zhang.png', focus: 'Analog/mixed-signal/RF circuits', bio: 'BSEE from SUSTech, Shenzhen, China, with work on integrated power management for wireline transceivers. Currently pursuing PhD at UCI. Research interests in analog/mixed-signal/RF circuits and systems.', gradientFrom: 'from-eecs-teal', gradientTo: 'to-uci-blue' },
  { name: 'Mohammadamin (Amin) Montazar', initials: 'AM', image: '/HIE-Lab-Website/images/members/phd-montazar.png', focus: 'mm-wave and terahertz integrated circuits', bio: 'B.S. and M.S. in Electrical Engineering from UC Davis (2020, 2022). Under Prof. Omeed Momeni, designed LC VCO in C-band with thesis on low power, low phase noise VCO for PLL applications. Senior RF Design Engineer for two years specializing in military communication systems VHF to C-Band.', gradientFrom: 'from-uci-blue-dark', gradientTo: 'to-uci-gold' },
  { name: 'Yuncheng Tu', initials: 'YT', image: '/HIE-Lab-Website/images/members/phd-yuncheng-tu.png', focus: 'Analog, RF, and mm-wave circuits', bio: 'B.S. in Electrical Engineering from Southern University of Science and Technology, Shenzhen, China (2025). Currently pursuing Ph.D. at UCI.', gradientFrom: 'from-eng-blue', gradientTo: 'to-eecs-teal-light' },
];

const undergradResearchers: Member[] = [
  { name: 'Wei Dai', initials: 'WD', image: '/HIE-Lab-Website/images/members/undergrad-wei-dai.png', focus: 'Digital and analog circuits', bio: 'Pursuing BSc in Electrical Engineering at UCI with specialization in Electronic Circuit Design.', gradientFrom: 'from-uci-blue-light', gradientTo: 'to-eecs-teal' },
  { name: 'Albert Huang', initials: 'AH', image: '/HIE-Lab-Website/images/members/undergrad-albert-huang.png', focus: 'Analog circuit design', bio: 'Pursuing BSc in Electrical and Computer Engineering at UCI, specializing in Electronic Circuit Design, Semiconductors, and RF, Antennas, and Microwaves.', gradientFrom: 'from-uci-gold', gradientTo: 'to-uci-blue' },
];

interface Alumnus {
  name: string;
  initials: string;
  image: string;
  detail: string;
  now?: string;
  bio?: string;
}

const phdAlumni: Alumnus[] = [
  { name: 'Masoud Berahman', initials: 'MB', image: '/HIE-Lab-Website/images/members/alumni-berahman.png', detail: 'Ph.D./Postdoc', now: undefined, bio: 'Completed PhD in electrical engineering and postdoctoral fellowship in physics. Primary research interests in two and one-dimensional materials applications in future electronic devices.' },
  { name: 'Xuyang Liu', initials: 'XL', image: '/HIE-Lab-Website/images/members/alumni-xuyang-liu.png', detail: '2020-2025', now: 'Staff Engineer, Marvell Technology', bio: 'BS in Electronic Information Engineering from Jilin University, China (2018), MS in Electrical Engineering from Columbia University (2019), PhD from UCI (2025). Research interests in mmWave front-end, VCO and PLL, FMCW radar system.' },
  { name: 'Behnam Moradi Shahrbabak', initials: 'BM', image: '/HIE-Lab-Website/images/members/alumni-behnam.jpg', detail: '2019-2024', now: 'Senior RFIC Engineer, Kyocera', bio: 'Research interests in analog, RF, millimeter-wave circuits, and system design.' },
];

const otherAlumni: Alumnus[] = [
  { name: 'Xuzhe Zhao', initials: 'XZ', image: '/HIE-Lab-Website/images/members/alumni-xuzhe-zhao.png', detail: 'M.S.' },
  { name: 'Tanqin He', initials: 'TH', image: '/HIE-Lab-Website/images/members/alumni-tanqin-he.png', detail: 'M.S.' },
  { name: 'Pooya Khajeh', initials: 'PK', image: '/HIE-Lab-Website/images/members/alumni-pooya.jpg', detail: 'M.S.', now: 'R&D Test Engineer, Broadcom' },
  { name: 'Mengjie (Kaylee) Xie', initials: 'MX', image: '/HIE-Lab-Website/images/members/alumni-kaylee.jpg', detail: 'B.Sc.', now: 'Graduate Student, Stanford' },
  { name: 'Kelly Aung Lu', initials: 'KL', image: '/HIE-Lab-Website/images/members/alumni-kelly.jpg', detail: 'B.Sc.' },
  { name: 'Annika Ageles Del Rosario', initials: 'AA', image: '/HIE-Lab-Website/images/members/alumni-annika.png', detail: 'B.Sc.', now: 'Hardware Engineer, Western Digital' },
  { name: 'Marcus Clark Wong', initials: 'MW', image: '/HIE-Lab-Website/images/members/alumni-marcus.png', detail: 'B.Sc.', now: 'PhD Student, UCSC' },
  { name: 'Shihao Han', initials: 'SH', image: '/HIE-Lab-Website/images/members/alumni-shihao.png', detail: 'M.S.' },
  { name: 'Yankai Yang', initials: 'YY', image: '/HIE-Lab-Website/images/members/alumni-yankai.png', detail: 'M.S.' },
];

// --------------- animation helpers ---------------

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

// --------------- sub-components ---------------

function Avatar({ initials, size = 'md', gradientFrom = 'from-uci-blue', gradientTo = 'to-uci-gold' }: { initials: string; size?: 'sm' | 'md' | 'lg'; gradientFrom?: string; gradientTo?: string }) {
  const sizeClasses = { sm: 'w-10 h-10 text-xs', md: 'w-16 h-16 text-lg', lg: 'w-28 h-28 text-3xl' };
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-white font-bold shadow-lg`}>
      {initials}
    </div>
  );
}

function TagPill({ text }: { text: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-uci-blue/5 text-uci-blue border border-uci-blue/10">
      {text}
    </span>
  );
}

function MemberCard({ member, label = 'PhD Student' }: { member: Member; index: number; label?: string }) {
  const tags = member.focus.split(/,\s*and\s*|,\s*|\s+and\s+/);
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group glass rounded-2xl p-6 flex flex-col items-center text-center card-hover relative overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-uci-blue/5 via-transparent to-uci-gold/5" />
      <Image src={member.image} alt={member.name} width={120} height={120} className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-white" />
      <h3 className="mt-4 font-semibold text-eng-blue text-base leading-tight">{member.name}</h3>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {tags.map((t) => (
          <TagPill key={t} text={t.trim()} />
        ))}
      </div>
      {member.bio && (
        <p className="mt-3 text-xs text-gray-500 leading-relaxed text-left bg-gray-50/80 rounded-lg p-3 w-full">
          {member.bio}
        </p>
      )}
    </motion.div>
  );
}

function AlumnusCard({ alumnus }: { alumnus: Alumnus }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass rounded-xl p-4 flex flex-col card-hover"
    >
      <div className="flex items-center gap-3">
        <Image src={alumnus.image} alt={alumnus.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm text-eng-blue truncate">{alumnus.name}</p>
          {alumnus.detail && <p className="text-xs text-gray-400">{alumnus.detail}</p>}
          {alumnus.now && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-eecs-teal/10 text-eecs-teal border border-eecs-teal/20">
              <span className="w-1.5 h-1.5 rounded-full bg-eecs-teal" />
              Now at {alumnus.now}
            </span>
          )}
        </div>
      </div>
      {alumnus.bio && (
        <p className="mt-2 text-[11px] text-gray-500 leading-relaxed bg-gray-50/80 rounded-lg p-2.5">
          {alumnus.bio}
        </p>
      )}
    </motion.div>
  );
}

// --------------- page ---------------

export default function TeamPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-eng-blue via-navy to-eng-blue py-24 overflow-hidden">
        <CircuitBackground density={50} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Our Team"
            subtitle="Meet the researchers driving innovation in high-frequency integrated electronics at UCI."
            badge="People"
            centered
            light
          />
        </div>
      </section>

      {/* Director */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* gradient border wrapper */}
          <div className="p-[2px] rounded-3xl bg-gradient-to-r from-uci-blue via-uci-gold to-eecs-teal">
            <div className="bg-white rounded-[22px] p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Avatar */}
              <div className="shrink-0">
                <Image src={director.image} alt={director.name} width={160} height={160} className="w-36 h-36 rounded-full object-cover shadow-xl ring-4 ring-white" />
              </div>
              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-eng-blue">{director.name}</h2>
                <p className="text-uci-blue font-medium mt-1">{director.title}</p>

                {/* Contact */}
                <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start text-sm text-gray-500">
                  <a href={`mailto:${director.email}`} className="hover:text-uci-blue transition-colors">{director.email}</a>
                  <span className="hidden sm:inline text-gray-300">|</span>
                  <span>{director.phone}</span>
                </div>

                {/* Education */}
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Education</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{director.education}</p>
                </div>

                {/* Research */}
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Research Focus</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{director.expertise}</p>
                </div>

                {/* Experience */}
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Experience</h4>
                  <ul className="space-y-1">
                    {director.experience.map((e) => (
                      <li key={e} className="text-sm text-gray-500 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-eecs-teal mt-2 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Professional Service */}
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Professional Service</h4>
                  <ul className="space-y-1">
                    {director.service.map((s) => (
                      <li key={s} className="text-sm text-gray-500 flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-uci-blue mt-2 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Memberships */}
                <div className="mt-3">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Memberships</h4>
                  <div className="flex flex-wrap gap-2">
                    {director.memberships.map((m) => (
                      <span key={m} className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-navy/5 text-navy border border-navy/10">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Awards */}
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Awards & Honors</h4>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {director.achievements.map((a) => (
                      <span key={a} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-uci-gold/10 text-uci-gold-light border border-uci-gold/20">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PhD Students */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <SectionHeader title="PhD Students" subtitle="Current doctoral researchers advancing the frontiers of integrated electronics." badge="Researchers" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {phdStudents.map((m, i) => (
            <MemberCard key={m.name} member={m} index={i} />
          ))}
        </motion.div>
      </section>

      {/* Undergraduate Researchers */}
      <section className="bg-gray-50/80 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Undergraduate Researchers" badge="Undergrads" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {undergradResearchers.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} label="Undergraduate Researcher" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* PhD / Postdoc Alumni */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <SectionHeader title="PhD & Postdoc Alumni" badge="Alumni" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {phdAlumni.map((a) => (
            <AlumnusCard key={a.name} alumnus={a} />
          ))}
        </motion.div>
      </section>

      {/* Other Alumni */}
      <section className="bg-gray-50/80 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader title="Other Alumni" badge="Alumni" />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {otherAlumni.map((a) => (
              <AlumnusCard key={a.name} alumnus={a} />
            ))}
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
