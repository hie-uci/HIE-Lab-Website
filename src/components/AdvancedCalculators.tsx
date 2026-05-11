'use client';

import React, { useState } from 'react';

/* =========================================================================
   Impedance Matching Synthesizer (L-Match)
   ========================================================================= */

export function ImpedanceMatchingCalculator() {
  const [rs, setRs] = useState<string>('10');
  const [xs, setXs] = useState<string>('-15');
  const [rl, setRl] = useState<string>('50');
  const [xl, setXl] = useState<string>('0');
  const [freq, setFreq] = useState<string>('2.45');

  const calcLMatch = () => {
    const Rs = parseFloat(rs);
    const Xs = parseFloat(xs);
    const Rl = parseFloat(rl);
    const Xl = parseFloat(xl);
    const fGHz = parseFloat(freq);

    if (isNaN(Rs) || isNaN(Xs) || isNaN(Rl) || isNaN(Xl) || isNaN(fGHz) || Rs <= 0 || Rl <= 0 || fGHz <= 0) return [];

    const omega = 2.0 * Math.PI * (fGHz * 1e9);
    const solutions = [];

    // Topology 1: Series-L, Shunt-C (when Rs > Rl)
    if (Rs > Rl) {
      const q = Math.sqrt(Rs / Rl - 1.0);
      
      // Sol A
      const xShunt = Rs / q;
      const xSeries = q * Rl - Xl;
      const shuntC = 1.0 / (omega * xShunt);
      const seriesL = (xSeries - Xs) / omega;
      if (seriesL > 0 && shuntC > 0) solutions.push({ type: 'Low-Pass', series: `L = ${(seriesL * 1e9).toFixed(2)} nH`, shunt: `C = ${(shuntC * 1e12).toFixed(2)} pF`, shuntPos: 'Load Side' });

      // Sol B
      const xShunt2 = -Rs / q;
      const xSeries2 = -q * Rl - Xl;
      const shuntL = Math.abs(xShunt2) / omega;
      const seriesC = 1.0 / (omega * Math.abs(xSeries2 - Xs));
      if (shuntL > 0 && seriesC > 0) solutions.push({ type: 'High-Pass', series: `C = ${(seriesC * 1e12).toFixed(2)} pF`, shunt: `L = ${(shuntL * 1e9).toFixed(2)} nH`, shuntPos: 'Load Side' });
    }

    // Topology 2: Shunt-first (when Rl > Rs)
    if (Rl > Rs) {
      const q = Math.sqrt(Rl / Rs - 1.0);

      // Sol A
      const xShunt = Rl / q;
      const xSeries = q * Rs - Xs;
      const shuntC = 1.0 / (omega * xShunt);
      const seriesL = xSeries / omega;
      if (seriesL > 0 && shuntC > 0) solutions.push({ type: 'Low-Pass', series: `L = ${(seriesL * 1e9).toFixed(2)} nH`, shunt: `C = ${(shuntC * 1e12).toFixed(2)} pF`, shuntPos: 'Source Side' });

      // Sol B
      const xShunt2 = -Rl / q;
      const xSeries2 = -q * Rs - Xs;
      const shuntL = Math.abs(xShunt2) / omega;
      const seriesC = 1.0 / (omega * Math.abs(xSeries2));
      if (shuntL > 0 && seriesC > 0) solutions.push({ type: 'High-Pass', series: `C = ${(seriesC * 1e12).toFixed(2)} pF`, shunt: `L = ${(shuntL * 1e9).toFixed(2)} nH`, shuntPos: 'Source Side' });
    }

    return solutions;
  };

  const solutions = calcLMatch();

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 p-6 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm mt-8">
      <h4 className="text-lg font-bold text-eng-blue dark:text-blue-300 mb-6">L-Network Impedance Matching Synthesizer</h4>
      
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Source Resistance (Ω)</label>
              <input type="number" step="any" value={rs} onChange={(e) => setRs(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Source Reactance (Ω)</label>
              <input type="number" step="any" value={xs} onChange={(e) => setXs(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Load Resistance (Ω)</label>
              <input type="number" step="any" value={rl} onChange={(e) => setRl(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Load Reactance (Ω)</label>
              <input type="number" step="any" value={xl} onChange={(e) => setXl(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Frequency (GHz)</label>
              <input type="number" step="0.1" value={freq} onChange={(e) => setFreq(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
          <h5 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Synthesized Networks</h5>
          {solutions.length > 0 ? (
            solutions.map((sol, i) => (
              <div key={i} className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="text-xs font-bold text-uci-blue uppercase tracking-wide mb-2">{sol.type} Solution</div>
                <div className="flex justify-between items-center text-sm mb-1"><span className="text-gray-600 dark:text-gray-400">Series Component</span> <span className="font-mono font-medium">{sol.series}</span></div>
                <div className="flex justify-between items-center text-sm"><span className="text-gray-600 dark:text-gray-400">Shunt Component ({sol.shuntPos})</span> <span className="font-mono font-medium text-eecs-teal">{sol.shunt}</span></div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400">No valid L-match solution. Source and Load might be identical or invalid input.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Receiver Cascade Analysis
   ========================================================================= */

export function ReceiverCascadeCalculator() {
  const [bw, setBw] = useState<string>('20'); // MHz
  const [nf, setNf] = useState<string>('3.5'); // dB
  const [iip3, setIip3] = useState<string>('-5.0'); // dBm
  const [snr, setSnr] = useState<string>('10.0'); // dB
  const [loss, setLoss] = useState<string>('2.0'); // dB

  const calcReceiver = () => {
    const bwHz = parseFloat(bw) * 1e6;
    const nF = parseFloat(nf);
    const ip3 = parseFloat(iip3);
    const sNr = parseFloat(snr);
    const lOss = parseFloat(loss);
    
    if (isNaN(bwHz) || isNaN(nF) || isNaN(ip3) || isNaN(sNr) || isNaN(lOss) || bwHz <= 0) return null;

    // Noise floor = -174 + 10*log10(BW) + NF
    const noiseFloor = -174.0 + 10.0 * Math.log10(bwHz) + nF;
    const mds = noiseFloor + sNr;
    const sfdr = (2.0 / 3.0) * (ip3 - noiseFloor);
    const sensitivity = mds + lOss;

    return { noiseFloor, sfdr, sensitivity };
  };

  const results = calcReceiver();

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 p-6 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm mt-8">
      <h4 className="text-lg font-bold text-eng-blue dark:text-blue-300 mb-6">System Receiver Analysis (MDS & SFDR)</h4>
      
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bandwidth (MHz)</label>
              <input type="number" step="any" value={bw} onChange={(e) => setBw(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">System NF (dB)</label>
              <input type="number" step="0.1" value={nf} onChange={(e) => setNf(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">System IIP3 (dBm)</label>
              <input type="number" step="0.1" value={iip3} onChange={(e) => setIip3(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Required SNR (dB)</label>
              <input type="number" step="0.1" value={snr} onChange={(e) => setSnr(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Implementation Loss (dB)</label>
              <input type="number" step="0.1" value={loss} onChange={(e) => setLoss(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
          <h5 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Performance Metrics</h5>
          {results ? (
            <>
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-400">Thermal Noise Floor</span> <span className="font-mono font-medium">{results.noiseFloor.toFixed(2)} dBm</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-400">Spurious-Free Dynamic Range (SFDR)</span> <span className="font-mono font-medium text-uci-blue dark:text-blue-400">{results.sfdr.toFixed(2)} dB</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-400">Receiver Sensitivity</span> <span className="font-mono font-medium text-green-600 dark:text-green-400 text-lg">{results.sensitivity.toFixed(2)} dBm</span></div>
            </>
          ) : (
            <div className="text-sm text-gray-400">Invalid input values</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   Patch Antenna Synthesis
   ========================================================================= */

export function PatchAntennaCalculator() {
  const [er, setEr] = useState<string>('4.4');
  const [height, setHeight] = useState<string>('1.6');
  const [freq, setFreq] = useState<string>('2.45');

  const calcAntenna = () => {
    const e = parseFloat(er);
    const h = parseFloat(height) * 1e-3; // convert to meters
    const fGHz = parseFloat(freq);
    
    if (isNaN(e) || isNaN(h) || isNaN(fGHz) || e < 1 || h <= 0 || fGHz <= 0) return null;

    const f = fGHz * 1e9;
    const c = 299792458.0;

    // Patch width
    const w = c / (2.0 * f) * Math.sqrt(2.0 / (e + 1.0));

    // Effective permittivity
    const eEff = (e + 1.0) / 2.0 + ((e - 1.0) / 2.0) * (1.0 / Math.sqrt(1.0 + 12.0 * h / w));

    // Extension length
    const deltaL = 0.412 * h * ((eEff + 0.3) * (w / h + 0.264)) / ((eEff - 0.258) * (w / h + 0.8));

    // Patch length
    const l = c / (2.0 * f * Math.sqrt(eEff)) - 2.0 * deltaL;

    // Free-space wavelength
    const lambda0 = c / f;
    const k0 = 2.0 * Math.PI / lambda0;

    // Radiation conductance G1
    const k0h = k0 * h;
    const g1 = (w / (120.0 * lambda0)) * (1.0 - k0h * k0h / 24.0);

    // Directivity approximation
    const k0w = k0 * w;
    let i1 = 0.0;
    const numSteps = 200;
    const dTheta = Math.PI / numSteps;
    for (let i = 0; i <= numSteps; i++) {
        const theta = i * dTheta;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const slotFactor = Math.abs(cosT) < 1e-10 ? k0w / 2.0 : Math.sin(k0w * cosT / 2.0) / cosT;
        const weight = (i === 0 || i === numSteps) ? 0.5 : 1.0;
        i1 += slotFactor * slotFactor * sinT * weight * dTheta;
    }
    const dLinear = 2.0 * k0w * k0w / Math.max(i1, 1e-15);
    const directivity = 10.0 * Math.log10(Math.max(dLinear, 1.0));

    return { 
      width: w * 1e3, 
      length: l * 1e3, 
      directivity,
      rin: 1.0 / (2.0 * Math.max(g1, 1e-15))
    };
  };

  const results = calcAntenna();

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 p-6 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm mt-8">
      <h4 className="text-lg font-bold text-eng-blue dark:text-blue-300 mb-6">Microstrip Patch Antenna Synthesis</h4>
      
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dielectric Constant (εr)</label>
              <input type="number" step="0.1" value={er} onChange={(e) => setEr(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Substrate Height (mm)</label>
              <input type="number" step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Frequency (GHz)</label>
              <input type="number" step="0.1" value={freq} onChange={(e) => setFreq(e.target.value)} className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-uci-blue outline-none font-mono" />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
          <h5 className="font-semibold text-sm text-gray-500 uppercase tracking-wider mb-2">Physical Dimensions</h5>
          {results ? (
            <>
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-400">Patch Width (W)</span> <span className="font-mono font-medium text-uci-blue dark:text-blue-400 text-lg">{results.width.toFixed(2)} mm</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-400">Patch Length (L)</span> <span className="font-mono font-medium text-uci-blue dark:text-blue-400 text-lg">{results.length.toFixed(2)} mm</span></div>
              <hr className="border-gray-200 dark:border-gray-700 my-2" />
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-400">Edge Input Impedance</span> <span className="font-mono font-medium">{results.rin.toFixed(1)} Ω</span></div>
              <div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-400">Directivity</span> <span className="font-mono font-medium text-eecs-teal">{results.directivity.toFixed(2)} dBi</span></div>
            </>
          ) : (
            <div className="text-sm text-gray-400">Invalid input values</div>
          )}
        </div>
      </div>
    </div>
  );
}