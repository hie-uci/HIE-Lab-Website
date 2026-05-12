'use client';

import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import SectionHeader from '@/components/SectionHeader';

export default function MeasurementTutorialPage() {
  return (
    <PageWrapper>
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-background min-h-screen z-10 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,164,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,164,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Video Resources"
            title="Measurement Tutorials"
            subtitle="Educational guides for VNA calibration, active circuit measurements, radar demos, and EDA workflows."
          />

          <div className="mt-12 glass-ios rounded-3xl p-6 sm:p-10 border border-white/40 dark:border-white/10">
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-uci-blue/5 border border-uci-blue/20 rounded-2xl p-6">
                <div>
                  <h3 className="text-2xl font-bold text-eng-blue dark:text-blue-300 mb-2">RF/mmWave Video Collection</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    A curated collection of educational videos spanning high-frequency hardware measurements.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a href="https://www.youtube.com/@xuyangliu3768?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    Subscribe to Channel
                  </a>
                  <a href="https://www.youtube.com/@xuyangliu3768" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-semibold rounded-xl shadow-sm transition-all duration-300">
                    Visit @xuyangliu3768
                  </a>
                </div>
              </div>
              
              <div className="space-y-10">
                <div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-uci-blue rounded-full"></span>
                    Antenna & Radar Measurement
                  </h4>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <VideoCard 
                      title="60GHz Radar Antenna Pattern Measurement" 
                      videoId="GuXS8jPgpSQ" 
                      description="A short demo on antenna pattern measurement of a published ESSCIRC radar work (A 49-63 GHz Phase-locked FMCW Radar Transceiver for High Resolution Applications)." 
                    />
                    <VideoCard 
                      title="ICLEGEND MICRO XenP202TT 24GHz Radar Demo" 
                      videoId="jyqjmBx2frc" 
                      description="Real-world demo of the ICLEGEND MICRO XenP202TT 24GHz radar module measuring one-dimensional angle and distance with a corner reflector." 
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-eecs-teal rounded-full"></span>
                    Active Circuit Measurements
                  </h4>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <VideoCard 
                      title="3.1GHz - 4.66GHz VCO Measurement" 
                      videoId="lKwzEgkpngI" 
                      description="Laboratory measurement session focusing on the phase noise and output power of a wideband Voltage-Controlled Oscillator (VCO)." 
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                    EDA Workflow & Simulation
                  </h4>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <VideoCard 
                      title="Export HFSS Antenna Design to KiCad" 
                      videoId="cpQM-97AvMA" 
                      description="A step-by-step tutorial on exporting an Ansys HFSS antenna design into KiCad and generating Gerber files for manufacturing." 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}

function VideoCard({ title, videoId, description }: { title: string, videoId: string, description: string }) {
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 p-6 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      <h4 className="text-md font-bold text-eng-blue dark:text-blue-300 mb-4">{title}</h4>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner mb-4">
        <iframe 
          className="absolute inset-0 w-full h-full" 
          src={`https://www.youtube.com/embed/${videoId}`} 
          title={title} 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-auto">
        {description}
      </p>
    </div>
  );
}