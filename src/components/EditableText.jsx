import React from 'react';

const EditableText = ({ 
  value, 
  onChange, 
  isEditing, 
  multiline = false, 
  type = "text", 
  className = "" 
}) => {
  if (!isEditing) {
    return <span className={className}>{value}</span>;
  }

  const commonProps = {
    value,
    onChange: (e) => onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value),
    className: `border-2 border-dashed border-blue-400/50 bg-white/10 rounded px-1 focus:outline-none focus:border-blue-500 w-full ${className}`,
    autoFocus: true
  };

  if (multiline) {
    return <textarea {...commonProps} rows={2} />;
  }

  return <input type={type} {...commonProps} />;
};

export default EditableText;
