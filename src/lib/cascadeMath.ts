export interface CascadeBlock {
  id: string;
  name: string;
  gain: number; // dB
  nf: number; // dB
  oip3: number; // dBm
}

export interface CascadeResult {
  cascadedGain: number; // dB
  cascadedNF: number; // dB
  cascadedIIP3: number; // dBm
  cascadedOIP3: number; // dBm
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

  return {
    cascadedGain: totalGainDB,
    cascadedNF: cascadedNFDB,
    cascadedIIP3: cascadedIIP3DBm,
    cascadedOIP3: cascadedOIP3DBm,
  };
}
