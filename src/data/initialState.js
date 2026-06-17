const initialState = {
  utilisationTarget: 75,
  titles: {
    sales: "Sales Channels & Intake",
    tiers: "Client Tier Architecture",
    sankey: "The 'Land & Expand' Journey"
  },
  waysToWin: {
    competitive: ["Projects through Frameworks", "Projects competitively tendered"],
    nonCompetitive: ["Direct sourcing extensions: same work", "Follow up projects", "Variations", "New work through personal relationships"]
  },
  tiers: [
    { 
      id: "upper", 
      name: "Upper Finish Tier", 
      weight: 10, 
      attributes: "High margin, strategic advisory, multi-year commitment", 
      management: "Director level, monthly performance reviews", 
      bgColor: "bg-slate-200", 
      textColor: "text-slate-900", 
      borderColor: "border-slate-300" 
    },
    { 
      id: "mid", 
      name: "Mid Structure Tier", 
      weight: 15, 
      attributes: "Core delivery, standard frameworks, repeatable services", 
      management: "Project lead, quarterly account planning", 
      bgColor: "bg-slate-500", 
      textColor: "text-white", 
      borderColor: "border-slate-600" 
    },
    { 
      id: "base", 
      name: "Base / Foundation Tier", 
      weight: 50, 
      attributes: "Transactional, high volume, low complexity tasks", 
      management: "Automated reporting, reactive support", 
      bgColor: "bg-slate-800", 
      textColor: "text-white", 
      borderColor: "border-slate-900" 
    }
  ],
  flowVolumes: {
    v1_pers_upper: 15,
    v2_frame_mid: 25,
    v3_upper_mid: 5,
    v4_upper_base: 10,
    v5_mid_mid: 10,
    v6_mid_base: 15
  },
  sankeyNodes: {
    y1_1: "Director Led / Personal",
    y1_2: "Formal Frameworks",
    y2_1: "Upper Finish Tier",
    y2_2: "Mid Structure Tier",
    y3_1: "Mid Structure (Retained)",
    y3_2: "Base / Foundation Tier"
  }
};

export default initialState;
