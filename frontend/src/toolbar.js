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
  FiBook
} from 'react-icons/fi';
import { Brain } from 'lucide-react';

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
          { type: 'customInput', label: 'Input', description: 'Data input source' },
          { type: 'customOutput', label: 'Output', description: 'Data output destination' },
          { type: 'text', label: 'Text', description: 'Text processing' },
        ];
      case 'AI':
        return [
          { type: 'llm', label: 'LLM', description: 'Large language model' },
          { type: 'api', label: 'AI API', description: 'External AI services' },
          { type: 'transform', label: 'AI Transform', description: 'AI-powered transformation' }
        ];
      case 'Logic':
        return [
          { type: 'conditional', label: 'Conditional', description: 'Conditional branching' },
          { type: 'filter', label: 'Filter', description: 'Data filtering' }
        ];
      case 'Data':
        return [
          { type: 'database', label: 'Database', description: 'Database operations' },
          { type: 'transform', label: 'Transform', description: 'Data transformation' }
        ];
      case 'Integrations':
        return [
          { type: 'api', label: 'REST API', description: 'HTTP API integration' },
          { type: 'database', label: 'SQL DB', description: 'SQL database connection' }
        ];
      case 'Knowledge':
        return [
          { type: 'api', label: 'Search', description: 'Knowledge base search' },
          { type: 'text', label: 'Knowledge', description: 'Knowledge processing' }
        ];
      case 'Chat':
        return [
          { type: 'llm', label: 'Chat Bot', description: 'Conversational AI' },
          { type: 'text', label: 'Chat Template', description: 'Chat message template' }
        ];
      default:
        return [];
    }
  };

  const tabStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingBottom: '10px',
    fontSize: '13px',
    fontWeight: '500',
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
    whiteSpace: 'nowrap',
  });

  const startContentStyle = {
    display: 'flex', 
    gap: '12px',
    maxHeight: 'none',
    padding: '0',
    alignItems: 'flex-start',
  };

  const welcomeCardStyle = {
    background: isDark 
      ? 'linear-gradient(135deg, rgba(105, 19, 224, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%)',
    padding: '16px', 
    borderRadius: '10px',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.25)' : 'rgba(59, 130, 246, 0.15)'}`,
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
    flex: '1',
    minWidth: '200px',
  };

  const featureCardStyle = {
    background: isDark 
      ? 'rgba(31, 27, 46, 0.6)'
      : 'rgba(255, 255, 255, 0.8)',
    padding: '12px', 
    borderRadius: '8px',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.18)' : 'rgba(59, 130, 246, 0.12)'}`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
    minWidth: '160px',
    flexShrink: 0,
  };

  const features = [
    {
      icon: FiLayers,
      title: 'Drag & Drop',
      description: 'Visual pipeline building'
    },
    {
      icon: FiCpu,
      title: 'AI Integration',
      description: 'LLMs and smart processing'
    },
    {
      icon: FiGitBranch,
      title: 'Logic Flow',
      description: 'Conditional & data flow'
    }
  ];

  return (
    <div className="toolbar-container">
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
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

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

      {activeTab === 'Start' && (
        <div className="toolbar-content" style={startContentStyle}>
          {/* Welcome Card */}
          <div style={welcomeCardStyle}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '60px',
              height: '60px',
              background: `radial-gradient(circle, ${
                isDark ? 'rgba(105, 19, 224, 0.15)' : 'rgba(59, 130, 246, 0.08)'
              } 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: `linear-gradient(135deg, ${isDark ? '#6913e0' : '#3b82f6'}, ${isDark ? '#7c3aed' : '#2563eb'})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                <FiPlay size={16} />
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  fontWeight: '600',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                }}>
                  Pipeline Builder
                </h3>
                <p style={{ 
                  margin: '2px 0 0 0', 
                  fontSize: '11px', 
                  opacity: 0.8,
                  color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                }}>
                  Create powerful workflows
                </p>
              </div>
            </div>
            
            <p style={{ 
              margin: 0, 
              fontSize: '12px', 
              lineHeight: '1.4',
              color: isDark ? 'rgba(244, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.8)',
            }}>
              Build sophisticated data pipelines by connecting AI models, APIs, databases, and logic components.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="feature-cards">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="feature-card"
                  style={featureCardStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.35)' : 'rgba(59, 130, 246, 0.25)';
                    e.target.style.boxShadow = isDark 
                      ? '0 4px 12px rgba(105, 19, 224, 0.12)'
                      : '0 4px 12px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.18)' : 'rgba(59, 130, 246, 0.12)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      background: `linear-gradient(135deg, ${isDark ? '#6913e0' : '#3b82f6'}, ${isDark ? '#7c3aed' : '#2563eb'})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}>
                      <Icon size={10} />
                    </div>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: '12px', 
                      fontWeight: '500',
                      color: isDark ? '#f4f3ff' : '#0f172a',
                    }}>
                      {feature.title}
                    </h4>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '10px', 
                    lineHeight: '1.3',
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