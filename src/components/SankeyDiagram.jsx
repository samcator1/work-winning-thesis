import React, { useMemo } from 'react';

const SankeyDiagram = ({ flowVolumes, sankeyNodes, isEditing, setFlowVolumes, setSankeyNodes }) => {
  const availableHeight = 450;
  const nodeWidth = 200;
  const gapX = 180;
  const minNodeHeight = 60;

  // X coordinates for the 3 columns
  const xY1 = 20;
  const xY2 = xY1 + nodeWidth + gapX;
  const xY3 = xY2 + nodeWidth + gapX;

  const layout = useMemo(() => {
    // 2. Aggregate Flows per Column
    const c1_n1_v = flowVolumes.v1_pers_upper;
    const c1_n2_v = flowVolumes.v2_frame_mid;

    const c2_n1_v = flowVolumes.v1_pers_upper; // Upper Finish (receives v1)
    const c2_n2_v = flowVolumes.v2_frame_mid; // Mid Structure (receives v2)

    const c3_n1_v = flowVolumes.v1_pers_upper + flowVolumes.v3_upper_mid + flowVolumes.v5_mid_mid; // Mid Structure Retained
    const c3_n2_v = flowVolumes.v4_upper_base + flowVolumes.v6_mid_base + flowVolumes.v2_frame_mid; // Foundation
    
    const maxFlowSum = Math.max(
      c1_n1_v + c1_n2_v,
      c2_n1_v + c2_n2_v,
      c3_n1_v + c3_n2_v
    );

    const scale = availableHeight / (maxFlowSum || 1);
    const getH = (v) => Math.max(v * scale, minNodeHeight);

    // Node Positions
    const n = {
      y1_1: { x: xY1, y: 0, h: getH(c1_n1_v), v: c1_n1_v, label: sankeyNodes.y1_1 },
      y1_2: { x: xY1, y: 0, h: getH(c1_n2_v), v: c1_n2_v, label: sankeyNodes.y1_2 },
      
      y2_1: { x: xY2, y: 0, h: getH(c2_n1_v), v: c2_n1_v, label: sankeyNodes.y2_1 },
      y2_2: { x: xY2, y: 0, h: getH(c2_n2_v), v: c2_n2_v, label: sankeyNodes.y2_2 },

      y3_1: { x: xY3, y: 0, h: getH(c3_n1_v), v: c3_n1_v, label: sankeyNodes.y3_1 },
      y3_2: { x: xY3, y: 0, h: getH(c3_n2_v), v: c3_n2_v, label: sankeyNodes.y3_2 }
    };

    // Calculate Y offsets for centering nodes
    const nodeGapY = 50;
    const col1_h = n.y1_1.h + nodeGapY + n.y1_2.h;
    const col2_h = n.y2_1.h + nodeGapY + n.y2_2.h;
    const col3_h = n.y3_1.h + nodeGapY + n.y3_2.h;

    n.y1_1.y = (availableHeight - col1_h) / 2;
    n.y1_2.y = n.y1_1.y + n.y1_1.h + nodeGapY;

    n.y2_1.y = (availableHeight - col2_h) / 2;
    n.y2_2.y = n.y2_1.y + n.y2_1.h + nodeGapY;

    n.y3_1.y = (availableHeight - col3_h) / 2;
    n.y3_2.y = n.y3_1.y + n.y3_1.h + nodeGapY;

    // Paths
    const generateExpandingPath = (p) => {
      const handle = (p.x1 - p.x0) * 0.45; 
      return `M ${p.x0} ${p.y0_t} C ${p.x0 + handle} ${p.y0_t}, ${p.x1 - handle} ${p.y1_t}, ${p.x1} ${p.y1_t} L ${p.x1} ${p.y1_b} C ${p.x1 - handle} ${p.y1_b}, ${p.x0 + handle} ${p.y0_b}, ${p.x0} ${p.y0_b} Z`;
    };

    const paths = [
      {
        d: generateExpandingPath({
          x0: n.y1_1.x + nodeWidth, x1: n.y2_1.x,
          y0_t: n.y1_1.y, y0_b: n.y1_1.y + n.y1_1.v * scale,
          y1_t: n.y2_1.y, y1_b: n.y2_1.y + flowVolumes.v1_pers_upper * scale
        }),
        color: "fill-blue-400/30"
      },
      {
        d: generateExpandingPath({
          x0: n.y1_2.x + nodeWidth, x1: n.y2_2.x,
          y0_t: n.y1_2.y, y0_b: n.y1_2.y + n.y1_2.v * scale,
          y1_t: n.y2_2.y, y1_b: n.y2_2.y + flowVolumes.v2_frame_mid * scale
        }),
        color: "fill-emerald-400/30"
      },
      {
        d: generateExpandingPath({
          x0: n.y2_1.x + nodeWidth, x1: n.y3_1.x,
          y0_t: n.y2_1.y, y0_b: n.y2_1.y + flowVolumes.v3_upper_mid * scale,
          y1_t: n.y3_1.y, y1_b: n.y3_1.y + flowVolumes.v3_upper_mid * scale
        }),
        color: "fill-blue-500/40"
      },
      {
        d: generateExpandingPath({
          x0: n.y2_1.x + nodeWidth, x1: n.y3_2.x,
          y0_t: n.y2_1.y + flowVolumes.v3_upper_mid * scale, y0_b: n.y2_1.y + (flowVolumes.v3_upper_mid + flowVolumes.v4_upper_base) * scale,
          y1_t: n.y3_2.y, y1_b: n.y3_2.y + flowVolumes.v4_upper_base * scale
        }),
        color: "fill-slate-400/30"
      },
      {
        d: generateExpandingPath({
          x0: n.y2_2.x + nodeWidth, x1: n.y3_1.x,
          y0_t: n.y2_2.y, y0_b: n.y2_2.y + flowVolumes.v5_mid_mid * scale,
          y1_t: n.y3_1.y + flowVolumes.v3_upper_mid * scale, y1_b: n.y3_1.y + (flowVolumes.v3_upper_mid + flowVolumes.v5_mid_mid) * scale
        }),
        color: "fill-emerald-500/40"
      },
      {
        d: generateExpandingPath({
          x0: n.y2_2.x + nodeWidth, x1: n.y3_2.x,
          y0_t: n.y2_2.y + flowVolumes.v5_mid_mid * scale, y0_b: n.y2_2.y + (flowVolumes.v5_mid_mid + flowVolumes.v6_mid_base) * scale,
          y1_t: n.y3_2.y + flowVolumes.v4_upper_base * scale, y1_b: n.y3_2.y + (flowVolumes.v4_upper_base + flowVolumes.v6_mid_base) * scale
        }),
        color: "fill-slate-600/30"
      }
    ];

    return { nodes: Object.values(n), paths };
  }, [flowVolumes, sankeyNodes]);

  const updateFlow = (key, val) => {
    setFlowVolumes({ ...flowVolumes, [key]: parseInt(val) || 0 });
  };

  const updateNodeLabel = (key, val) => {
    setSankeyNodes({ ...sankeyNodes, [key]: val });
  };

  return (
    <div className="space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
      <div className="flex justify-between items-end mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">The 'Land & Expand' Journey</h2>
          <p className="text-slate-400 text-sm">Mapping the flow of work winning from Year 1 intake to Year 3 maturity.</p>
        </div>
      </div>

      <div className="relative">
        {/* Year Headers aligned with columns */}
        <div className="flex text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-6 px-[20px]">
          <span style={{ width: nodeWidth }} className="text-center">Year 1: Intake</span>
          <span style={{ width: nodeWidth, marginLeft: gapX }} className="text-center">Year 2: Delivery</span>
          <span style={{ width: nodeWidth, marginLeft: gapX }} className="text-center">Year 3: Maturity</span>
        </div>

        <svg width="100%" height={availableHeight} viewBox={`0 0 1000 ${availableHeight}`} className="overflow-visible">
          {layout.paths.map((path, idx) => (
            <path key={idx} d={path.d} className={`${path.color} transition-all duration-500 ease-in-out hover:opacity-80`} />
          ))}

          {layout.nodes.map((node, idx) => (
            <g key={idx} className="transition-all duration-500 ease-in-out">
              <rect
                x={node.x} y={node.y} width={nodeWidth} height={node.h}
                rx={12} className="fill-slate-800/90 stroke-white/10 shadow-xl"
              />
              <foreignObject x={node.x + 10} y={node.y} width={nodeWidth - 20} height={node.h}>
                <div className="h-full flex flex-col justify-center items-center text-center p-3">
                  <span className="text-white text-xs font-bold leading-tight mb-1">{node.label}</span>
                  <div className="bg-white/5 px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono uppercase tracking-wider">
                    {node.v} Units
                  </div>
                </div>
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>

      {isEditing && (
        <div className="pt-12 border-t border-white/10 space-y-12">
          {/* Node Labels Editor */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Node Labels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(sankeyNodes).map(([key, val]) => (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {key.replace('y', 'Year ').replace('_', ': Node ')}
                  </label>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => updateNodeLabel(key, e.target.value)}
                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Flow Volumes Editor Table */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Flow Volumes</h3>
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Flow Path</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4 text-center">Value</th>
                    <th className="px-6 py-4">Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {Object.entries(flowVolumes).map(([key, val]) => {
                    const descriptions = {
                      v1_pers_upper: "Personal/Director intake to Upper Finish",
                      v2_frame_mid: "Framework intake to Mid Structure",
                      v3_upper_mid: "Upper Finish maturing to Mid Structure",
                      v4_upper_base: "Upper Finish dropping to Base Foundation",
                      v5_mid_mid: "Mid Structure retained as Mid Structure",
                      v6_mid_base: "Mid Structure dropping to Base Foundation"
                    };
                    return (
                      <tr key={key} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-blue-400">{key}</td>
                        <td className="px-6 py-4 text-slate-300">{descriptions[key]}</td>
                        <td className="px-6 py-4 text-center font-bold text-white">{val}</td>
                        <td className="px-6 py-4">
                          <input
                            type="range" min="0" max="100" value={val}
                            onChange={(e) => updateFlow(key, e.target.value)}
                            className="w-32 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SankeyDiagram;
