import { ParseResult, cMag } from './sParameterEngine';

export interface CascadeBlock {
  id: string;
  name: string;
  gain: number; // dB
  nf: number; // dB
  oip3: number; // dBm
  sParamData?: ParseResult;
  sParamFileName?: string;
}

export interface SweptCascadeResult {
  frequency: number;
  cascadedGain: number;
  cascadedNF: number;
  cascadedIIP3: number;
  cascadedOIP3: number;
}

export interface CascadeResult {
  cascadedGain: number; // dB
  cascadedNF: number; // dB
  cascadedIIP3: number; // dBm
  cascadedOIP3: number; // dBm
  sweptResults?: SweptCascadeResult[];
}

function getGainAtFreq(block: CascadeBlock, targetFreq: number): number {
  if (!block.sParamData || block.sParamData.points.length === 0) {
    return block.gain;
  }
  
  const points = block.sParamData.points;
  const numPorts = points[0].matrix.length;
  // If 2-port use S21, if 1-port use S11
  const getMag = (pt: any) => cMag(numPorts > 1 ? pt.matrix[1][0] : pt.matrix[0][0]);
  
  if (targetFreq <= points[0].frequency) {
    return 20 * Math.log10(getMag(points[0]) + 1e-15);
  }
  if (targetFreq >= points[points.length - 1].frequency) {
    const last = points[points.length - 1];
    return 20 * Math.log10(getMag(last) + 1e-15);
  }

  // Linear interpolation
  for (let i = 0; i < points.length - 1; i++) {
    if (targetFreq >= points[i].frequency && targetFreq <= points[i + 1].frequency) {
      const f1 = points[i].frequency;
      const f2 = points[i + 1].frequency;
      const g1 = 20 * Math.log10(getMag(points[i]) + 1e-15);
      const g2 = 20 * Math.log10(getMag(points[i+1]) + 1e-15);
      
      const fraction = (targetFreq - f1) / (f2 - f1);
      return g1 + fraction * (g2 - g1);
    }
  }
  
  return block.gain;
}

export function calculateCascade(blocks: CascadeBlock[]): CascadeResult {
  if (blocks.length === 0) {
    return { cascadedGain: 0, cascadedNF: 0, cascadedIIP3: 0, cascadedOIP3: 0 };
  }

  let totalGainDB = 0;
  let currentLinNF = 0;
  let currentLinIIP3Inv = 0; // 1 / IIP3_linear

  let accumulatedLinearGain = 1;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    
    // Convert to linear values
    const linGain = Math.pow(10, block.gain / 10);
    const linNF = Math.pow(10, block.nf / 10);
    
    // block OIP3 -> block IIP3
    const iip3DBm = block.oip3 - block.gain;
    const linIIP3 = Math.pow(10, iip3DBm / 10);

    if (i === 0) {
      currentLinNF = linNF;
      currentLinIIP3Inv = 1 / linIIP3;
    } else {
      currentLinNF += (linNF - 1) / accumulatedLinearGain;
      currentLinIIP3Inv += accumulatedLinearGain / linIIP3;
    }

    accumulatedLinearGain *= linGain;
    totalGainDB += block.gain;
  }

  const cascadedNFDB = 10 * Math.log10(currentLinNF);
  const cascadedIIP3Linear = 1 / currentLinIIP3Inv;
  const cascadedIIP3DBm = 10 * Math.log10(cascadedIIP3Linear);
  const cascadedOIP3DBm = cascadedIIP3DBm + totalGainDB;

  // Now calculate swept results if any block has sParamData
  let frequencies = new Set<number>();
  blocks.forEach(b => {
    if (b.sParamData) {
      b.sParamData.points.forEach(p => frequencies.add(p.frequency));
    }
  });

  let sweptResults: SweptCascadeResult[] | undefined = undefined;

  if (frequencies.size > 0) {
    const sortedFreqs = Array.from(frequencies).sort((a, b) => a - b);
    sweptResults = sortedFreqs.map(f => {
      let totalG = 0;
      let linNF = 0;
      let linIIP3Inv = 0;
      let accLinGain = 1;

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const gainAtF = getGainAtFreq(b, f);
        const lGain = Math.pow(10, gainAtF / 10);
        const lNf = Math.pow(10, b.nf / 10);
        const lIip3 = Math.pow(10, (b.oip3 - gainAtF) / 10);

        if (i === 0) {
          linNF = lNf;
          linIIP3Inv = 1 / lIip3;
        } else {
          linNF += (lNf - 1) / accLinGain;
          linIIP3Inv += accLinGain / lIip3;
        }
        accLinGain *= lGain;
        totalG += gainAtF;
      }
      return {
        frequency: f,
        cascadedGain: totalG,
        cascadedNF: 10 * Math.log10(linNF),
        cascadedIIP3: 10 * Math.log10(1 / linIIP3Inv),
        cascadedOIP3: 10 * Math.log10(1 / linIIP3Inv) + totalG
      };
    });
  }

  return {
    cascadedGain: totalGainDB,
    cascadedNF: cascadedNFDB,
    cascadedIIP3: cascadedIIP3DBm,
    cascadedOIP3: cascadedOIP3DBm,
    sweptResults,
  };
}
