// frontend/src/nodes/BaseNode.js

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useTheme } from '../App'; // Import the useTheme hook
import '../App.css';
export const BaseNode = ({ id, data, nodeConfig, onDataChange }) => {
  const { isDark } = useTheme(); // Use the theme context
  const [nodeData, setNodeData] = useState(data || {});

  const handleFieldChange = (field, value) => {
    const newData = { ...nodeData, [field]: value };
    setNodeData(newData);
    if (onDataChange) {
      onDataChange(id, field, value);
    }
  };

  const nodeStyles = {
    light: {
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      color: '#0f172a',
    },
    dark: {
      backgroundColor: '#1e293b',
      border: '1px solid #475569',
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
      color: '#f8fafc',
    }
  };
  
  const currentStyle = isDark ? nodeStyles.dark : nodeStyles.light;

  return (
    <div 
      className="sophisticated-node"
      style={{
        width: nodeConfig.width || 240,
        ...currentStyle,
      }}
    >
        {/* Node Title */}
        <div style={{
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '8px',
            paddingBottom: '8px',
            borderBottom: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
            color: isDark ? '#f1f5f9' : '#1e293b',
            textAlign: 'left',
        }}>
            {nodeConfig.title}
        </div>

        {/* Node Description */}
        {nodeConfig.description && (
            <div style={{
                fontSize: '11px',
                color: isDark ? 'rgba(241, 245, 249, 0.7)' : 'rgba(30, 41, 59, 0.7)',
                marginBottom: '12px',
                lineHeight: '1.4',
                fontWeight: '400'
            }}>
                {nodeConfig.description}
            </div>
        )}

        {/* Dynamic Fields */}
        <div style={{ marginBottom: '4px' }}>
            {nodeConfig.fields?.map((field, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '11px',
                        marginBottom: '4px',
                        fontWeight: '500',
                        color: isDark ? 'rgba(241, 245, 249, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                    }}>
                        {field.label}
                    </label>
                    {field.type === 'text' || field.type === 'textarea' ? (
                        <textarea
                            value={nodeData[field.name] || field.default || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            rows={field.type === 'textarea' ? 3 : 1}
                            style={{
                                width: '100%',
                                padding: '6px 10px',
                                border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                borderRadius: '4px',
                                background: isDark ? '#334155' : '#f8fafc',
                                color: isDark ? '#f1f5f9' : '#1e293b',
                                fontSize: '12px',
                                fontFamily: 'inherit',
                                resize: field.type === 'textarea' ? 'vertical' : 'none',
                                minHeight: field.type === 'textarea' ? '50px' : 'auto',
                            }}
                            placeholder={field.placeholder}
                        />
                    ) : field.type === 'select' ? (
                        <select
                            value={nodeData[field.name] || field.default || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            style={{
                                width: '100%',
                                padding: '6px 10px',
                                border: `1px solid ${isDark ? '#475569' : '#d1d5db'}`,
                                borderRadius: '4px',
                                background: isDark ? '#334155' : '#f8fafc',
                                color: isDark ? '#f1f5f9' : '#1e293b',
                                fontSize: '12px',
                                fontFamily: 'inherit',
                            }}
                        >
                            {field.options?.map((option, optIndex) => (
                                <option key={optIndex} value={option.value} style={{ background: isDark ? '#1e293b' : '#ffffff' }}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : null}
                </div>
            ))}
        </div>

        {/* Input Handles (Left) & Output Handles (Right) */}
        {nodeConfig.inputs?.map((input, index) => (
            <Handle
                key={`input-${index}`}
                type="target"
                position={Position.Left}
                id={`${id}-${input.id}`}
                style={{ top: `${80 + index * 40}px`, background: isDark ? '#475569' : '#e2e8f0', border: `2px solid ${isDark ? '#94a3b8' : '#cbd5e1'}` }}
            />
        ))}

        {nodeConfig.outputs?.map((output, index) => (
            <Handle
                key={`output-${index}`}
                type="source"
                position={Position.Right}
                id={`${id}-${output.id}`}
                style={{ top: `${80 + index * 40}px`, background: isDark ? '#475569' : '#e2e8f0', border: `2px solid ${isDark ? '#94a3b8' : '#cbd5e1'}` }}
            />
        ))}
    </div>
  );
};