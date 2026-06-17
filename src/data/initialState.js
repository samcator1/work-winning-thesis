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
  sankeyData: {
    columns: [
      { id: 'col1', title: 'Year 1: Intake' },
      { id: 'col2', title: 'Year 2: Delivery' },
      { id: 'col3', title: 'Year 3: Maturity' }
    ],
    nodes: [
      { id: 'n1', colId: 'col1', label: 'Director Led / Personal' },
      { id: 'n2', colId: 'col1', label: 'Formal Frameworks' },
      { id: 'n3', colId: 'col2', label: 'Upper Finish Tier' },
      { id: 'n4', colId: 'col2', label: 'Mid Structure Tier' },
      { id: 'n5', colId: 'col3', label: 'Mid Structure (Retained)' },
      { id: 'n6', colId: 'col3', label: 'Base / Foundation Tier' }
    ],
    flows: [
      { sourceId: 'n1', targetId: 'n3', value: 15 },
      { sourceId: 'n2', targetId: 'n4', value: 25 },
      { sourceId: 'n3', targetId: 'n5', value: 5 },
      { sourceId: 'n3', targetId: 'n6', value: 10 },
      { sourceId: 'n4', targetId: 'n5', value: 10 },
      { sourceId: 'n4', targetId: 'n6', value: 15 }
    ]
  }
};

export default initialState;
