// Fixed Responsive Toolbar Component - Premium VectorShift Style
import React, { useState, useEffect, useRef } from 'react';
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
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList
} from 'react-icons/fi';
import { Brain } from 'lucide-react';

export const PipelineToolbar = () => {
  const [activeTab, setActiveTab] = useState('Objects');
  const { isDark, isMobile, isTablet, screenSize } = useTheme();
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const tabsRef = useRef(null);
  const contentRef = useRef(null);

  // Check scroll state
  const checkScrollState = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setShowScrollButtons(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScrollState();
    const handleResize = () => checkScrollState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  // Scroll functions
  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -120, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 120, behavior: 'smooth' });
    }
  };

  const scrollContentLeft = () => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollContentRight = () => {
    if (contentRef.current) {
      contentRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

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

  // Enhanced responsive styling
  const getContainerStyle = () => ({
    padding: isMobile ? '0 12px' : (isTablet ? '0 20px' : '0 24px'),
    borderBottom: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
    transition: 'all 0.3s ease',
    height: isMobile ? '85px' : (isTablet ? '100px' : '110px'),
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    zIndex: 998, // Ensure it's below header but above canvas
    overflow: 'visible',
    background: isDark 
      ? 'rgba(20, 19, 34, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
  });

  // Enhanced content styling for proper layering
  const getContentStyle = () => {
    const baseStyle = {
      paddingBottom: isMobile ? '8px' : '12px',
      display: 'flex',
      gap: isMobile ? '6px' : '8px',
      flex: 1,
      alignItems: 'flex-start',
      scrollbarWidth: 'thin',
      position: 'relative',
      zIndex: 'inherit', // Inherit from parent
    };

    if (isMobile && viewMode === 'list') {
      return {
        ...baseStyle,
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: '50px',
      };
    }
    
    return {
      ...baseStyle,
      overflowX: 'auto',
      overflowY: 'hidden',
    };
  };

  // Start content responsive styling
  const getStartContentStyle = () => ({
    display: 'flex', 
    gap: isMobile ? '8px' : '12px',
    maxHeight: 'none',
    padding: '0',
    alignItems: 'flex-start',
    flexDirection: isMobile ? 'column' : 'row',
    overflowY: isMobile ? 'auto' : 'visible',
    flex: 1,
  });

  const getWelcomeCardStyle = () => ({
    background: isDark 
      ? 'linear-gradient(135deg, rgba(105, 19, 224, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%)',
    padding: isMobile ? '12px' : (isTablet ? '14px' : '16px'),
    borderRadius: isMobile ? '8px' : '10px',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.25)' : 'rgba(59, 130, 246, 0.15)'}`,
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden',
    flex: isMobile ? 'none' : '1',
    minWidth: isMobile ? '100%' : '200px',
  });

  const getFeatureCardStyle = () => ({
    background: isDark 
      ? 'rgba(31, 27, 46, 0.8)'
      : 'rgba(255, 255, 255, 0.9)',
    padding: isMobile ? '8px' : '12px',
    borderRadius: isMobile ? '6px' : '8px',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.18)' : 'rgba(59, 130, 246, 0.12)'}`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
    minWidth: isMobile ? '100%' : (isTablet ? '140px' : '160px'),
    flexShrink: 0,
  });

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
    <div style={getContainerStyle()}>
      {/* Enhanced Tabs Section with Scroll Controls */}
      <div style={{ 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        marginBottom: isMobile ? '8px' : '12px',
        paddingTop: isMobile ? '8px' : '12px',
        zIndex: 'inherit',
      }}>
        {/* Left Scroll Button */}
        {showScrollButtons && canScrollLeft && !isMobile && (
          <button
            onClick={scrollLeft}
            style={{
              position: 'absolute',
              left: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: isDark 
                ? 'linear-gradient(90deg, rgba(20, 19, 34, 0.9) 0%, transparent 100%)'
                : 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, transparent 100%)',
              border: 'none',
              padding: '4px 8px 4px 4px',
              cursor: 'pointer',
              color: isDark ? '#6913e0' : '#3b82f6',
              borderRadius: '4px',
            }}
          >
            <FiChevronLeft size={16} />
          </button>
        )}

        {/* Tabs Container */}
        <div 
          ref={tabsRef}
          style={{
            display: 'flex',
            gap: isMobile ? '8px' : '16px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            flex: 1,
            paddingLeft: showScrollButtons && canScrollLeft && !isMobile ? '20px' : '0',
            paddingRight: showScrollButtons && canScrollRight && !isMobile ? '20px' : '0',
          }}
          onScroll={checkScrollState}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isMobile ? '3px' : '6px',
                  paddingBottom: isMobile ? '6px' : '8px',
                  fontSize: isMobile ? '10px' : (isTablet ? '11px' : '13px'),
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
                  flexShrink: 0,
                  padding: isMobile ? '0 4px' : '0 8px',
                  minWidth: isMobile ? '50px' : 'auto',
                  textAlign: 'center',
                }}
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
                <Icon size={isMobile ? 10 : 12} />
                {(!isMobile || screenSize.width > 400) && <span>{tab.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {showScrollButtons && canScrollRight && !isMobile && (
          <button
            onClick={scrollRight}
            style={{
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: isDark 
                ? 'linear-gradient(270deg, rgba(20, 19, 34, 0.9) 0%, transparent 100%)'
                : 'linear-gradient(270deg, rgba(255, 255, 255, 0.9) 0%, transparent 100%)',
              border: 'none',
              padding: '4px 4px 4px 8px',
              cursor: 'pointer',
              color: isDark ? '#6913e0' : '#3b82f6',
              borderRadius: '4px',
            }}
          >
            <FiChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Mobile View Mode Toggle */}
      {isMobile && activeTab !== 'Start' && getNodesForTab(activeTab).length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          padding: '0 4px',
          zIndex: 'inherit',
        }}>
          <span style={{
            fontSize: '10px',
            color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
            fontWeight: '500',
          }}>
            View:
          </span>
          <div style={{
            display: 'flex',
            background: isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)',
            borderRadius: '4px',
            padding: '2px',
            border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' 
                  ? (isDark ? '#6913e0' : '#3b82f6')
                  : 'transparent',
                border: 'none',
                padding: '4px',
                borderRadius: '2px',
                cursor: 'pointer',
                color: viewMode === 'grid' 
                  ? 'white'
                  : (isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)'),
                transition: 'all 0.2s ease',
              }}
            >
              <FiGrid size={12} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' 
                  ? (isDark ? '#6913e0' : '#3b82f6')
                  : 'transparent',
                border: 'none',
                padding: '4px',
                borderRadius: '2px',
                cursor: 'pointer',
                color: viewMode === 'list' 
                  ? 'white'
                  : (isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)'),
                transition: 'all 0.2s ease',
              }}
            >
              <FiList size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Content Section with Enhanced Scroll Controls */}
      {getNodesForTab(activeTab).length > 0 && (
        <div style={{ position: 'relative', flex: 1, zIndex: 'inherit' }}>
          {/* Content scroll buttons for desktop/tablet */}
          {!isMobile && viewMode === 'grid' && (
            <>
              <button
                onClick={scrollContentLeft}
                style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: isDark 
                    ? 'linear-gradient(90deg, rgba(20, 19, 34, 0.8) 0%, transparent 100%)'
                    : 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%)',
                  border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                  borderRadius: '6px',
                  padding: '6px 8px 6px 4px',
                  cursor: 'pointer',
                  color: isDark ? '#6913e0' : '#3b82f6',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              >
                <FiChevronLeft size={14} />
              </button>
              <button
                onClick={scrollContentRight}
                style={{
                  position: 'absolute',
                  right: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  background: isDark 
                    ? 'linear-gradient(270deg, rgba(20, 19, 34, 0.8) 0%, transparent 100%)'
                    : 'linear-gradient(270deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%)',
                  border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                  borderRadius: '6px',
                  padding: '6px 4px 6px 8px',
                  cursor: 'pointer',
                  color: isDark ? '#6913e0' : '#3b82f6',
                  opacity: 0.7,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              >
                <FiChevronRight size={14} />
              </button>
            </>
          )}

          <div 
            ref={contentRef}
            style={getContentStyle()}
          >
            {getNodesForTab(activeTab).map((node, index) => (
              <DraggableNode 
                key={`${node.type}-${index}`}
                type={node.type}
                label={node.label}
                description={node.description}
              />
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Start Content */}
      {activeTab === 'Start' && (
        <div style={getStartContentStyle()}>
          {/* Welcome Card */}
          <div style={getWelcomeCardStyle()}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: isMobile ? '40px' : '60px',
              height: isMobile ? '40px' : '60px',
              background: `radial-gradient(circle, ${
                isDark ? 'rgba(105, 19, 224, 0.15)' : 'rgba(59, 130, 246, 0.08)'
              } 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '8px' : '10px',
              marginBottom: isMobile ? '8px' : '10px',
            }}>
              <div style={{
                width: isMobile ? '28px' : '32px',
                height: isMobile ? '28px' : '32px',
                borderRadius: '6px',
                background: `linear-gradient(135deg, ${isDark ? '#6913e0' : '#3b82f6'}, ${isDark ? '#7c3aed' : '#2563eb'})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                <FiPlay size={isMobile ? 12 : 16} />
              </div>
              <div>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: isMobile ? '12px' : '14px',
                  fontWeight: '600',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                }}>
                  Pipeline Builder
                </h3>
                <p style={{ 
                  margin: '2px 0 0 0', 
                  fontSize: isMobile ? '9px' : '11px',
                  opacity: 0.8,
                  color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
                }}>
                  Create powerful workflows
                </p>
              </div>
            </div>
            
            <p style={{ 
              margin: 0, 
              fontSize: isMobile ? '10px' : '12px',
              lineHeight: '1.4',
              color: isDark ? 'rgba(244, 243, 255, 0.9)' : 'rgba(15, 23, 42, 0.8)',
            }}>
              Build sophisticated data pipelines by connecting AI models, APIs, databases, and logic components.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'flex',
            gap: isMobile ? '6px' : '8px',
            overflowX: isMobile ? 'visible' : 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            flexDirection: isMobile ? 'column' : 'row',
            flex: isMobile ? 'none' : '1',
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  style={getFeatureCardStyle()}
                  onMouseEnter={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.35)' : 'rgba(59, 130, 246, 0.25)';
                      e.target.style.boxShadow = isDark 
                        ? '0 4px 12px rgba(105, 19, 224, 0.12)'
                        : '0 4px 12px rgba(0, 0, 0, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.18)' : 'rgba(59, 130, 246, 0.12)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '4px' : '6px',
                    marginBottom: isMobile ? '4px' : '6px',
                  }}>
                    <div style={{
                      width: isMobile ? '16px' : '20px',
                      height: isMobile ? '16px' : '20px',
                      borderRadius: '4px',
                      background: `linear-gradient(135deg, ${isDark ? '#6913e0' : '#3b82f6'}, ${isDark ? '#7c3aed' : '#2563eb'})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}>
                      <Icon size={isMobile ? 8 : 10} />
                    </div>
                    <h4 style={{ 
                      margin: 0, 
                      fontSize: isMobile ? '10px' : '12px',
                      fontWeight: '500',
                      color: isDark ? '#f4f3ff' : '#0f172a',
                    }}>
                      {feature.title}
                    </h4>
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: isMobile ? '8px' : '10px',
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