'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Research', href: '/research' },
  { name: 'Publications', href: '/publications' },
  { name: 'Team', href: '/team' },
  { name: 'Chip Gallery', href: '/chip-gallery' },
  { name: 'News', href: '/news' },
  { name: 'Teaching', href: '/teaching' },
  { name: 'Contact', href: '/contact' },
  { name: 'Positions', href: '/available-positions' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-lg shadow-eng-blue/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image src="/images/logo/hie-logo.png" alt="HIE Lab logo" width={922} height={137} className="h-12 sm:h-18 w-auto object-contain group-hover:opacity-80 transition-opacity" unoptimized />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-navy/80 hover:text-uci-blue rounded-lg hover:bg-uci-blue/5 transition-all duration-200 animated-underline"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* UCI Badge */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-8 w-px bg-gray-200" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-uci-blue/5 border border-uci-blue/10">
              <div className="w-5 h-5 rounded-full bg-uci-blue flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">UCI</span>
              </div>
              <span className="text-xs font-medium text-uci-blue">Engineering</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-navy rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-navy rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-0.5 bg-navy rounded-full transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass border-t border-white/20"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-navy/80 hover:text-uci-blue hover:bg-uci-blue/5 rounded-lg transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
