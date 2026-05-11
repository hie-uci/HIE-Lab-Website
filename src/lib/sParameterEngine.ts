export interface Complex {
  real: number;
  imag: number;
}

export const cAdd = (a: Complex, b: Complex): Complex => ({ real: a.real + b.real, imag: a.imag + b.imag });
export const cSub = (a: Complex, b: Complex): Complex => ({ real: a.real - b.real, imag: a.imag - b.imag });
export const cMul = (a: Complex, b: Complex): Complex => ({
  real: a.real * b.real - a.imag * b.imag,
  imag: a.real * b.imag + a.imag * b.real
});
export const cDiv = (a: Complex, b: Complex): Complex => {
  const den = b.real * b.real + b.imag * b.imag;
  if (den === 0) return { real: 0, imag: 0 };
  return {
    real: (a.real * b.real + a.imag * b.imag) / den,
    imag: (a.imag * b.real - a.real * b.imag) / den
  };
};

export const cMag = (a: Complex): number => Math.sqrt(a.real * a.real + a.imag * a.imag);
export const cPhase = (a: Complex): number => Math.atan2(a.imag, a.real);
export const cDB = (a: Complex): number => 20 * Math.log10(cMag(a) + 1e-15);

// Matrix operations
export const mIdentity = (n: number): Complex[][] => {
  const I: Complex[][] = [];
  for (let i = 0; i < n; i++) {
    I.push(new Array(n).fill({ real: 0, imag: 0 }));
    I[i][i] = { real: 1, imag: 0 };
  }
  return I;
};

export const mAdd = (A: Complex[][], B: Complex[][]): Complex[][] => 
  A.map((row, i) => row.map((val, j) => cAdd(val, B[i][j])));

export const mSub = (A: Complex[][], B: Complex[][]): Complex[][] => 
  A.map((row, i) => row.map((val, j) => cSub(val, B[i][j])));

export const mMul = (A: Complex[][], B: Complex[][]): Complex[][] => {
  const n = A.length;
  const C: Complex[][] = mIdentity(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let sum = { real: 0, imag: 0 };
      for (let k = 0; k < n; k++) {
        sum = cAdd(sum, cMul(A[i][k], B[k][j]));
      }
      C[i][j] = sum;
    }
  }
  return C;
};

export const mScale = (A: Complex[][], scalar: Complex): Complex[][] =>
  A.map(row => row.map(val => cMul(val, scalar)));

// Matrix inverse via Gaussian elimination with partial pivoting
export const mInverse = (A: Complex[][]): Complex[][] | null => {
  const n = A.length;
  const M: Complex[][] = [];
  for (let i = 0; i < n; i++) {
    M.push([...A[i], ...mIdentity(n)[i]]);
  }

  for (let i = 0; i < n; i++) {
    let pivot = i;
    let maxMag = cMag(M[i][i]);
    for (let j = i + 1; j < n; j++) {
      const mag = cMag(M[j][i]);
      if (mag > maxMag) {
        maxMag = mag;
        pivot = j;
      }
    }
    if (maxMag < 1e-15) return null; // Singular matrix

    if (pivot !== i) {
      const temp = M[i];
      M[i] = M[pivot];
      M[pivot] = temp;
    }

    const div = M[i][i];
    for (let j = 0; j < 2 * n; j++) {
      M[i][j] = cDiv(M[i][j], div);
    }

    for (let j = 0; j < n; j++) {
      if (j !== i) {
        const factor = M[j][i];
        for (let k = 0; k < 2 * n; k++) {
          M[j][k] = cSub(M[j][k], cMul(factor, M[i][k]));
        }
      }
    }
  }

  const inv: Complex[][] = [];
  for (let i = 0; i < n; i++) {
    inv.push(M[i].slice(n, 2 * n));
  }
  return inv;
};

export const sToZ = (S: Complex[][], z0: number): Complex[][] | null => {
  const n = S.length;
  const I = mIdentity(n);
  const I_minus_S = mSub(I, S);
  const I_plus_S = mAdd(I, S);
  
  const inv = mInverse(I_minus_S);
  if (!inv) return null;

  const Z = mMul(I_plus_S, inv);
  return mScale(Z, { real: z0, imag: 0 });
};

export const sToY = (S: Complex[][], z0: number): Complex[][] | null => {
  const n = S.length;
  const I = mIdentity(n);
  const I_minus_S = mSub(I, S);
  const I_plus_S = mAdd(I, S);
  
  const inv = mInverse(I_plus_S);
  if (!inv) return null;

  const Y = mMul(I_minus_S, inv);
  return mScale(Y, { real: 1 / z0, imag: 0 });
};

// Converts 4-port single-ended S-parameters to Mixed-Mode S-parameters.
// Assumes Ports 1,2 = Diff Port 1; Ports 3,4 = Diff Port 2.
export const sToMixedMode = (S: Complex[][]): Complex[][] | null => {
  if (S.length !== 4) return null;
  
  const M_vals = [
    [ 1, -1,  0,  0 ], // Sdd1
    [ 0,  0,  1, -1 ], // Sdd2
    [ 1,  1,  0,  0 ], // Scc1
    [ 0,  0,  1,  1 ]  // Scc2
  ];
  const s2 = 1.0 / Math.sqrt(2);
  
  const M: Complex[][] = [];
  const M_inv: Complex[][] = []; // for orthogonal matrix, M_inv = M_transpose
  
  for (let i=0; i<4; i++) {
    M.push([]);
    M_inv.push([]);
    for (let j=0; j<4; j++) {
      M[i].push({ real: M_vals[i][j] * s2, imag: 0 });
      M_inv[i].push({ real: M_vals[j][i] * s2, imag: 0 }); // Transpose
    }
  }

  // S_mm = M * S * M_inv
  const MS = mMul(M, S);
  return mMul(MS, M_inv);
};

export interface SParamMatrix {
  frequency: number; // Hz
  matrix: Complex[][]; // NxN
  z0: number;
  vswr?: number[];
  Y?: Complex[][];
  Z?: Complex[][];
  ESR?: number[];
  Rp?: number[];
  K?: number;
  groupDelay?: number; // in seconds
}

export interface ParseResult {
  points: SParamMatrix[];
  isPassive: boolean;
}

export function parseTouchstone(content: string, numPorts: number): ParseResult {
  const lines = content.split('\n');
  let optionLine = '';
  const dataTokens: string[] = [];

  for (const line of lines) {
    let raw = line.trim();
    if (!raw) continue;
    const commentIdx = raw.indexOf('!');
    if (commentIdx !== -1) {
      raw = raw.substring(0, commentIdx).trim();
    }
    if (!raw) continue;

    if (raw.startsWith('#')) {
      optionLine = raw;
      continue;
    }

    // Split by whitespace
    const tokens = raw.split(/\s+/);
    dataTokens.push(...tokens);
  }

  let freqMultiplier = 1e9; // default GHz
  let format = 'MA';
  let z0 = 50;

  if (optionLine) {
    const opts = optionLine.substring(1).trim().toUpperCase().split(/\s+/);
    for (let i = 0; i < opts.length; i++) {
      const opt = opts[i];
      if (opt === 'HZ') freqMultiplier = 1;
      else if (opt === 'KHZ') freqMultiplier = 1e3;
      else if (opt === 'MHZ') freqMultiplier = 1e6;
      else if (opt === 'GHZ') freqMultiplier = 1e9;
      else if (opt === 'DB') format = 'DB';
      else if (opt === 'MA') format = 'MA';
      else if (opt === 'RI') format = 'RI';
      else if (opt === 'R' && i + 1 < opts.length) {
        z0 = parseFloat(opts[i+1]);
      }
    }
  }

  const points: SParamMatrix[] = [];
  const tokensPerPoint = 1 + 2 * numPorts * numPorts;
  
  let i = 0;
  let isPassive = true;

  while (i + tokensPerPoint <= dataTokens.length) {
    const fVal = parseFloat(dataTokens[i]);
    if (isNaN(fVal)) break; // Malformed data

    const f = fVal * freqMultiplier;

    const matrix: Complex[][] = [];
    for (let r = 0; r < numPorts; r++) {
      matrix.push(new Array(numPorts).fill({real: 0, imag: 0}));
    }

    let t = i + 1;
    if (numPorts === 2) {
      // Order: S11, S21, S12, S22
      matrix[0][0] = createComplex(dataTokens[t], dataTokens[t+1], format);
      matrix[1][0] = createComplex(dataTokens[t+2], dataTokens[t+3], format);
      matrix[0][1] = createComplex(dataTokens[t+4], dataTokens[t+5], format);
      matrix[1][1] = createComplex(dataTokens[t+6], dataTokens[t+7], format);
    } else {
      for (let r = 0; r < numPorts; r++) {
        for (let c = 0; c < numPorts; c++) {
          matrix[r][c] = createComplex(dataTokens[t], dataTokens[t+1], format);
          t += 2;
        }
      }
    }
    
    // Check passivity (+0.1 dB margin = 1.011579 linear mag)
    for (let r = 0; r < numPorts; r++) {
      for (let c = 0; c < numPorts; c++) {
        if (cMag(matrix[r][c]) > 1.011579) {
          isPassive = false;
        }
      }
    }

    points.push({ frequency: f, matrix, z0 });
    i += tokensPerPoint;
  }

  // Post-process metrics (Y, Z, VSWR, ESR, Rp, K, Group Delay)
  let prevPhase: number | null = null;
  for (let k = 0; k < points.length; k++) {
    const S = points[k].matrix;
    const f = points[k].frequency;
    
    const vswr: number[] = [];
    for (let p = 0; p < numPorts; p++) {
      const mag = cMag(S[p][p]);
      vswr.push((1 + mag) / (1 - mag + 1e-15));
    }
    points[k].vswr = vswr;

    const Y = sToY(S, z0);
    const Z = sToZ(S, z0);
    points[k].Y = Y || undefined;
    points[k].Z = Z || undefined;

    const esr: number[] = [];
    const rp: number[] = [];
    if (Z && Y) {
      for (let p = 0; p < numPorts; p++) {
        esr.push(Z[p][p].real);
        rp.push(1 / (Y[p][p].real || 1e-15));
      }
    }
    points[k].ESR = esr.length ? esr : undefined;
    points[k].Rp = rp.length ? rp : undefined;

    if (numPorts === 2) {
      const s11 = S[0][0], s21 = S[1][0], s12 = S[0][1], s22 = S[1][1];
      const delta = cSub(cMul(s11, s22), cMul(s12, s21));
      const magS11_2 = Math.pow(cMag(s11), 2);
      const magS22_2 = Math.pow(cMag(s22), 2);
      const magDelta_2 = Math.pow(cMag(delta), 2);
      const den = 2 * cMag(cMul(s12, s21));
      points[k].K = (1 - magS11_2 - magS22_2 + magDelta_2) / (den + 1e-15);

      const currentPhase = cPhase(s21) * 180 / Math.PI;
      if (prevPhase === null) {
        points[k].groupDelay = 0;
      } else {
        let dPhase = currentPhase - prevPhase;
        while (dPhase > 180) dPhase -= 360;
        while (dPhase < -180) dPhase += 360;
        
        const df = f - points[k-1].frequency;
        if (df !== 0) {
          points[k].groupDelay = - (1 / 360) * (dPhase / df);
        } else {
          points[k].groupDelay = 0;
        }
      }
      prevPhase = currentPhase;
    }
  }

  if (numPorts === 2 && points.length > 1) {
    points[0].groupDelay = points[1].groupDelay;
  }

  return { points, isPassive };
}

function createComplex(v1: string, v2: string, format: string): Complex {
  const n1 = parseFloat(v1);
  const n2 = parseFloat(v2);
  if (isNaN(n1) || isNaN(n2)) return { real: 0, imag: 0 };
  
  if (format === 'DB') {
    const mag = Math.pow(10, n1 / 20);
    const rad = n2 * Math.PI / 180;
    return { real: mag * Math.cos(rad), imag: mag * Math.sin(rad) };
  } else if (format === 'MA') {
    const rad = n2 * Math.PI / 180;
    return { real: n1 * Math.cos(rad), imag: n1 * Math.sin(rad) };
  } else {
    // RI
    return { real: n1, imag: n2 };
  }
}
