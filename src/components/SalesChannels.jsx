import React from 'react';
import { CheckCircle2, Trash2, Plus } from 'lucide-react';
import EditableText from './EditableText';

const SalesChannels = ({ waysToWin, isEditing, setWaysToWin }) => {
  const addItem = (category) => {
    const newList = [...waysToWin[category], "New Strategy Item"];
    setWaysToWin({ ...waysToWin, [category]: newList });
  };

  const removeItem = (category, index) => {
    const newList = waysToWin[category].filter((_, i) => i !== index);
    setWaysToWin({ ...waysToWin, [category]: newList });
  };

  const updateItem = (category, index, newValue) => {
    const newList = [...waysToWin[category]];
    newList[index] = newValue;
    setWaysToWin({ ...waysToWin, [category]: newList });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
      {/* Competitive Column */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
          <div className="w-2 h-8 bg-blue-500 rounded-full" />
          Competitive Channels
        </h3>
        <div className="space-y-3">
          {waysToWin.competitive.map((item, idx) => (
            <div key={idx} className="group flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <EditableText
                  value={item}
                  onChange={(val) => updateItem('competitive', idx, val)}
                  isEditing={isEditing}
                  className="text-slate-300"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => removeItem('competitive', idx)}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => addItem('competitive')}
              className="w-full py-2 border-2 border-dashed border-slate-700 rounded text-slate-500 hover:border-blue-500/50 hover:text-blue-400 flex items-center justify-center gap-2 transition-all mt-4"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          )}
        </div>
      </div>

      {/* Non-Competitive Column */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-4">
          <div className="w-2 h-8 bg-emerald-500 rounded-full" />
          Non-Competitive Channels
        </h3>
        <div className="space-y-3">
          {waysToWin.nonCompetitive.map((item, idx) => (
            <div key={idx} className="group flex items-start gap-3 p-2 rounded hover:bg-white/5 transition-colors">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <EditableText
                  value={item}
                  onChange={(val) => updateItem('nonCompetitive', idx, val)}
                  isEditing={isEditing}
                  className="text-slate-300"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => removeItem('nonCompetitive', idx)}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {isEditing && (
            <button
              onClick={() => addItem('nonCompetitive')}
              className="w-full py-2 border-2 border-dashed border-slate-700 rounded text-slate-500 hover:border-emerald-500/50 hover:text-emerald-400 flex items-center justify-center gap-2 transition-all mt-4"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesChannels;
