"use client";

import React, { useState, useMemo, ChangeEvent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UploadCloud, FileText, AlertCircle, Trash2 } from 'lucide-react';
import { parseTouchstone, sToZ, cDB } from '../lib/sParameterEngine';

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
  
  const [chartType, setChartType] = useState<'S' | 'L' | 'Q'>('S');
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
      if (parsed.length === 0) {
        throw new Error('Could not parse any valid frequency points. Check file format.');
      }
      
      const plotData = parsed.map(pt => {
        const f = pt.frequency;
        const fGHz = f / 1e9;
        
        const S = pt.matrix;
        const N = S.length;
        
        const z0 = pt.z0 || 50;
        const Z = sToZ(S, z0);
      
        const dataPoint: any = {
          frequency: f,
          fGHz: parseFloat(fGHz.toFixed(4)),
        };
      
        for (let i = 0; i < N; i++) {
          for (let j = 0; j < N; j++) {
            dataPoint[`S${i+1}${j+1}`] = parseFloat(cDB(S[i][j]).toFixed(4));
          }
        }
      
        if (Z) {
          const w = 2 * Math.PI * f;
          for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
              const zij = Z[i][j];
              if (i === j) {
                // L in nH
                dataPoint[`L${i+1}${i+1}`] = parseFloat(((zij.imag / w) * 1e9).toFixed(4));
                dataPoint[`Q${i+1}${i+1}`] = zij.real !== 0 ? parseFloat((zij.imag / zij.real).toFixed(4)) : 0;
              }
            }
          }
      
          if (N >= 2) {
            // Differential L and Q for ports 1 and 2
            const zdiff_real = Z[0][0].real + Z[1][1].real - Z[0][1].real - Z[1][0].real;
            const zdiff_imag = Z[0][0].imag + Z[1][1].imag - Z[0][1].imag - Z[1][0].imag;
            dataPoint['L_diff'] = parseFloat(((zdiff_imag / w) * 1e9).toFixed(4));
            dataPoint['Q_diff'] = zdiff_real !== 0 ? parseFloat((zdiff_imag / zdiff_real).toFixed(4)) : 0;
          }
        }
      
        return dataPoint;
      });

      setData(plotData);

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
      return Object.keys(data[0]).filter(k => k.startsWith('S'));
    } else if (chartType === 'L') {
      return Object.keys(data[0]).filter(k => k.startsWith('L'));
    } else if (chartType === 'Q') {
      return Object.keys(data[0]).filter(k => k.startsWith('Q'));
    }
    return [];
  }, [data, chartType]);

  const handleChartTypeChange = (type: 'S' | 'L' | 'Q') => {
    setChartType(type);
    if (data.length > 0) {
      if (type === 'S') {
        setSelectedKeys(numPorts >= 2 ? ['S11', 'S21'] : ['S11']);
      } else if (type === 'L') {
        setSelectedKeys(numPorts >= 2 ? ['L_diff', 'L11'] : ['L11']);
      } else if (type === 'Q') {
        setSelectedKeys(numPorts >= 2 ? ['Q_diff', 'Q11'] : ['Q11']);
      }
    }
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
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {chartType === 'S' ? 'dB' : chartType === 'L' ? 'nH' : ''}
            </p>
          ))}
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
            Upload a Touchstone file (.sNp) to view S-parameters, Inductance (L), and Quality Factor (Q).
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

      {data.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex gap-2 p-1.5 bg-slate-200/60 dark:bg-slate-900/80 rounded-lg overflow-x-auto w-full md:w-auto">
              {(['S', 'L', 'Q'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => handleChartTypeChange(type)}
                  className={`px-4 py-2 rounded-md text-sm font-semibold transition-all whitespace-nowrap ${
                    chartType === type 
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                  }`}
                >
                  {type === 'S' ? 'S-Parameters' : type === 'L' ? 'Inductance (L)' : 'Quality Factor (Q)'}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 w-full md:w-auto">
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
                    value: chartType === 'S' ? 'Magnitude (dB)' : chartType === 'L' ? 'Inductance (nH)' : 'Quality Factor', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 15,
                    fill: '#64748b'
                  }}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={chartType === 'S' ? ['auto', 'auto'] : ['auto', 'auto']}
                  stroke="#94a3b8"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={40} wrapperStyle={{ fontSize: '14px', fontWeight: 500 }} />
                {selectedKeys.map((key, i) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
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
