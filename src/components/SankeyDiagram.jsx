import React, { useMemo } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const SankeyDiagram = ({ data, isEditing, onChange }) => {
  const availableHeight = 450;
  const nodeWidth = 180;
  const gapX = 180;
  const minNodeHeight = 40;

  // 1. Calculate Layout
  const layout = useMemo(() => {
    const { nodes, flows, columns } = data;
    
    // Group nodes by column
    const nodesByCol = columns.map(col => ({
      ...col,
      nodes: nodes.filter(n => n.colId === col.id)
    }));

    // Calculate node volumes (sum of incoming or outgoing, whichever is greater)
    const nodeStats = nodes.reduce((acc, node) => {
      const inFlow = flows.filter(f => f.targetId === node.id).reduce((sum, f) => sum + f.value, 0);
      const outFlow = flows.filter(f => f.sourceId === node.id).reduce((sum, f) => sum + f.value, 0);
      acc[node.id] = { in: inFlow, out: outFlow, max: Math.max(inFlow, outFlow, 0) };
      return acc;
    }, {});

    // Find max column height for scaling
    const colTotals = nodesByCol.map(col => 
      col.nodes.reduce((sum, node) => sum + nodeStats[node.id].max, 0)
    );
    const maxColTotal = Math.max(...colTotals, 1);
    const scale = availableHeight / maxColTotal;

    // Position Nodes
    const positionedNodes = {};
    const nodeGapY = 40;

    nodesByCol.forEach((col, colIdx) => {
      const x = colIdx * (nodeWidth + gapX);
      const totalColH = col.nodes.reduce((sum, node) => sum + Math.max(nodeStats[node.id].max * scale, minNodeHeight), 0) + (col.nodes.length - 1) * nodeGapY;
      let currentY = (availableHeight - totalColH) / 2;

      col.nodes.forEach(node => {
        const h = Math.max(nodeStats[node.id].max * scale, minNodeHeight);
        positionedNodes[node.id] = {
          ...node,
          x,
          y: currentY,
          h,
          v: nodeStats[node.id].max,
          currentInY: currentY,
          currentOutY: currentY
        };
        currentY += h + nodeGapY;
      });
    });

    // Generate Paths
    const paths = flows.filter(f => f.value > 0).map(flow => {
      const source = positionedNodes[flow.sourceId];
      const target = positionedNodes[flow.targetId];
      if (!source || !target) return null;

      const thickness = flow.value * scale;
      const x0 = source.x + nodeWidth;
      const x1 = target.x;
      const y0 = source.currentOutY + thickness / 2;
      const y1 = target.currentInY + thickness / 2;

      // Update offsets for next flow
      source.currentOutY += thickness;
      target.currentInY += thickness;

      const handle = (x1 - x0) * 0.45;
      return {
        d: `M ${x0} ${source.currentOutY - thickness} C ${x0 + handle} ${source.currentOutY - thickness}, ${x1 - handle} ${target.currentInY - thickness}, ${x1} ${target.currentInY - thickness} L ${x1} ${target.currentInY} C ${x1 - handle} ${target.currentInY}, ${x0 + handle} ${source.currentOutY}, ${x0} ${source.currentOutY} Z`,
        value: flow.value,
        sourceLabel: source.label,
        targetLabel: target.label
      };
    }).filter(Boolean);

    return { nodes: Object.values(positionedNodes), paths, columns: nodesByCol };
  }, [data]);

  // 2. State Handlers
  const addNode = (colId) => {
    const newNode = {
      id: `n${Date.now()}`,
      colId,
      label: 'New Strategic Node'
    };
    onChange({ ...data, nodes: [...data.nodes, newNode] });
  };

  const removeNode = (nodeId) => {
    onChange({
      ...data,
      nodes: data.nodes.filter(n => n.id !== nodeId),
      flows: data.flows.filter(f => f.sourceId !== nodeId && f.targetId !== nodeId)
    });
  };

  const updateNodeLabel = (nodeId, label) => {
    onChange({
      ...data,
      nodes: data.nodes.map(n => n.id === nodeId ? { ...n, label } : n)
    });
  };

  const updateFlow = (sourceId, targetId, value) => {
    const val = parseInt(value) || 0;
    const exists = data.flows.find(f => f.sourceId === sourceId && f.targetId === targetId);
    
    let newFlows;
    if (exists) {
      newFlows = data.flows.map(f => (f.sourceId === sourceId && f.targetId === targetId) ? { ...f, value: val } : f);
    } else {
      newFlows = [...data.flows, { sourceId, targetId, value: val }];
    }
    onChange({ ...data, flows: newFlows });
  };

  return (
    <div className="space-y-12 bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
      {/* 3. Header & Diagram */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">The Growth Flow</h2>
            <p className="text-slate-400 text-sm">Visualising the transition of client value across phases.</p>
          </div>
        </div>

        <div className="relative overflow-x-auto pb-4">
          <div style={{ minWidth: (nodeWidth * 3) + (gapX * 2) + 40 }}>
            {/* Perfectly aligned column headers */}
            <div className="flex mb-8">
              {data.columns.map((col, idx) => (
                <div 
                  key={col.id} 
                  style={{ width: nodeWidth, marginLeft: idx === 0 ? 0 : gapX }}
                  className="text-center"
                >
                  <span className="text-[10px] uppercase font-black tracking-[0.3em] text-emerald-400/70 block mb-1">Phase {idx + 1}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{col.title}</span>
                </div>
              ))}
            </div>

            <svg width={(nodeWidth * 3) + (gapX * 2) + 40} height={availableHeight} className="overflow-visible">
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                  <stop offset="100%" stopColor="rgba(16, 185, 129, 0.2)" />
                </linearGradient>
              </defs>

              {layout.paths.map((path, idx) => (
                <path 
                  key={idx} 
                  d={path.d} 
                  className="fill-blue-500/20 stroke-white/5 hover:fill-blue-500/40 transition-all cursor-help"
                >
                  <title>{`${path.sourceLabel} → ${path.targetLabel}: ${path.value} Units`}</title>
                </path>
              ))}

              {layout.nodes.map((node) => (
                <g key={node.id} className="transition-all duration-500">
                  <rect
                    x={node.x} y={node.y} width={nodeWidth} height={node.h}
                    rx={12} className="fill-slate-800/90 stroke-white/10 shadow-2xl"
                  />
                  <foreignObject x={node.x + 10} y={node.y} width={nodeWidth - 20} height={node.h}>
                    <div className="h-full flex flex-col justify-center items-center text-center p-3">
                      <span className="text-white text-[11px] font-bold leading-tight mb-1">{node.label}</span>
                      <div className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-slate-500 font-mono">
                        {node.v} Units
                      </div>
                    </div>
                  </foreignObject>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* 4. Deep Editor Section */}
      {isEditing && (
        <div className="pt-12 border-t border-white/10 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Node Manager */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px flex-grow bg-white/10"></div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Node Configuration</h3>
              <div className="h-px flex-grow bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.columns.map(col => (
                <div key={col.id} className="space-y-4 bg-slate-900/40 p-5 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{col.title}</span>
                    <button 
                      onClick={() => addNode(col.id)}
                      className="p-1.5 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                      title="Add Node"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {data.nodes.filter(n => n.colId === col.id).map(node => (
                      <div key={node.id} className="flex gap-2">
                        <input
                          type="text"
                          value={node.label}
                          onChange={(e) => updateNodeLabel(node.id, e.target.value)}
                          className="flex-grow bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all"
                        />
                        <button 
                          onClick={() => removeNode(node.id)}
                          className="p-2 hover:bg-red-500/20 text-red-400/50 hover:text-red-400 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flow Matrix Editor */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="h-px flex-grow bg-white/10"></div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Transition Matrix (Flows)</h3>
              <div className="h-px flex-grow bg-white/10"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Matrix 1: Col 1 -> Col 2 */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase text-blue-400 tracking-[0.2em]">Intake → Delivery</span>
                <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/30">
                  <table className="w-full text-[10px]">
                    <thead className="bg-white/5 text-slate-500 uppercase font-bold">
                      <tr>
                        <th className="p-3 text-left">From \ To</th>
                        {data.nodes.filter(n => n.colId === 'col2').map(n => (
                          <th key={n.id} className="p-3 text-center w-20 truncate" title={n.label}>{n.label.split(' ')[0]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.nodes.filter(n => n.colId === 'col1').map(sNode => (
                        <tr key={sNode.id}>
                          <td className="p-3 font-bold text-slate-400">{sNode.label}</td>
                          {data.nodes.filter(n => n.colId === 'col2').map(tNode => {
                            const flow = data.flows.find(f => f.sourceId === sNode.id && f.targetId === tNode.id);
                            return (
                              <td key={tNode.id} className="p-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={flow?.value || 0}
                                  onChange={(e) => updateFlow(sNode.id, tNode.id, e.target.value)}
                                  className="w-full bg-slate-800 border border-white/10 rounded-md px-2 py-1.5 text-center text-white focus:border-blue-500/50 outline-none"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Matrix 2: Col 2 -> Col 3 */}
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-[0.2em]">Delivery → Maturity</span>
                <div className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/30">
                  <table className="w-full text-[10px]">
                    <thead className="bg-white/5 text-slate-500 uppercase font-bold">
                      <tr>
                        <th className="p-3 text-left">From \ To</th>
                        {data.nodes.filter(n => n.colId === 'col3').map(n => (
                          <th key={n.id} className="p-3 text-center w-20 truncate" title={n.label}>{n.label.split(' ')[0]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.nodes.filter(n => n.colId === 'col2').map(sNode => (
                        <tr key={sNode.id}>
                          <td className="p-3 font-bold text-slate-400">{sNode.label}</td>
                          {data.nodes.filter(n => n.colId === 'col3').map(tNode => {
                            const flow = data.flows.find(f => f.sourceId === sNode.id && f.targetId === tNode.id);
                            return (
                              <td key={tNode.id} className="p-2">
                                <input
                                  type="number"
                                  min="0"
                                  value={flow?.value || 0}
                                  onChange={(e) => updateFlow(sNode.id, tNode.id, e.target.value)}
                                  className="w-full bg-slate-800 border border-white/10 rounded-md px-2 py-1.5 text-center text-white focus:border-emerald-500/50 outline-none"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SankeyDiagram;
