import React, { useState } from 'react';
import initialState from './data/initialState';
import SalesChannels from './components/SalesChannels';
import ClientTiers from './components/ClientTiers';
import SankeyDiagram from './components/SankeyDiagram';
import EditableText from './components/EditableText';
import { 
  Pencil, 
  Save, 
  Target, 
  TrendingUp, 
  Network 
} from 'lucide-react';

function App() {
  const [data, setData] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateTitles = (field, value) => {
    setData(prev => ({
      ...prev,
      titles: { ...prev.titles, [field]: value }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-blue-400 mb-1">
            <Network className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest">Corporate Strategy Framework</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
            Work Winning Thesis
          </h1>
        </div>

        <div className="flex items-center gap-6 bg-slate-900/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-4 border-r border-white/10 pr-6">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Utilisation Target</p>
              <div className="flex items-center gap-1 text-xl font-mono font-bold text-white">
                <EditableText
                  value={data.utilisationTarget}
                  onChange={(val) => updateData('utilisationTarget', val)}
                  isEditing={isEditing}
                  type="number"
                  className="w-12"
                />
                <span>%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              isEditing 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400" 
                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
            }`}
          >
            {isEditing ? (
              <><Save className="w-4 h-4" /> Save Model</>
            ) : (
              <><Pencil className="w-4 h-4" /> Edit Model</>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {/* Top Section: Sales & Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                <EditableText
                  value={data.titles.sales}
                  onChange={(val) => updateTitles('sales', val)}
                  isEditing={isEditing}
                />
              </h2>
            </div>
            <div className="flex-grow">
              <SalesChannels 
                waysToWin={data.waysToWin} 
                isEditing={isEditing}
                setWaysToWin={(val) => updateData('waysToWin', val)}
              />
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                <EditableText
                  value={data.titles.tiers}
                  onChange={(val) => updateTitles('tiers', val)}
                  isEditing={isEditing}
                />
              </h2>
            </div>
            <div className="flex-grow">
              <ClientTiers 
                tiers={data.tiers} 
                isEditing={isEditing}
                setTiers={(val) => updateData('tiers', val)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Sankey */}
        <div className="w-full">
          <SankeyDiagram 
            flowVolumes={data.flowVolumes} 
            isEditing={isEditing}
            setFlowVolumes={(val) => updateData('flowVolumes', val)}
          />
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-slate-500 text-[10px] uppercase tracking-widest font-bold">
        <span>&copy; 2026 Professional Services Firm</span>
        <div className="flex gap-6">
          <span className="text-blue-500/50">Confidential Strategy Document</span>
          <span>v2.4.0</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
