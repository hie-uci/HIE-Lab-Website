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
  let M: Complex[][] = [];
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

export interface SParamMatrix {
  frequency: number; // Hz
  matrix: Complex[][]; // NxN
  z0: number;
}

export function parseTouchstone(content: string, numPorts: number): SParamMatrix[] {
  const lines = content.split('\n');
  let optionLine = '';
  const dataTokens: string[] = [];

  for (let line of lines) {
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
  let lastFreq = -1;

  while (i + tokensPerPoint <= dataTokens.length) {
    const fVal = parseFloat(dataTokens[i]);
    if (isNaN(fVal)) break; // Malformed data

    const f = fVal * freqMultiplier;
    
    // Check if it's noise data (frequency usually increases in S-param blocks, if it drops, it might be noise data. 
    // Wait, some files are ordered descending. Let's just check if it's the exact same or if the number of remaining tokens is not enough.)
    // Actually, noise data has 5 columns. Let's just parse as long as we can extract full S-parameters.

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
    points.push({ frequency: f, matrix, z0 });
    i += tokensPerPoint;
  }
  return points;
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
