"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Handle,
  Position,
  NodeProps,
  BackgroundVariant,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { calculateCascade, CascadeBlock, CascadeResult } from '@/lib/cascadeMath';

// Custom Node for RF Block
const RFBlockNode = ({ data, id }: NodeProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg p-3 shadow-md min-w-[170px] text-gray-900 dark:text-gray-100 font-sans">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-none" />
      <div className="font-bold text-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">{data.name as string}</div>
      <div className="flex flex-col gap-2.5 text-xs">
        <div className="flex justify-between items-center gap-3">
          <label className="text-gray-600 dark:text-gray-400 font-medium">Gain (dB)</label>
          <input 
            type="number" 
            className="w-16 p-1 border rounded bg-gray-50 border-gray-300 dark:bg-gray-900 dark:border-gray-600 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={data.gain as number}
            onChange={(e) => (data.onChange as Function)(id, 'gain', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="flex justify-between items-center gap-3">
          <label className="text-gray-600 dark:text-gray-400 font-medium">NF (dB)</label>
          <input 
            type="number" 
            className="w-16 p-1 border rounded bg-gray-50 border-gray-300 dark:bg-gray-900 dark:border-gray-600 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={data.nf as number}
            onChange={(e) => (data.onChange as Function)(id, 'nf', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="flex justify-between items-center gap-3">
          <label className="text-gray-600 dark:text-gray-400 font-medium">OIP3 (dBm)</label>
          <input 
            type="number" 
            className="w-16 p-1 border rounded bg-gray-50 border-gray-300 dark:bg-gray-900 dark:border-gray-600 text-right focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={data.oip3 as number}
            onChange={(e) => (data.onChange as Function)(id, 'oip3', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-none" />
    </div>
  );
};

const initialNodes: Node[] = [
  { id: '1', type: 'rfBlock', position: { x: 50, y: 150 }, data: { name: 'LNA', gain: 15, nf: 1.5, oip3: 20 } },
  { id: '2', type: 'rfBlock', position: { x: 300, y: 150 }, data: { name: 'Filter', gain: -2, nf: 2, oip3: 100 } },
  { id: '3', type: 'rfBlock', position: { x: 550, y: 150 }, data: { name: 'Mixer', gain: -6, nf: 6, oip3: 15 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export default function SystemCascadeBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [cascadeResult, setCascadeResult] = useState<CascadeResult | null>(null);

  const onNodeDataChange = useCallback((id: string, field: string, value: number) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const nodeTypes = useMemo(() => {
    const RFBlockNodeWrapper = (props: NodeProps) => {
      return <RFBlockNode {...props} data={{...props.data, onChange: onNodeDataChange}} />
    };
    return { rfBlock: RFBlockNodeWrapper };
  }, [onNodeDataChange]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), [setEdges]);

  // Compute cascade path and results
  useEffect(() => {
    if (nodes.length === 0) {
      setCascadeResult(null);
      return;
    }

    const incomingEdgeCount: Record<string, number> = {};
    const outgoingEdges: Record<string, string> = {};
    
    nodes.forEach(n => {
      incomingEdgeCount[n.id] = 0;
    });

    edges.forEach(e => {
      if (incomingEdgeCount[e.target] !== undefined) {
        incomingEdgeCount[e.target]++;
      }
      outgoingEdges[e.source] = e.target;
    });

    // Find start nodes
    const startNodes = nodes.filter(n => incomingEdgeCount[n.id] === 0);
    
    if (startNodes.length === 0) {
      setCascadeResult(null);
      return;
    }

    // Follow the first valid chain found
    const chain: CascadeBlock[] = [];
    let currentNodeId: string | undefined = startNodes[0].id;
    const visited = new Set<string>();

    while (currentNodeId && !visited.has(currentNodeId)) {
      visited.add(currentNodeId);
      const node = nodes.find(n => n.id === currentNodeId);
      if (node) {
        chain.push({
          id: node.id,
          name: node.data.name as string,
          gain: node.data.gain as number,
          nf: node.data.nf as number,
          oip3: node.data.oip3 as number,
        });
      }
      currentNodeId = outgoingEdges[currentNodeId];
    }

    if (chain.length > 0) {
      const result = calculateCascade(chain);
      setCascadeResult(result);
    } else {
      setCascadeResult(null);
    }
  }, [nodes, edges]);

  const addBlock = (name: string) => {
    const newNodeId = `node_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'rfBlock',
      position: { x: Math.random() * 100 + 100, y: Math.random() * 100 + 100 },
      data: { name, gain: 0, nf: 0, oip3: 0 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[700px] w-full border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-gray-950 font-sans">
      
      {/* Sidebar Controls */}
      <div className="w-full lg:w-72 bg-gray-50/50 dark:bg-gray-900/50 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 flex flex-col gap-6 overflow-y-auto shrink-0 z-10 backdrop-blur-sm">
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            Components
          </h3>
          <div className="flex flex-col gap-2.5">
            <button onClick={() => addBlock('LNA')} className="px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition font-medium text-left flex justify-between items-center group">
              <span>Low Noise Amp</span>
              <span className="text-xl leading-none text-gray-400 group-hover:text-blue-500">+</span>
            </button>
            <button onClick={() => addBlock('Mixer')} className="px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-sm transition font-medium text-left flex justify-between items-center group">
              <span>Mixer</span>
              <span className="text-xl leading-none text-gray-400 group-hover:text-purple-500">+</span>
            </button>
            <button onClick={() => addBlock('Filter')} className="px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-400 dark:hover:border-green-500 hover:shadow-sm transition font-medium text-left flex justify-between items-center group">
              <span>Filter</span>
              <span className="text-xl leading-none text-gray-400 group-hover:text-green-500">+</span>
            </button>
            <button onClick={() => addBlock('PA')} className="px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-red-400 dark:hover:border-red-500 hover:shadow-sm transition font-medium text-left flex justify-between items-center group">
              <span>Power Amp</span>
              <span className="text-xl leading-none text-gray-400 group-hover:text-red-500">+</span>
            </button>
            <button onClick={() => addBlock('Attenuator')} className="px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition font-medium text-left flex justify-between items-center group">
              <span>Attenuator</span>
              <span className="text-xl leading-none text-gray-400 group-hover:text-gray-500">+</span>
            </button>
          </div>
          <button onClick={clearCanvas} className="mt-4 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition font-medium text-sm">
            Clear Canvas
          </button>
        </div>

        <div className="mt-auto">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-800 pt-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
            System Results
          </h3>
          {cascadeResult ? (
            <div className="flex flex-col gap-3">
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Gain</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{cascadeResult.cascadedGain.toFixed(2)} <span className="text-xs font-normal text-gray-500">dB</span></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">NF</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">{cascadeResult.cascadedNF.toFixed(2)} <span className="text-xs font-normal text-gray-500">dB</span></div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">OIP3</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {isFinite(cascadeResult.cascadedOIP3) ? cascadeResult.cascadedOIP3.toFixed(2) : '---'} <span className="text-xs font-normal text-gray-500">dBm</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">IIP3</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {isFinite(cascadeResult.cascadedIIP3) ? cascadeResult.cascadedIIP3.toFixed(2) : '---'} <span className="text-xs font-normal text-gray-500">dBm</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center shadow-sm">
              Connect blocks to view analysis
            </div>
          )}
        </div>
      </div>

      {/* Main Flow Area */}
      <div className="flex-grow h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#9ca3af" className="opacity-40" />
          <Controls className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-md" />
          <Panel position="top-right" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 font-medium shadow-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9c0-2.2 1.8-4 4-4h6c2.2 0 4 1.8 4 4v6c0 2.2-1.8 4-4 4H9c-2.2 0-4-1.8-4-4V9z"></path><path d="M9 14h6"></path><path d="M9 10h6"></path></svg>
            Drag & Connect from left to right
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
