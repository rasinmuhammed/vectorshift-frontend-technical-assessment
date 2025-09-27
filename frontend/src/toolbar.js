// Enhanced Toolbar Component - Premium VectorShift Style
import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { useTheme } from './App';
import { 
  FiPlay, 
  FiLayers,  
  FiCpu, 
  FiGlobe, 
  FiGitBranch, 
  FiDatabase,
  FiMessageSquare,
  FiBook,
  FiRocket 
} from 'react-icons/fi';
import {Brain} from 'lucide-react';

export const PipelineToolbar = () => {
  const [activeTab, setActiveTab] = useState('Objects');
  const { isDark } = useTheme();

  const tabs = [
    { id: 'Start', label: 'Start', icon: FiPlay },
    { id: 'Objects', label: 'Objects', icon: FiLayers }, 
    { id: 'Knowledge', label: 'Knowledge', icon: FiBook },
    { id: 'AI', label: 'AI', icon: Brain },
    { id: 'Integrations', label: 'Integrations', icon: FiGlobe },
    { id: 'Logic', label: 'Logic', icon: FiGitBranch },
    { id: 'Data', label: 'Data', icon: FiDatabase },
    { id: 'Chat', label: 'Chat', icon: FiMessageSquare }
  ];

  const getNodesForTab = (tab) => {
    switch(tab) {
      case 'Objects':
        return [
          { type: 'customInput', label: 'Input', description: 'Pass data of different types into your pipeline.' },
          { type: 'customOutput', label: 'Output', description: 'Export the results from your pipeline.' },
          { type: 'text', label: 'Text', description: 'Add text to your pipeline with variable templating.' },
        ];
      case 'AI':
        return [
          { type: 'llm', label: 'LLM', description: 'Query large language models with your data.' },
          { type: 'api', label: 'Google Search', description: 'Query the Google Search API for real-time data.' },
          { type: 'transform', label: 'Transformation', description: 'Use Python code to create custom transformations.' }
        ];
      case 'Logic':
        return [
          { type: 'conditional', label: 'Conditional', description: 'Route data based on dynamic conditions.' },
          { type: 'filter', label: 'Filter', description: 'Filter data based on specific criteria.' }
        ];
      case 'Data':
        return [
          { type: 'database', label: 'Database', description: 'Connect to various database systems.' },
          { type: 'transform', label: 'Transform', description: 'Transform and manipulate data structures.' }
        ];
      case 'Integrations':
        return [
          { type: 'api', label: 'API', description: 'Make HTTP requests to external services.' },
          { type: 'database', label: 'Database', description: 'Perform database operations and queries.' }
        ];
      case 'Knowledge':
        return [
          { type: 'api', label: 'Google Search', description: 'Query the Google Search API for information.' },
          { type: 'text', label: 'Knowledge Base', description: 'Access your knowledge base and documents.' }
        ];
      case 'Chat':
        return [
          { type: 'llm', label: 'Chat Model', description: 'Interactive conversational AI model.' },
          { type: 'text', label: 'Chat Template', description: 'Structure chat conversations and responses.' }
        ];
      default:
        return [];
    }
  };

  const tabStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: isActive 
      ? (isDark ? '#6913e0' : '#3b82f6')
      : (isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)'),
    borderColor: isActive 
      ? (isDark ? '#6913e0' : '#3b82f6')
      : 'transparent',
    position: 'relative',
  });

  const startContentStyle = {
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px', 
    maxHeight: 'none',
    padding: '4px 0',
  };

  const welcomeCardStyle = {
    background: isDark 
      ? 'linear-gradient(135deg, rgba(105, 19, 224, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
    padding: '24px', 
    borderRadius: '12px',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
  };

  const featureCardStyle = {
    background: isDark 
      ? 'rgba(31, 27, 46, 0.6)'
      : 'rgba(255, 255, 255, 0.8)',
    padding: '16px', 
    borderRadius: '8px',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
  };

  const features = [
    {
      icon: FiLayers,
      title: 'Drag & Drop Interface',
      description: 'Build pipelines visually by dragging components from the toolbar.'
    },
    {
      icon: FiCpu,
      title: 'AI-Powered Nodes',
      description: 'Integrate LLMs, APIs, and smart processing components.'
    },
    {
      icon: FiGitBranch,
      title: 'Logic & Control Flow',
      description: 'Add conditional logic, filters, and data transformations.'
    }
  ];

  return (
    <div className="toolbar-container">
      {/* Enhanced Tabs */}
      <div className="toolbar-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              style={tabStyle(isActive)}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.color = isDark ? '#a78bfa' : '#60a5fa';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.color = isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)';
                }
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Enhanced Content */}
      {getNodesForTab(activeTab).length > 0 && (
        <div className="toolbar-content">
          {getNodesForTab(activeTab).map((node, index) => (
            <DraggableNode 
              key={`${node.type}-${index}`}
              type={node.type}
              label={node.label}
              description={node.description}
            />
          ))}
        </div>
      )}

      {/* Enhanced Start Tab Content */}
      {activeTab === 'Start' && (
        <div className="toolbar-content" style={startContentStyle}>
          {/* Welcome Card */}
          <div style={welcomeCardStyle}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, ${
                isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.1)'
              } 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${isDark ? '#6913e0' : '#3b82f6'}, ${isDark ? '#7c3aed' : '#2563eb'})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                <FiPlay size={20} />
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '16px', 
                  fontWeight: '700',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                }}>
                  Pipeline Builder
                </h3>
                <p style={{ 
                  margin: '4px 0 0 0', 
                  fontSize: '12px', 
                  opacity: 0.8,
                  color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                }}>
                  Create powerful data processing workflows
                </p>
              </div>
            </div>
            
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              lineHeight: '1.5',
              color: isDark ? 'rgba(244, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.8)',
            }}>
              Build sophisticated data pipelines by connecting AI models, APIs, databases, and logic components. 
              Start by dragging components from the toolbar tabs above.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  style={featureCardStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.3)';
                    e.target.style.boxShadow = isDark 
                      ? '0 8px 25px rgba(105, 19, 224, 0.15)'
                      : '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      background: `linear-gradient(135deg, ${isDark ? '#6913e0' : '#3b82f6'}, ${isDark ? '#7c3aed' : '#2563eb'})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}>
                      <Icon size={12} />
                    </div>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '13px', 
                      fontWeight: '600',
                      color: isDark ? '#f4f3ff' : '#0f172a',
                    }}>
                      {feature.title}
                    </h4>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '11px', 
                    lineHeight: '1.4',
                    color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                  }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};