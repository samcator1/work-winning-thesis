import React from 'react';
import EditableText from './EditableText';
import { Layers, Settings, Briefcase } from 'lucide-react';

const ClientTiers = ({ tiers, isEditing, setTiers }) => {
  const updateTier = (index, field, value) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {tiers.map((tier, idx) => (
        <div 
          key={tier.id}
          style={{ 
            flexGrow: tier.weight,
            minHeight: 'min-content'
          }}
          className={`${tier.bgColor} ${tier.textColor} ${tier.borderColor} border rounded-xl p-4 transition-all duration-300 shadow-lg flex flex-col justify-between`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 opacity-60" />
              <EditableText
                value={tier.name}
                onChange={(val) => updateTier(idx, 'name', val)}
                isEditing={isEditing}
                className="font-bold text-lg"
              />
            </div>
            <div className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded text-sm font-mono">
              <EditableText
                value={tier.weight}
                onChange={(val) => updateTier(idx, 'weight', val)}
                isEditing={isEditing}
                type="number"
                className="w-8 text-center"
              />
              <span>%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60 font-bold">
                <Briefcase className="w-3 h-3" /> Attributes
              </div>
              <EditableText
                value={tier.attributes}
                onChange={(val) => updateTier(idx, 'attributes', val)}
                isEditing={isEditing}
                multiline={true}
                className="text-sm leading-tight"
              />
            </div>
            <div className="space-y-1 border-t border-black/10 pt-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-60 font-bold">
                <Settings className="w-3 h-3" /> Management
              </div>
              <EditableText
                value={tier.management}
                onChange={(val) => updateTier(idx, 'management', val)}
                isEditing={isEditing}
                multiline={true}
                className="text-sm leading-tight"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClientTiers;
