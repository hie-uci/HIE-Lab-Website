'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import PageWrapper from '@/components/PageWrapper';
import SectionHeader from '@/components/SectionHeader';
import CircuitBackground from '@/components/CircuitBackground';

interface Course {
  code: string;
  name: string;
  semesters: string;
  level: 'undergraduate' | 'graduate';
  rating?: number;
  note?: string;
}

const uciCourses: Course[] = [
  { code: 'EECS 70A', name: 'Network Analysis', semesters: 'Spring 2020\u20132025', level: 'undergraduate' },
  { code: 'EECS 270A', name: 'Advanced Analog Circuits', semesters: 'Fall 2020\u20132025', level: 'graduate' },
  { code: 'EECS 270AP', name: 'Advanced Analog Circuits M.Eng', semesters: 'Fall 2020', level: 'graduate' },
  { code: 'EECS 270E', name: 'mm-Wave and THz Circuits', semesters: 'Winter 2020\u20132025', level: 'graduate' },
  { code: 'EECS 298', name: 'mm-Wave and THz Circuits Special Topics', semesters: 'Fall 2019', level: 'graduate' },
];

const cornellCourses: Course[] = [
  { code: 'ECE 5790', name: 'Advanced High-Speed and RF ICs', semesters: 'Spring 2014', level: 'graduate', rating: 4.80, note: 'TA Selected' },
  { code: 'ECE 4330', name: 'Microwave Theory and Devices', semesters: 'Fall 2013', level: 'graduate', rating: 4.73, note: 'TA' },
  { code: 'ECE 3150', name: 'Introduction to Microelectronics', semesters: 'Spring 2013', level: 'undergraduate', rating: 4.92, note: 'TA' },
];

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const partial = rating - fullStars;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="relative w-4 h-4">
          {/* Empty star */}
          <svg className="w-4 h-4 text-gray-200 absolute" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {/* Filled star */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: i < fullStars ? '100%' : i === fullStars ? `${partial * 100}%` : '0%' }}
          >
            <svg className="w-4 h-4 text-uci-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
      ))}
      <span className="ml-1.5 text-sm font-semibold text-gray-600">{rating.toFixed(2)}/5</span>
    </div>
  );
}

function CourseCard({ course, index, accentColor }: { course: Course; index: number; accentColor: 'blue' | 'red' }) {
  const isGrad = course.level === 'graduate';
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass rounded-xl overflow-hidden card-hover group hover:shadow-lg hover:shadow-uci-blue/8 transition-shadow duration-300"
    >
      {/* Top accent bar */}
      <div className={`h-1 ${accentColor === 'blue' ? 'bg-gradient-to-r from-uci-blue to-eecs-teal' : 'bg-gradient-to-r from-red-600 to-red-400'}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className={`text-lg font-bold ${accentColor === 'blue' ? 'text-eng-blue' : 'text-red-800'}`}>
              {course.code}
            </h3>
            <p className="text-gray-700 font-medium">{course.name}</p>
          </div>
          <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isGrad
              ? 'bg-uci-blue/10 text-uci-blue border border-uci-blue/20'
              : 'bg-uci-gold/20 text-eng-gold border border-eng-gold/30'
          }`}>
            {isGrad ? 'Graduate' : 'Undergraduate'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {course.semesters}
        </div>

        {course.note && (
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
            accentColor === 'blue' ? 'bg-eecs-teal/10 text-eecs-teal' : 'bg-red-50 text-red-600'
          } mb-2`}>
            {course.note}
          </span>
        )}

        {course.rating && <StarRating rating={course.rating} />}
      </div>
    </motion.div>
  );
}

export default function TeachingPage() {
  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-eng-blue via-navy to-uci-blue-dark text-white py-20 overflow-hidden">
        <CircuitBackground density={25} variant="ic-layout" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeader
            title="Teaching"
            subtitle="Courses taught at UC Irvine and Cornell University"
            badge="Education"
            centered
            light
          />
        </div>
      </section>

      {/* UCI Section */}
      <section className="py-16 bg-slate-warm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <Image src="/images/teaching/uci-logo.png" alt="UC Irvine logo" width={48} height={48} className="w-12 h-12 rounded-xl object-contain" />
            <div>
              <h3 className="text-2xl font-bold text-eng-blue">University of California, Irvine</h3>
              <p className="text-gray-500">Assistant Professor, EECS Department</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {uciCourses.map((course, i) => (
              <CourseCard key={course.code} course={course} index={i} accentColor="blue" />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Cornell Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <Image src="/images/teaching/cornell-logo.png" alt="Cornell University logo" width={48} height={48} className="w-12 h-12 rounded-xl object-contain" />
            <div>
              <h3 className="text-2xl font-bold text-red-800">Cornell University</h3>
              <p className="text-gray-500">Teaching Assistant, ECE Department</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cornellCourses.map((course, i) => (
              <CourseCard key={course.code} course={course} index={i} accentColor="red" />
            ))}
          </div>

          {/* Teaching summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 glass rounded-xl p-6 border border-red-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-uci-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <h4 className="font-bold text-gray-800">Outstanding Teaching Evaluations</h4>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Consistently received excellent student evaluations across all TA positions at Cornell,
              with ratings ranging from <span className="font-semibold text-eng-blue">4.73 to 4.92 out of 5.00</span>.
            </p>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
