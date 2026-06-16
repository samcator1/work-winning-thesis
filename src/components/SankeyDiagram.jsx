import React, { useMemo } from 'react';

const SankeyDiagram = ({ flowVolumes, isEditing, setFlowVolumes }) => {
  const availableHeight = 400;
  const nodeWidth = 180;
  const gapX = 180;
  const minNodeHeight = 50;

  const layout = useMemo(() => {
    // 1. Calculate Columns
    const xY1 = 20;
    const xY2 = xY1 + nodeWidth + gapX;
    const xY3 = xY2 + nodeWidth + gapX;

    // 2. Aggregate Flows per Column
    const col1_total = flowVolumes.v1_pers_upper + flowVolumes.v2_frame_mid;
    const col2_total = (flowVolumes.v1_pers_upper + flowVolumes.v3_upper_mid + flowVolumes.v5_mid_mid) + 
                       (flowVolumes.v2_frame_mid + flowVolumes.v4_upper_base + flowVolumes.v6_mid_base);
    const col3_total = (flowVolumes.v1_pers_upper + flowVolumes.v3_upper_mid + flowVolumes.v5_mid_mid) + 
                       (flowVolumes.v4_upper_base + flowVolumes.v2_frame_mid + flowVolumes.v6_mid_base);
    
    // Actually col2 and col3 totals should be calculated based on incoming/outgoing
    // Col 1 Nodes: Director Led (v1), Formal Frameworks (v2)
    // Col 2 Nodes: Upper Finish (v1 in, v3 out, v4 out), Mid Structure (v2 in, v5 out, v6 out)
    // Col 3 Nodes: Mid Structure Retained (v1+v3+v5), Base Foundation (v4+v2+v6)

    const c1_n1_v = flowVolumes.v1_pers_upper;
    const c1_n2_v = flowVolumes.v2_frame_mid;

    const c2_n1_v = flowVolumes.v1_pers_upper; // Upper Finish (receives v1)
    const c2_n2_v = flowVolumes.v2_frame_mid; // Mid Structure (receives v2)

    const c3_n1_v = flowVolumes.v1_pers_upper + flowVolumes.v3_upper_mid + flowVolumes.v5_mid_mid; // Mid Structure Retained
    const c3_n2_v = flowVolumes.v4_upper_base + flowVolumes.v6_mid_base + flowVolumes.v2_frame_mid; // Foundation (Wait, adjust based on user logic)
    
    // Let's refine the logic based on flow names:
    // v1: Pers/Director -> Upper Finish
    // v2: Frame -> Mid Structure
    // v3: Upper Finish -> Mid Structure (Retained)
    // v4: Upper Finish -> Base/Foundation
    // v5: Mid Structure -> Mid Structure (Retained)
    // v6: Mid Structure -> Base/Foundation

    const maxFlowSum = Math.max(
      c1_n1_v + c1_n2_v,
      c2_n1_v + c2_n2_v,
      c3_n1_v + c3_n2_v
    );

    const scale = availableHeight / (maxFlowSum || 1);

    const getH = (v) => Math.max(v * scale, minNodeHeight);

    // Node Positions
    const n = {
      y1_1: { x: xY1, y: 0, h: getH(c1_n1_v), v: c1_n1_v, label: "Director Led / Personal" },
      y1_2: { x: xY1, y: 0, h: getH(c1_n2_v), v: c1_n2_v, label: "Formal Frameworks" },
      
      y2_1: { x: xY2, y: 0, h: getH(c2_n1_v), v: c2_n1_v, label: "Upper Finish Tier" },
      y2_2: { x: xY2, y: 0, h: getH(c2_n2_v), v: c2_n2_v, label: "Mid Structure Tier" },

      y3_1: { x: xY3, y: 0, h: getH(c3_n1_v), v: c3_n1_v, label: "Mid Structure (Retained)" },
      y3_2: { x: xY3, y: 0, h: getH(c3_n2_v), v: c3_n2_v, label: "Base / Foundation Tier" }
    };

    // Calculate Y offsets for centering nodes
    const col1_h = n.y1_1.h + 40 + n.y1_2.h;
    const col2_h = n.y2_1.h + 40 + n.y2_2.h;
    const col3_h = n.y3_1.h + 40 + n.y3_2.h;

    n.y1_1.y = (availableHeight - col1_h) / 2;
    n.y1_2.y = n.y1_1.y + n.y1_1.h + 40;

    n.y2_1.y = (availableHeight - col2_h) / 2;
    n.y2_2.y = n.y2_1.y + n.y2_1.h + 40;

    n.y3_1.y = (availableHeight - col3_h) / 2;
    n.y3_2.y = n.y3_1.y + n.y3_1.h + 40;

    // Paths
    const generateExpandingPath = (p) => {
      const handle = (p.x1 - p.x0) * 0.45; 
      return `M ${p.x0} ${p.y0_t} C ${p.x0 + handle} ${p.y0_t}, ${p.x1 - handle} ${p.y1_t}, ${p.x1} ${p.y1_t} L ${p.x1} ${p.y1_b} C ${p.x1 - handle} ${p.y1_b}, ${p.x0 + handle} ${p.y0_b}, ${p.x0} ${p.y0_b} Z`;
    };

    const paths = [
      // v1: y1_1 -> y2_1
      {
        d: generateExpandingPath({
          x0: n.y1_1.x + nodeWidth, x1: n.y2_1.x,
          y0_t: n.y1_1.y, y0_b: n.y1_1.y + n.y1_1.v * scale,
          y1_t: n.y2_1.y, y1_b: n.y2_1.y + flowVolumes.v1_pers_upper * scale
        }),
        color: "fill-blue-400/30"
      },
      // v2: y1_2 -> y2_2
      {
        d: generateExpandingPath({
          x0: n.y1_2.x + nodeWidth, x1: n.y2_2.x,
          y0_t: n.y1_2.y, y0_b: n.y1_2.y + n.y1_2.v * scale,
          y1_t: n.y2_2.y, y1_b: n.y2_2.y + flowVolumes.v2_frame_mid * scale
        }),
        color: "fill-emerald-400/30"
      },
      // v3: y2_1 -> y3_1
      {
        d: generateExpandingPath({
          x0: n.y2_1.x + nodeWidth, x1: n.y3_1.x,
          y0_t: n.y2_1.y, y0_b: n.y2_1.y + flowVolumes.v3_upper_mid * scale,
          y1_t: n.y3_1.y, y1_b: n.y3_1.y + flowVolumes.v3_upper_mid * scale
        }),
        color: "fill-blue-500/40"
      },
      // v4: y2_1 -> y3_2
      {
        d: generateExpandingPath({
          x0: n.y2_1.x + nodeWidth, x1: n.y3_2.x,
          y0_t: n.y2_1.y + flowVolumes.v3_upper_mid * scale, y0_b: n.y2_1.y + (flowVolumes.v3_upper_mid + flowVolumes.v4_upper_base) * scale,
          y1_t: n.y3_2.y, y1_b: n.y3_2.y + flowVolumes.v4_upper_base * scale
        }),
        color: "fill-slate-400/30"
      },
      // v5: y2_2 -> y3_1
      {
        d: generateExpandingPath({
          x0: n.y2_2.x + nodeWidth, x1: n.y3_1.x,
          y0_t: n.y2_2.y, y0_b: n.y2_2.y + flowVolumes.v5_mid_mid * scale,
          y1_t: n.y3_1.y + flowVolumes.v3_upper_mid * scale, y1_b: n.y3_1.y + (flowVolumes.v3_upper_mid + flowVolumes.v5_mid_mid) * scale
        }),
        color: "fill-emerald-500/40"
      },
      // v6: y2_2 -> y3_2
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
  }, [flowVolumes, scale]);

  const updateFlow = (key, val) => {
    setFlowVolumes({ ...flowVolumes, [key]: parseInt(val) || 0 });
  };

  return (
    <div className="space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-md">
      <div className="flex justify-between items-end mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">The 'Land & Expand' Journey</h2>
          <p className="text-slate-400 text-sm">Mapping the flow of work winning from Year 1 intake to Year 3 maturity.</p>
        </div>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          <span className="w-[180px] text-center">Year 1: Intake</span>
          <span className="w-[180px] text-center ml-[180px]">Year 2: Delivery</span>
          <span className="w-[180px] text-center ml-[180px]">Year 3: Maturity</span>
        </div>
      </div>

      <svg width="100%" height={availableHeight} viewBox={`0 0 1000 ${availableHeight}`} className="overflow-visible">
        {layout.paths.map((path, idx) => (
          <path key={idx} d={path.d} className={`${path.color} transition-all duration-500 ease-in-out hover:opacity-80`} />
        ))}

        {layout.nodes.map((node, idx) => (
          <g key={idx} className="transition-all duration-500 ease-in-out">
            <rect
              x={node.x} y={node.y} width={nodeWidth} height={node.h}
              rx={8} className="fill-slate-800/80 stroke-white/10"
            />
            <foreignObject x={node.x + 10} y={node.y} width={nodeWidth - 20} height={node.h}>
              <div className="h-full flex flex-col justify-center items-center text-center p-2">
                <span className="text-white text-xs font-bold leading-tight">{node.label}</span>
                <span className="text-slate-400 text-[10px] mt-1 font-mono uppercase tracking-wider">{node.v} Units</span>
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>

      {isEditing && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
          {Object.entries(flowVolumes).map(([key, val]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                <span>{key.replace('v', 'Flow ').replace('_', ': ')}</span>
                <span className="text-blue-400">{val}</span>
              </div>
              <input
                type="range" min="0" max="50" value={val}
                onChange={(e) => updateFlow(key, e.target.value)}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SankeyDiagram;
