// BaseNode.js - Sophisticated Node Abstraction Component

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({ 
  id, 
  data, 
  nodeConfig,
  onDataChange
}) => {
  const [nodeData, setNodeData] = useState(data || {});
  const [dynamicHandles, setDynamicHandles] = useState([]);

  // Extract variables from text for dynamic handles (used by TextNode)
  useEffect(() => {
    if (nodeConfig.type === 'text' && nodeData.text) {
      const variables = extractVariables(nodeData.text);
      setDynamicHandles(variables);
    }
  }, [nodeData.text, nodeConfig.type]);

  const extractVariables = (text) => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const variables = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    return variables;
  };

  const handleFieldChange = (field, value) => {
    const newData = { ...nodeData, [field]: value };
    setNodeData(newData);
    if (onDataChange) {
      onDataChange(id, field, value);
    }
  };

  const getNodeHeight = () => {
    if (nodeConfig.type === 'text' && nodeData.text) {
      const baseHeight = 120;
      const textLength = nodeData.text.length;
      const extraHeight = Math.max(0, (textLength - 20) * 1.5);
      const handleHeight = dynamicHandles.length * 28;
      return Math.max(baseHeight + extraHeight + handleHeight, 120);
    }
    return nodeConfig.height || 140;
  };

  const getNodeWidth = () => {
    if (nodeConfig.type === 'text' && nodeData.text) {
      const baseWidth = 240;
      const textLength = nodeData.text.length;
      const extraWidth = Math.max(0, (textLength - 10) * 3);
      return Math.min(baseWidth + extraWidth, 480);
    }
    return nodeConfig.width || 240;
  };

  const getNodeGradient = (type) => {
    const gradients = {
      'input': 'linear-gradient(135deg, rgba(139, 126, 234, 0.9) 0%, rgba(88, 86, 214, 0.9) 100%)',
      'output': 'linear-gradient(135deg, rgba(147, 134, 234, 0.9) 0%, rgba(99, 102, 241, 0.9) 100%)',
      'text': 'linear-gradient(135deg, rgba(167, 139, 250, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
      'llm': 'linear-gradient(135deg, rgba(196, 181, 253, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
      'api': 'linear-gradient(135deg, rgba(183, 148, 244, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)',
      'filter': 'linear-gradient(135deg, rgba(186, 164, 245, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
      'transform': 'linear-gradient(135deg, rgba(196, 181, 253, 0.9) 0%, rgba(109, 40, 217, 0.9) 100%)',
      'database': 'linear-gradient(135deg, rgba(183, 148, 244, 0.9) 0%, rgba(88, 28, 135, 0.9) 100%)',
      'conditional': 'linear-gradient(135deg, rgba(167, 139, 250, 0.9) 0%, rgba(107, 33, 168, 0.9) 100%)'
    };
    return gradients[type] || gradients.input;
  };

  return (
    <div 
      className="sophisticated-node"
      style={{
        width: getNodeWidth(),
        minHeight: getNodeHeight(),
        background: getNodeGradient(nodeConfig.type),
        border: '1px solid rgba(196, 181, 253, 0.2)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.4),
          0 2px 8px rgba(139, 126, 234, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
        backdropFilter: 'blur(12px)',
        color: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Subtle inner glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        borderRadius: '8px 8px 0 0'
      }} />

      {/* Node Title */}
      <div style={{
        fontSize: '13px',
        fontWeight: '600',
        marginBottom: '12px',
        color: '#f1f5f9',
        textAlign: 'left',
        letterSpacing: '0.025em',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)'
      }}>
        {nodeConfig.title}
      </div>

      {/* Node Description */}
      {nodeConfig.description && (
        <div style={{
          fontSize: '11px',
          color: 'rgba(241, 245, 249, 0.7)',
          marginBottom: '16px',
          lineHeight: '1.4',
          fontWeight: '400'
        }}>
          {nodeConfig.description}
        </div>
      )}

      {/* Dynamic Fields */}
      <div style={{ marginBottom: '12px' }}>
        {nodeConfig.fields?.map((field, index) => (
          <div key={index} style={{ marginBottom: '12px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              marginBottom: '6px',
              fontWeight: '500',
              color: 'rgba(241, 245, 249, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {field.label}
            </label>
            {field.type === 'text' || field.type === 'textarea' ? (
              field.type === 'textarea' ? (
                <textarea
                  value={nodeData[field.name] || field.default || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid rgba(196, 181, 253, 0.15)',
                    borderRadius: '4px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    color: '#f1f5f9',
                    fontSize: '11px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    minHeight: '60px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder={field.placeholder}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(196, 181, 253, 0.4)';
                    e.target.style.background = 'rgba(15, 23, 42, 0.6)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(196, 181, 253, 0.15)';
                    e.target.style.background = 'rgba(15, 23, 42, 0.4)';
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={nodeData[field.name] || field.default || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    border: '1px solid rgba(196, 181, 253, 0.15)',
                    borderRadius: '4px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    color: '#f1f5f9',
                    fontSize: '11px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder={field.placeholder}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(196, 181, 253, 0.4)';
                    e.target.style.background = 'rgba(15, 23, 42, 0.6)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(196, 181, 253, 0.15)';
                    e.target.style.background = 'rgba(15, 23, 42, 0.4)';
                  }}
                />
              )
            ) : field.type === 'select' ? (
              <select
                value={nodeData[field.name] || field.default || ''}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  border: '1px solid rgba(196, 181, 253, 0.15)',
                  borderRadius: '4px',
                  background: 'rgba(15, 23, 42, 0.4)',
                  color: '#f1f5f9',
                  fontSize: '11px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {field.options?.map((option, optIndex) => (
                  <option key={optIndex} value={option.value} style={{ background: '#1e293b', color: '#f1f5f9' }}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
      </div>

      {/* Input Handles (Left side) */}
      {nodeConfig.inputs?.map((input, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          style={{
            top: `${((index + 1) * 100) / (nodeConfig.inputs.length + 1)}%`,
            background: 'rgba(196, 181, 253, 0.9)',
            border: '2px solid rgba(139, 126, 234, 0.6)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(196, 181, 253, 0.4)'
          }}
        />
      ))}

      {/* Dynamic Input Handles for Text Node Variables */}
      {nodeConfig.type === 'text' && dynamicHandles.map((variable, index) => (
        <Handle
          key={`dynamic-${variable}`}
          type="target"
          position={Position.Left}
          id={`${id}-${variable}`}
          style={{
            top: `${40 + (index * 28)}px`,
            background: 'rgba(167, 139, 250, 0.9)',
            border: '2px solid rgba(124, 58, 237, 0.6)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            boxShadow: '0 0 6px rgba(167, 139, 250, 0.4)'
          }}
        />
      ))}

      {/* Output Handles (Right side) */}
      {nodeConfig.outputs?.map((output, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          style={{
            top: `${((index + 1) * 100) / (nodeConfig.outputs.length + 1)}%`,
            background: 'rgba(196, 181, 253, 0.9)',
            border: '2px solid rgba(139, 126, 234, 0.6)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            boxShadow: '0 0 8px rgba(196, 181, 253, 0.4)'
          }}
        />
      ))}

      {/* Variable Labels for Text Node */}
      {nodeConfig.type === 'text' && dynamicHandles.map((variable, index) => (
        <div
          key={`label-${variable}`}
          style={{
            position: 'absolute',
            left: '20px',
            top: `${37 + (index * 28)}px`,
            fontSize: '9px',
            color: 'rgba(167, 139, 250, 0.9)',
            fontWeight: '500',
            letterSpacing: '0.025em'
          }}
        >
          {variable}
        </div>
      ))}
    </div>
  );
};