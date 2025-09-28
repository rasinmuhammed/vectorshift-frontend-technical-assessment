// Enhanced BaseNode Component with Premium Styling - Optimized Size
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

  // Optimized node dimensions
  const nodeWidth = nodeConfig.width || 180; // Reduced from 220
  const nodeHeight = nodeConfig.height || 100; // Reduced from 120

  return (
    <div 
      className="sophisticated-node"
      style={{
        width: nodeWidth,
        minHeight: nodeHeight,
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Node Header - Optimized */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '8px', // Reduced from 12px
        paddingBottom: '6px', // Reduced from 10px
        borderBottom: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
      }}>
        <div style={{
          fontSize: '12px', // Reduced from 13px
          fontWeight: '700',
          color: isDark ? '#f4f3ff' : '#0f172a',
          letterSpacing: '0.025em',
        }}>
          {nodeConfig.title}
        </div>
        
        {/* Node Type Indicator - Smaller */}
        <div style={{
          width: '6px', // Reduced from 8px
          height: '6px', // Reduced from 8px
          borderRadius: '50%',
          background: isDark ? '#6913e0' : '#3b82f6',
          boxShadow: `0 0 6px ${isDark ? '#6913e0' : '#3b82f6'}`,
          opacity: isHovered ? 1 : 0.6,
          transition: 'all 0.2s ease',
        }} />
      </div>

      {/* Node Description - Optimized */}
      {nodeConfig.description && (
        <div style={{
          fontSize: '10px', // Reduced from 11px
          color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
          marginBottom: '10px', // Reduced from 16px
          lineHeight: '1.4', // Reduced from 1.5
          fontWeight: '400',
        }}>
          {nodeConfig.description}
        </div>
      )}

      {/* Dynamic Fields - Optimized */}
      <div style={{ marginBottom: '6px' }}>
        {nodeConfig.fields?.map((field, index) => (
          <div key={index} style={{ marginBottom: '8px' }}> {/* Reduced from 12px */}
            <label style={{
              display: 'block',
              fontSize: '10px', // Reduced from 11px
              marginBottom: '4px', // Reduced from 6px
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
                rows={field.type === 'textarea' ? 2 : 1} // Reduced textarea rows
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  padding: '6px 8px', // Reduced padding
                  border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '5px', // Reduced from 6px
                  background: isDark 
                    ? 'rgba(31, 27, 46, 0.8)' 
                    : 'rgba(248, 250, 252, 0.8)',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                  fontSize: '11px', // Reduced from 12px
                  fontFamily: 'inherit',
                  resize: field.type === 'textarea' ? 'vertical' : 'none',
                  minHeight: field.type === 'textarea' ? '40px' : 'auto', // Reduced
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = isDark ? '#6913e0' : '#3b82f6';
                  e.target.style.boxShadow = `0 0 0 2px ${isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`;
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
                  padding: '6px 8px', // Reduced padding
                  border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                  borderRadius: '5px', // Reduced from 6px
                  background: isDark 
                    ? 'rgba(31, 27, 46, 0.8)' 
                    : 'rgba(248, 250, 252, 0.8)',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                  fontSize: '11px', // Reduced from 12px
                  fontFamily: 'inherit',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = isDark ? '#6913e0' : '#3b82f6';
                  e.target.style.boxShadow = `0 0 0 2px ${isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`;
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

      {/* Input Handles (Left Side) - Optimized positioning */}
      {nodeConfig.inputs?.map((input, index) => (
        <React.Fragment key={`input-${index}`}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${input.id}`}
            style={{ 
              top: `${45 + index * 24}px`, // Reduced spacing
              background: isDark ? '#1f1b2e' : '#ffffff',
              border: `2px solid ${isDark ? '#6913e0' : '#3b82f6'}`,
              width: '10px', // Reduced from 12px
              height: '10px', // Reduced from 12px
              borderRadius: '50%',
              boxShadow: `0 0 6px ${isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
              transition: 'all 0.2s ease',
            }}
          />
          {/* Handle Label - Smaller */}
          <div style={{
            position: 'absolute',
            left: '-6px',
            top: `${37 + index * 24}px`, // Adjusted for smaller spacing
            transform: 'translateX(-100%)',
            fontSize: '9px', // Reduced from 10px
            fontWeight: '500',
            color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
            backgroundColor: isDark ? 'rgba(31, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            padding: '1px 4px', // Reduced padding
            borderRadius: '3px', // Reduced border radius
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            {input.label}
          </div>
        </React.Fragment>
      ))}

      {/* Output Handles (Right Side) - Optimized positioning */}
      {nodeConfig.outputs?.map((output, index) => (
        <React.Fragment key={`output-${index}`}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            style={{ 
              top: `${45 + index * 24}px`, // Reduced spacing
              background: isDark ? '#1f1b2e' : '#ffffff',
              border: `2px solid ${isDark ? '#6913e0' : '#3b82f6'}`,
              width: '10px', // Reduced from 12px
              height: '10px', // Reduced from 12px
              borderRadius: '50%',
              boxShadow: `0 0 6px ${isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
              transition: 'all 0.2s ease',
            }}
          />
          {/* Handle Label - Smaller */}
          <div style={{
            position: 'absolute',
            right: '-6px',
            top: `${37 + index * 24}px`, // Adjusted for smaller spacing
            transform: 'translateX(100%)',
            fontSize: '9px', // Reduced from 10px
            fontWeight: '500',
            color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
            backgroundColor: isDark ? 'rgba(31, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            padding: '1px 4px', // Reduced padding
            borderRadius: '3px', // Reduced border radius
            opacity: isHovered ? 1 : 0,
            transition: 'all 0.2s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            {output.label}
          </div>
        </React.Fragment>
      ))}

      {/* Premium Node Glow Effect - Subtle */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '-1px',
          right: '-1px',
          bottom: '-1px',
          borderRadius: '11px', // Adjusted for smaller node
          background: `linear-gradient(135deg, ${
            isDark ? 'rgba(105, 19, 224, 0.15)' : 'rgba(59, 130, 246, 0.15)'
          }, transparent)`,
          pointerEvents: 'none',
          zIndex: -1,
        }} />
      )}
    </div>
  );
};