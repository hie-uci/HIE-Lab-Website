"use client";

import React, { useState, useMemo, ChangeEvent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UploadCloud, FileText, AlertCircle, Trash2, ShieldAlert } from 'lucide-react';
import { parseTouchstone, sToZ, sToMixedMode, cDB, cPhase } from '../lib/sParameterEngine';

const colors = [
  '#ef4444', // red-500
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#14b8a6', // teal-500
];

export default function SParameterViewer() {
  const [data, setData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isPassive, setIsPassive] = useState<boolean>(true);
  
  const [chartType, setChartType] = useState<'S' | 'L' | 'Q' | 'C'>('S');
  const [sParamViewType, setSParamViewType] = useState<'Magnitude' | 'Phase'>('Magnitude');
  const [sParamMode, setSParamMode] = useState<'Single' | 'Mixed'>('Single');
  
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [numPorts, setNumPorts] = useState<number>(0);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    
    const match = file.name.match(/\.s(\d+)p$/i);
    let ports = 2;
    if (match) {
      ports = parseInt(match[1]);
    } else {
      ports = 2;
    }
    setNumPorts(ports);

    try {
      const text = await file.text();
      const parsed = parseTouchstone(text, ports);
      if (parsed.points.length === 0) {
        throw new Error('Could not parse any valid frequency points. Check file format.');
      }
      setIsPassive(parsed.isPassive);
      
      const plotData = parsed.points.map(pt => {
        const f = pt.frequency;
        const fGHz = f / 1e9;
        const w = 2 * Math.PI * f;
        
        const S = pt.matrix;
        const N = S.length;
        
        const z0 = pt.z0 || 50;
        const Z = sToZ(S, z0);
      
        const dataPoint: any = {
          frequency: f,
          fGHz: parseFloat(fGHz.toFixed(4)),
        };
      
        // Standard Single-Ended S-Parameters
        for (let i = 0; i < N; i++) {
          for (let j = 0; j < N; j++) {
            dataPoint[`S${i+1}${j+1}_Mag`] = parseFloat(cDB(S[i][j]).toFixed(4));
            dataPoint[`S${i+1}${j+1}_Phase`] = parseFloat((cPhase(S[i][j]) * 180 / Math.PI).toFixed(4));
          }
        }

        // Mixed-Mode for 4-port
        if (N === 4) {
          const S_mm = sToMixedMode(S);
          if (S_mm) {
            // S_mm is 4x4. Map back to Sdd11, Sdd21, Scc, etc.
            // 0: dd1, 1: dd2, 2: cc1, 3: cc2
            const mmLabels = ['dd1', 'dd2', 'cc1', 'cc2'];
            for (let i = 0; i < 4; i++) {
              for (let j = 0; j < 4; j++) {
                const label = `S${mmLabels[i][0]}${mmLabels[j][0]}${mmLabels[i][2]}${mmLabels[j][2]}`; // e.g., Sdd11
                dataPoint[`${label}_Mag`] = parseFloat(cDB(S_mm[i][j]).toFixed(4));
                dataPoint[`${label}_Phase`] = parseFloat((cPhase(S_mm[i][j]) * 180 / Math.PI).toFixed(4));
              }
            }
          }
        }
      
        if (Z) {
          for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
              const zij = Z[i][j];
              if (i === j) {
                // L in nH, C in pF
                dataPoint[`L${i+1}${i+1}`] = parseFloat(((zij.imag / w) * 1e9).toFixed(4));
                dataPoint[`C${i+1}${i+1}`] = zij.imag !== 0 ? parseFloat(((-1 / (w * zij.imag)) * 1e12).toFixed(4)) : 0;
                dataPoint[`Q${i+1}${i+1}`] = zij.real !== 0 ? parseFloat((zij.imag / zij.real).toFixed(4)) : 0;
              }
            }
          }
      
          if (N >= 2) {
            // Differential L, C, and Q for ports 1 and 2
            const zdiff_real = Z[0][0].real + Z[1][1].real - Z[0][1].real - Z[1][0].real;
            const zdiff_imag = Z[0][0].imag + Z[1][1].imag - Z[0][1].imag - Z[1][0].imag;
            dataPoint['L_diff'] = parseFloat(((zdiff_imag / w) * 1e9).toFixed(4));
            dataPoint['C_diff'] = zdiff_imag !== 0 ? parseFloat(((-1 / (w * zdiff_imag)) * 1e12).toFixed(4)) : 0;
            dataPoint['Q_diff'] = zdiff_real !== 0 ? parseFloat((zdiff_imag / zdiff_real).toFixed(4)) : 0;
          }
        }
      
        return dataPoint;
      });

      setData(plotData);
      setSParamMode('Single');
      setSParamViewType('Magnitude');

      if (ports >= 2) {
        setSelectedKeys(['S11', 'S21']);
      } else {
        setSelectedKeys(['S11']);
      }
      setChartType('S');

    } catch (err: any) {
      setError(err.message || 'Error parsing Touchstone file.');
      setData([]);
    }
  };

  const handleClear = () => {
    setData([]);
    setFileName('');
    setError('');
    setSelectedKeys([]);
  };

  const availableKeys = useMemo(() => {
    if (data.length === 0) return [];
    if (chartType === 'S') {
      if (sParamMode === 'Mixed') {
        return ['Sdd11', 'Sdd21', 'Sdd12', 'Sdd22', 'Scc11', 'Scc21', 'Scc12', 'Scc22', 'Scd11', 'Sdc11'];
      }
      const keys = [];
      for (let i = 1; i <= numPorts; i++) {
        for (let j = 1; j <= numPorts; j++) {
          keys.push(`S${i}${j}`);
        }
      }
      return keys;
    } else if (chartType === 'L') {
      return Object.keys(data[0]).filter(k => k.startsWith('L'));
    } else if (chartType === 'C') {
      return Object.keys(data[0]).filter(k => k.startsWith('C'));
    } else if (chartType === 'Q') {
      return Object.keys(data[0]).filter(k => k.startsWith('Q'));
    }
    return [];
  }, [data, chartType, sParamMode, numPorts]);

  const handleChartTypeChange = (type: 'S' | 'L' | 'Q' | 'C') => {
    setChartType(type);
    if (data.length > 0) {
      if (type === 'S') {
        if (sParamMode === 'Mixed') setSelectedKeys(['Sdd11', 'Sdd21']);
        else setSelectedKeys(numPorts >= 2 ? ['S11', 'S21'] : ['S11']);
      } else if (type === 'L') {
        setSelectedKeys(numPorts >= 2 ? ['L_diff', 'L11'] : ['L11']);
      } else if (type === 'C') {
        setSelectedKeys(numPorts >= 2 ? ['C_diff', 'C11'] : ['C11']);
      } else if (type === 'Q') {
        setSelectedKeys(numPorts >= 2 ? ['Q_diff', 'Q11'] : ['Q11']);
      }
    }
  };

  const handleModeChange = (mode: 'Single' | 'Mixed') => {
    setSParamMode(mode);
    if (mode === 'Mixed') setSelectedKeys(['Sdd11', 'Sdd21']);
    else setSelectedKeys(['S11', 'S21']);
  };

  const toggleKey = (key: string) => {
    setSelectedKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">{`${label} GHz`}</p>
          {payload.map((entry: any, index: number) => {
            // Reconstruct name for display if it's an S-parameter
            const isS = entry.dataKey.includes('_Mag') || entry.dataKey.includes('_Phase');
            const name = isS ? entry.dataKey.split('_')[0] : entry.name;
            const unit = chartType === 'S' 
              ? (sParamViewType === 'Magnitude' ? 'dB' : '°') 
              : chartType === 'L' ? 'nH' : chartType === 'C' ? 'pF' : '';
            return (
              <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
                {name}: {entry.value} {unit}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4 md:p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">S-Parameter Viewer & Calculator</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload a Touchstone file (.sNp) to view S-parameters, L, C, and Q.
          </p>
        </div>
        
        {!data.length ? (
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm shrink-0">
            <UploadCloud size={20} />
            <span>Upload File</span>
            <input type="file" accept=".s1p,.s2p,.s3p,.s4p,.s5p,.s6p,.s7p,.s8p,.s9p,.s10p,.s11p,.s12p" className="hidden" onChange={handleFileUpload} />
          </label>
        ) : (
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
            <FileText size={18} className="text-blue-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[150px] md:max-w-[250px]">{fileName}</span>
            <button onClick={handleClear} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md text-red-500 transition-colors" title="Remove file">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-3 text-sm font-medium border border-red-200 dark:border-red-800/30">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {data.length > 0 && !isPassive && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg flex items-center gap-3 text-sm font-medium border border-yellow-200 dark:border-yellow-800/30">
          <ShieldAlert size={18} className="shrink-0" />
          <span>Warning: File contains non-passive data (Magnitude &gt; 0 dB). This is normal for active components like Amplifiers, but check your calibration if this is a passive structure.</span>
        </div>
      )}

      {data.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-900/80 rounded-lg overflow-x-auto w-full md:w-auto">
                {(['S', 'L', 'C', 'Q'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => handleChartTypeChange(type)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${
                      chartType === type 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {type === 'S' ? 'S-Params' : type === 'L' ? 'Inductance' : type === 'C' ? 'Capacitance' : 'Q-Factor'}
                  </button>
                ))}
              </div>

              {chartType === 'S' && numPorts === 4 && (
                <div className="flex gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-900/80 rounded-lg">
                  {(['Single', 'Mixed'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => handleModeChange(mode)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                        sParamMode === mode 
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}

              {chartType === 'S' && (
                <div className="flex gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-900/80 rounded-lg">
                  {(['Magnitude', 'Phase'] as const).map(view => (
                    <button
                      key={view}
                      onClick={() => setSParamViewType(view)}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                        sParamViewType === view 
                          ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-1">Plot:</span>
              {availableKeys.map(key => (
                <label key={key} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedKeys.includes(key)} 
                    onChange={() => toggleKey(key)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-800 transition-colors cursor-pointer"
                  />
                  {key}
                </label>
              ))}
            </div>
          </div>

          <div className="h-[450px] w-full mt-2 bg-white dark:bg-slate-900 rounded-xl">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                <XAxis 
                  dataKey="fGHz" 
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickCount={10}
                  label={{ value: 'Frequency (GHz)', position: 'bottom', offset: 0, fill: '#64748b' }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => val.toFixed(2)}
                  stroke="#94a3b8"
                />
                <YAxis 
                  label={{ 
                    value: chartType === 'S' ? (sParamViewType === 'Magnitude' ? 'Magnitude (dB)' : 'Phase (Degrees)') : chartType === 'L' ? 'Inductance (nH)' : chartType === 'C' ? 'Capacitance (pF)' : 'Quality Factor', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 15,
                    fill: '#64748b'
                  }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={['auto', 'auto']}
                  stroke="#94a3b8"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={40} wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
                {selectedKeys.map((key, i) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={chartType === 'S' ? `${key}_${sParamViewType}` : key}
                    name={key}
                    stroke={colors[i % colors.length]} 
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}