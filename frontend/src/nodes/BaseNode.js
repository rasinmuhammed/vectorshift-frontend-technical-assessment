import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useTheme } from '../App';
import { useStore } from '../store';
import { 
  FiSettings, 
  FiTrash2, 
  FiChevronDown, 
  FiChevronUp,
  FiX,
  FiCheck,
  FiRotateCcw
} from 'react-icons/fi';
import '../App.css';

export const BaseNode = ({ id, data, nodeConfig, onDataChange }) => {
  const { isDark, isMobile } = useTheme();
  const deleteNode = useStore((state) => state.deleteNode);
  
  const [nodeData, setNodeData] = useState(data || {});
  const [isHovered, setIsHovered] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(data?.isCollapsed || false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [tempNodeData, setTempNodeData] = useState({});
  
  const settingsRef = useRef(null);

  const handleFieldChange = (field, value) => {
    const newData = { ...nodeData, [field]: value };
    setNodeData(newData);
    if (onDataChange) {
      onDataChange(id, field, value);
    }
  };

  const handleTempFieldChange = (field, value) => {
    setTempNodeData(prev => ({ ...prev, [field]: value }));
  };

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onDataChange) {
      onDataChange(id, 'isCollapsed', newCollapsedState);
    }
  };

  const handleSettingsToggle = () => {
    if (!showSettings) {
      // Opening settings - initialize temp data with current data
      setTempNodeData({ ...nodeData });
    }
    setShowSettings(!showSettings);
  };

  const handleSettingsApply = () => {
    // Apply temp data to actual node data
    Object.keys(tempNodeData).forEach(key => {
      handleFieldChange(key, tempNodeData[key]);
    });
    setShowSettings(false);
    setTempNodeData({});
  };

  const handleSettingsCancel = () => {
    setShowSettings(false);
    setTempNodeData({});
  };

  const handleSettingsReset = () => {
    // Reset to default values
    const resetData = {};
    nodeConfig.fields?.forEach(field => {
      resetData[field.name] = field.default || '';
    });
    setTempNodeData(resetData);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    deleteNode(id);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        if (showSettings) {
          handleSettingsCancel();
        }
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSettings]);

  const nodeWidth = nodeConfig.width || 180;
  const collapsedHeight = 50;
  const expandedHeight = nodeConfig.height || 100;
  const nodeHeight = isCollapsed ? collapsedHeight : expandedHeight;

  const controlButtonStyle = {
    background: 'transparent',
    border: 'none',
    padding: '4px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
    transition: 'all 0.2s ease',
    fontSize: '12px',
    minWidth: '24px',
    minHeight: '24px',
  };

  return (
    <>
      <div 
        className="sophisticated-node"
        style={{
          width: nodeWidth,
          minHeight: nodeHeight,
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Node Header with Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isCollapsed ? '0' : '8px',
          paddingBottom: isCollapsed ? '0' : '6px',
          borderBottom: isCollapsed ? 'none' : `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
        }}>
          <div style={{
            fontSize: isMobile ? '11px' : '12px',
            fontWeight: '700',
            color: isDark ? '#f4f3ff' : '#0f172a',
            letterSpacing: '0.025em',
            flex: 1,
          }}>
            {nodeConfig.title}
          </div>
          
          {/* Node Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.2s ease',
          }}>
            {/* Collapse/Expand Button */}
            <button
              onClick={handleCollapseToggle}
              style={controlButtonStyle}
              title={isCollapsed ? 'Expand Node' : 'Collapse Node'}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
                e.target.style.color = isDark ? '#a78bfa' : '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)';
              }}
            >
              {isCollapsed ? <FiChevronDown size={12} /> : <FiChevronUp size={12} />}
            </button>

            {/* Settings Button */}
            <button
              onClick={handleSettingsToggle}
              style={{
                ...controlButtonStyle,
                color: showSettings ? (isDark ? '#6913e0' : '#3b82f6') : controlButtonStyle.color,
              }}
              title="Node Settings"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
                e.target.style.color = isDark ? '#6913e0' : '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = showSettings ? (isDark ? '#6913e0' : '#3b82f6') : (isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)');
              }}
            >
              <FiSettings size={12} />
            </button>

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              style={controlButtonStyle}
              title="Delete Node"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                e.target.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)';
              }}
            >
              <FiTrash2 size={12} />
            </button>
          </div>
        </div>

        {/* Node Content - Hidden when collapsed */}
        {!isCollapsed && (
          <>
            {/* Node Description */}
            {nodeConfig.description && (
              <div style={{
                fontSize: '10px',
                color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                marginBottom: '10px',
                lineHeight: '1.4',
                fontWeight: '400',
              }}>
                {nodeConfig.description}
              </div>
            )}

            {/* Dynamic Fields */}
            <div style={{ marginBottom: '6px' }}>
              {nodeConfig.fields?.map((field, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '10px',
                    marginBottom: '4px',
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
                      rows={field.type === 'textarea' ? 2 : 1}
                      placeholder={field.placeholder}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                        borderRadius: '5px',
                        background: isDark ? 'rgba(31, 27, 46, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                        color: isDark ? '#f4f3ff' : '#0f172a',
                        fontSize: '11px',
                        fontFamily: 'inherit',
                        resize: field.type === 'textarea' ? 'vertical' : 'none',
                        minHeight: field.type === 'textarea' ? '40px' : 'auto',
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
                        padding: '6px 8px',
                        border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                        borderRadius: '5px',
                        background: isDark ? 'rgba(31, 27, 46, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                        color: isDark ? '#f4f3ff' : '#0f172a',
                        fontSize: '11px',
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
          </>
        )}

        {/* Input Handles (Left Side) */}
        {nodeConfig.inputs?.map((input, index) => (
          <React.Fragment key={`input-${index}`}>
            <Handle
              type="target"
              position={Position.Left}
              id={`${id}-${input.id}`}
              style={{ 
                top: isCollapsed ? '50%' : `${45 + index * 24}px`,
                transform: isCollapsed ? 'translateY(-50%)' : 'none',
                background: isDark ? '#1f1b2e' : '#ffffff',
                border: `2px solid ${isDark ? '#6913e0' : '#3b82f6'}`,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                boxShadow: `0 0 6px ${isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                transition: 'all 0.2s ease',
              }}
            />
            {/* Handle Label */}
            {!isCollapsed && (
              <div style={{
                position: 'absolute',
                left: '-6px',
                top: `${37 + index * 24}px`,
                transform: 'translateX(-100%)',
                fontSize: '9px',
                fontWeight: '500',
                color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
                backgroundColor: isDark ? 'rgba(31, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                padding: '1px 4px',
                borderRadius: '3px',
                opacity: isHovered ? 1 : 0,
                transition: 'all 0.2s ease',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>
                {input.label}
              </div>
            )}
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
                top: isCollapsed ? '50%' : `${45 + index * 24}px`,
                transform: isCollapsed ? 'translateY(-50%)' : 'none',
                background: isDark ? '#1f1b2e' : '#ffffff',
                border: `2px solid ${isDark ? '#6913e0' : '#3b82f6'}`,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                boxShadow: `0 0 6px ${isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                transition: 'all 0.2s ease',
              }}
            />
            {/* Handle Label */}
            {!isCollapsed && (
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: `${37 + index * 24}px`,
                transform: 'translateX(100%)',
                fontSize: '9px',
                fontWeight: '500',
                color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
                backgroundColor: isDark ? 'rgba(31, 27, 46, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                padding: '1px 4px',
                borderRadius: '3px',
                opacity: isHovered ? 1 : 0,
                transition: 'all 0.2s ease',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>
                {output.label}
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Node Glow Effect */}
        {isHovered && (
          <div style={{
            position: 'absolute',
            top: '-1px',
            left: '-1px',
            right: '-1px',
            bottom: '-1px',
            borderRadius: '11px',
            background: `linear-gradient(135deg, ${
              isDark ? 'rgba(105, 19, 224, 0.15)' : 'rgba(59, 130, 246, 0.15)'
            }, transparent)`,
            pointerEvents: 'none',
            zIndex: -1,
          }} />
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div
          ref={settingsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            marginTop: '8px',
            width: Math.max(nodeWidth, 280),
            background: isDark ? 'rgba(31, 27, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${isDark ? '#2d1b69' : '#e2e8f0'}`,
            borderRadius: '12px',
            padding: '16px',
            boxShadow: isDark 
              ? '0 8px 32px rgba(105, 19, 224, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1)'
              : '0 8px 32px rgba(59, 130, 246, 0.1), 0 4px 16px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            zIndex: 1000,
            animation: 'slideInUp 0.2s ease-out',
          }}
        >
          {/* Settings Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: isDark ? '#f4f3ff' : '#0f172a',
            }}>
              {nodeConfig.title} Settings
            </h4>
            <button
              onClick={handleSettingsReset}
              style={{
                ...controlButtonStyle,
                padding: '6px 8px',
                fontSize: '10px',
                borderRadius: '6px',
                border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
              }}
              title="Reset to Defaults"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
                e.target.style.color = isDark ? '#6913e0' : '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)';
              }}
            >
              <FiRotateCcw size={12} style={{ marginRight: '4px' }} />
              Reset
            </button>
          </div>

          {/* Settings Fields */}
          <div style={{ marginBottom: '16px' }}>
            {nodeConfig.fields?.map((field, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  marginBottom: '6px',
                  fontWeight: '600',
                  color: isDark ? 'rgba(244, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
                }}>
                  {field.label}
                </label>
                
                {field.type === 'text' || field.type === 'textarea' ? (
                  <textarea
                    value={tempNodeData[field.name] !== undefined ? tempNodeData[field.name] : (nodeData[field.name] || field.default || '')}
                    onChange={(e) => handleTempFieldChange(field.name, e.target.value)}
                    rows={field.type === 'textarea' ? 3 : 1}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                      borderRadius: '6px',
                      background: isDark ? 'rgba(20, 19, 34, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                      color: isDark ? '#f4f3ff' : '#0f172a',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                      resize: field.type === 'textarea' ? 'vertical' : 'none',
                      minHeight: field.type === 'textarea' ? '60px' : 'auto',
                      outline: 'none',
                      transition: 'all 0.2s ease',
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
                    value={tempNodeData[field.name] !== undefined ? tempNodeData[field.name] : (nodeData[field.name] || field.default || '')}
                    onChange={(e) => handleTempFieldChange(field.name, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                      borderRadius: '6px',
                      background: isDark ? 'rgba(20, 19, 34, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                      color: isDark ? '#f4f3ff' : '#0f172a',
                      fontSize: '12px',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
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
                          background: isDark ? '#141322' : '#ffffff',
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

          {/* Settings Actions */}
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={handleSettingsCancel}
              style={{
                padding: '8px 12px',
                border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                borderRadius: '6px',
                background: 'transparent',
                color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <FiX size={12} />
              Cancel
            </button>
            <button
              onClick={handleSettingsApply}
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                background: isDark 
                  ? 'linear-gradient(135deg, #6913e0, #7c3aed)'
                  : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = isDark 
                  ? '0 4px 12px rgba(105, 19, 224, 0.3)'
                  : '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FiCheck size={12} />
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '280px' : '320px',
            background: isDark ? 'rgba(31, 27, 46, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            border: `1px solid ${isDark ? '#2d1b69' : '#e2e8f0'}`,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: isDark 
              ? '0 20px 60px rgba(105, 19, 224, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2)'
              : '0 20px 60px rgba(59, 130, 246, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(20px)',
            zIndex: 1001,
            animation: 'scaleIn 0.2s ease-out',
          }}
        >
          {/* Delete Confirmation Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <FiTrash2 size={24} color="#ef4444" />
            </div>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: '700',
              color: isDark ? '#f4f3ff' : '#0f172a',
            }}>
              Delete Node
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
              lineHeight: '1.4',
            }}>
              Are you sure you want to delete this {nodeConfig.title} node? This action cannot be undone.
            </p>
          </div>

          {/* Delete Confirmation Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}>
            <button
              onClick={handleDeleteCancel}
              style={{
                padding: '10px 20px',
                border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                borderRadius: '8px',
                background: 'transparent',
                color: isDark ? 'rgba(167, 139, 250, 0.9)' : 'rgba(100, 116, 139, 0.9)',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '80px',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
                e.target.style.borderColor = isDark ? '#6913e0' : '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '80px',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Modal Backdrop for Delete Confirmation */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
          }}
          onClick={handleDeleteCancel}
        />
      )}


    </>
  );
};