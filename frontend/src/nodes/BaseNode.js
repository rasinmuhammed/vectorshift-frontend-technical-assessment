// Enhanced BaseNode Component with Premium Styling
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useTheme } from '../App';
import '../App.css';

export const BaseNode = ({ id, data, nodeConfig, onDataChange }) => {
  const { isDark } = useTheme();
  const [nodeData, setNodeData] = useState(data || {});
  const [isHovered, setIsHovered] = useState(false);

  const handleFieldChange = (field, value) => {
    const newData = { ...nodeData, [field]: value };
    setNodeData(newData);
    if (onDataChange) {
      onDataChange(id, field, value);
    }
  };

  return (
    <div 
      className="sophisticated-node"
      style={{
        width: nodeConfig.width || 220,
        minHeight: nodeConfig.height || 120,
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Node Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '700',
          color: isDark ? '#f4f3ff' : '#0f172a',
          letterSpacing: '0.025em',
        }}>
          {nodeConfig.title}
        </div>
        
        {/* Node Type Indicator */}
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isDark ? '#6913e0' : '#3b82f6',
          boxShadow: `0 0 8px ${isDark ? '#6913e0' : '#3b82f6'}`,
          opacity: isHovered ? 1 : 0.6,
          transition: 'all 0.2s ease',
        }} />
      </div>

      {/* Node Description */}
      {nodeConfig.description && (
        <div style={{
          fontSize: '11px',
          color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
          marginBottom: '16px',
          lineHeight: '1.5',
          fontWeight: '400',
        }}>
          {nodeConfig.description}
        </div>
      )}

      {/* Dynamic Fields */}
      <div style={{ marginBottom: '8px' }}>
        {nodeConfig.fields?.map((field, index) => (
          <div key={index} style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              marginBottom: '6px',
              fontWeight: '600',
              color: isDark ? 'rgba(244, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {field.label}
            </label>
            
            {field.type === 'text' || field.type === 'textarea' ? (
              <textarea
                value={nodeData[field.name] || field.default || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                rows={field.type === 'textarea' ? 3 : 1}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '6px',
                  background: isDark 
                    ? 'rgba(31, 27, 46, 0.8)' 
                    : 'rgba(248, 250, 252, 0.8)',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  resize: field.type === 'textarea' ? 'vertical' : 'none',
                  minHeight: field.type === 'textarea' ? '60px' : 'auto',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = isDark ? '#6913e0' : '#3b82f6';
                  e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ) : field.type === 'select' ? (
              <select
                value={nodeData[field.name] || field.default || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '6px',
                  background: isDark 
                    ? 'rgba(31, 27, 46, 0.8)' 
                    : 'rgba(248, 250, 252, 0.8)',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = isDark ? '#6913e0' : '#3b82f6';
                  e.target.style.boxShadow = `0 0 0 3px ${isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {field.options?.map((option, optIndex) => (
                  <option 
                    key={optIndex} 
                    value={option.value}
                    style={{ 
                      background: isDark ? '#1f1b2e' : '#ffffff',
                      color: isDark ? '#f4f3ff' : '#0f172a'
                    }}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
      </div>

      {/* Input Handles (Left Side) */}
      {nodeConfig.inputs?.map((input, index) => (
        <React.Fragment key={`input-${index}`}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${input.id}`}
            style={{ 
              top: `${60 + index * 32}px`,
              background: isDark ? '#1f1b2e' : '#ffffff',
              border: `2px solid ${isDark ? '#6913e0' : '#3b82f6'}`,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              boxShadow: `0 0 8px ${isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
              transition: 'all 0.2s ease',
            }}
          />
          {/* Handle Label */}
          <div style={{
            position: 'absolute',
            left: '-8px',
            top: `${52 + index * 32}px`,
            transform: 'translateX(-100%)',
            fontSize: '10px',
            fontWeight: '500',
            color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
            backgroundColor: isDark ? 'rgba(31, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            padding: '2px 6px',
            borderRadius: '4px',
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            {input.label}
          </div>
        </React.Fragment>
      ))}

      {/* Output Handles (Right Side) */}
      {nodeConfig.outputs?.map((output, index) => (
        <React.Fragment key={`output-${index}`}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            style={{ 
              top: `${60 + index * 32}px`,
              background: isDark ? '#1f1b2e' : '#ffffff',
              border: `2px solid ${isDark ? '#6913e0' : '#3b82f6'}`,
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              boxShadow: `0 0 8px ${isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
              transition: 'all 0.2s ease',
            }}
          />
          {/* Handle Label */}
          <div style={{
            position: 'absolute',
            right: '-8px',
            top: `${52 + index * 32}px`,
            transform: 'translateX(100%)',
            fontSize: '10px',
            fontWeight: '500',
            color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
            backgroundColor: isDark ? 'rgba(31, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            padding: '2px 6px',
            borderRadius: '4px',
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            {output.label}
          </div>
        </React.Fragment>
      ))}

      {/* Premium Node Glow Effect */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '14px',
          background: `linear-gradient(135deg, ${
            isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'
          }, transparent)`,
          pointerEvents: 'none',
          zIndex: -1,
        }} />
      )}
    </div>
  );
};