import React, { createContext, useContext, useState, useEffect } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './App.css';
import { 
  FiMoon, 
  FiPlay, 
  FiSun,  
  FiExternalLink, 
  FiUploadCloud,
  FiEye,
  FiClock,
  FiActivity,
  FiEdit3,
  FiMenu,
  FiX
} from 'react-icons/fi';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Custom hook for responsive breakpoints
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Set initial values
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Handle orientation change for mobile devices
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return { screenSize, isMobile, isTablet, isDesktop };
};

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pipelineName, setPipelineName] = useState('Untitled Pipeline');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { screenSize, isMobile, isTablet, isDesktop } = useResponsive();

  useEffect(() => {
    const savedTheme = localStorage.getItem('pipeline-theme');
    const savedName = localStorage.getItem('pipeline-name');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(systemPrefersDark);
    }
    
    if (savedName) {
      setPipelineName(savedName);
    }
    
    setIsLoading(false);
  }, []);

  // Close mobile menu when screen size changes to desktop/tablet
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, isMobileMenuOpen]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('pipeline-theme', newTheme ? 'dark' : 'light');
  };

  const handleNameChange = (e) => {
    setPipelineName(e.target.value);
  };

  const handleNameSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      setIsEditingName(false);
      const finalName = pipelineName.trim() || 'Untitled Pipeline';
      setPipelineName(finalName);
      localStorage.setItem('pipeline-name', finalName);
    }
  };

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const iconProps = { size: isMobile ? 10 : 12, style: { marginRight: isMobile ? '2px' : '4px' } };

  // Responsive header buttons - show different sets based on screen size
  const getHeaderButtons = () => {
    const allButtons = [
      {
        key: 'theme',
        priority: 1, // Always show
        component: (
          <button 
            className="header-button secondary" 
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <><FiSun {...iconProps} /> {!isMobile && 'Light'}</>
            ) : (
              <><FiMoon {...iconProps} /> {!isMobile && 'Dark'}</>
            )}
          </button>
        )
      },
      {
        key: 'run',
        priority: 2, // High priority
        component: (
          <button 
            className="header-button primary" 
            title="Run Pipeline"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #059669, #047857)'
                : 'linear-gradient(135deg, #10b981, #059669)',
            }}
          >
            <FiPlay {...iconProps} />
            {!isMobile && 'Run'}
          </button>
        )
      },
      {
        key: 'deploy',
        priority: 3, // Medium-high priority
        component: (
          <button 
            className="header-button primary" 
            title="Deploy Pipeline Changes"
            style={{
              background: isDark 
                ? 'linear-gradient(135deg, #6913e0, #7c3aed)'
                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            }}
          >
            <FiUploadCloud {...iconProps} />
            {!isMobile && 'Deploy'}
          </button>
        )
      },
      {
        key: 'traces',
        priority: 4, // Medium priority
        component: (
          <button className="header-button secondary" title="View Pipeline Traces">
            <FiEye {...iconProps} />
            {!isMobile && 'Traces'}
          </button>
        )
      },
      {
        key: 'history',
        priority: 5, // Lower priority
        component: (
          <button className="header-button secondary" title="Version History">
            <FiClock {...iconProps} />
            {!isMobile && 'History'}
          </button>
        )
      },
      {
        key: 'export',
        priority: 6, // Lowest priority
        component: (
          <button className="header-button secondary" title="Export Pipeline">
            <FiExternalLink {...iconProps} />
            {!isMobile && 'Export'}
          </button>
        )
      }
    ];

    // Filter buttons based on screen size
    let visibleButtons = allButtons;
    
    if (isMobile) {
      // Mobile: Only show essential buttons
      visibleButtons = allButtons.filter(btn => btn.priority <= 2);
    } else if (isTablet) {
      // Tablet: Show high priority buttons
      visibleButtons = allButtons.filter(btn => btn.priority <= 4);
    }
    // Desktop shows all buttons

    return visibleButtons.map(btn => (
      <React.Fragment key={btn.key}>
        {btn.component}
      </React.Fragment>
    ));
  };

  // Loading screen for theme initialization
  if (isLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        height: '100dvh', // Dynamic viewport height for mobile
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        color: '#f4f3ff',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: '500',
        }}>
          <FiActivity size={isMobile ? 16 : 20} style={{ animation: 'spin 1s linear infinite' }} />
          Loading Pipeline Builder...
        </div>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, isMobile, isTablet, isDesktop, screenSize }}>
      <div className={`app ${isDark ? 'dark' : 'light'}`}>
        {/* Enhanced Header with Mobile Support */}
        <div className="app-header">
          <div className="header-left">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                {isMobileMenuOpen ? <FiX size={16} /> : <FiMenu size={16} />}
              </button>
            )}

            <div className="pipeline-name-container">
              {!isMobile && (
                <>
                  <span style={{
                    fontSize: 'clamp(11px, 1.8vw, 13px)',
                    fontWeight: '500',
                    color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
                  }}>
                    Pipelines
                  </span>
                  <span className="breadcrumb-separator">/</span>
                </>
              )}
              
              {isEditingName ? (
                <input
                  type="text"
                  value={pipelineName}
                  onChange={handleNameChange}
                  onBlur={handleNameSubmit}
                  onKeyDown={handleNameSubmit}
                  className="pipeline-name-input"
                  autoFocus
                  style={{
                    fontSize: isMobile ? '13px' : '15px',
                    fontWeight: '600',
                  }}
                />
              ) : (
                <div
                  onClick={handleNameEdit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? '4px' : '6px',
                    cursor: 'pointer',
                    padding: isMobile ? '4px 6px' : '6px 10px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    fontSize: isMobile ? '13px' : '15px',
                    fontWeight: '600',
                    color: isDark ? '#f4f3ff' : '#0f172a',
                    maxWidth: isMobile ? '150px' : '250px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap' 
                  }}>
                    {pipelineName}
                  </span>
                  <FiEdit3 size={isMobile ? 10 : 12} style={{ 
                    opacity: 0.6,
                    transition: 'opacity 0.2s ease',
                    flexShrink: 0
                  }} />
                </div>
              )}
            </div>
          </div>
          
          <div className="header-right">
            {/* Status indicator - hide on small mobile */}
            {!isMobile && (
              <div className="status-indicator">
                <div className="status-dot"></div>
                <span>Draft saved</span>
              </div>
            )}
            
            {getHeaderButtons()}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobile && isMobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            background: isDark 
              ? 'rgba(10, 10, 15, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            zIndex: 999,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {/* Mobile Menu Status */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px',
              background: isDark 
                ? 'rgba(31, 27, 46, 0.6)' 
                : 'rgba(248, 250, 252, 0.6)',
              borderRadius: '8px',
              border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
            }}>
              <div className="status-dot"></div>
              <span style={{
                fontSize: '12px',
                fontWeight: '500',
                color: isDark ? '#34d399' : '#059669',
              }}>
                Draft saved
              </span>
            </div>

            {/* Mobile Menu Actions */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <button 
                className="header-button secondary" 
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  fontSize: '14px',
                }}
                title="View Pipeline Traces"
              >
                <FiEye size={16} style={{ marginRight: '8px' }} />
                View Traces
              </button>
              
              <button 
                className="header-button secondary"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  fontSize: '14px',
                }}
                title="Version History"
              >
                <FiClock size={16} style={{ marginRight: '8px' }} />
                Version History
              </button>
              
              <button 
                className="header-button secondary"
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  fontSize: '14px',
                }}
                title="Export Pipeline"
              >
                <FiExternalLink size={16} style={{ marginRight: '8px' }} />
                Export Pipeline
              </button>
            </div>

            {/* Mobile Menu Footer */}
            <div style={{
              marginTop: 'auto',
              paddingTop: '20px',
              borderTop: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
              }}>
                <span>Screen: {screenSize.width}×{screenSize.height}</span>
                <span>{isDark ? 'Dark' : 'Light'} Mode</span>
              </div>
            </div>
          </div>
        )}
        
        <PipelineToolbar />

        <div className="pipeline-canvas">
          <PipelineUI />
        </div>
       
        <SubmitButton />

        <style jsx global>{`
          /* Enhanced responsive animations and effects */
          @keyframes shimmer {
            0% { left: -100%; }
            50% { left: -100%; }
            100% { left: 100%; }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }

          @keyframes dash-flow {
            to {
              stroke-dashoffset: -9;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* Mobile-specific animations */
          @media (max-width: 767px) {
            .draggable-node {
              animation: slideInRight 0.3s ease-out;
            }

            .sophisticated-node {
              animation: fadeInUp 0.3s ease-out;
            }
          }

          /* Touch-friendly hover states for mobile */
          @media (hover: none) and (pointer: coarse) {
            .header-button:hover,
            .toolbar-tab:hover,
            .draggable-node:hover,
            .feature-card:hover {
              transform: none !important;
              box-shadow: none !important;
            }

            .header-button:active,
            .toolbar-tab:active,
            .draggable-node:active {
              transform: scale(0.98) !important;
              opacity: 0.8 !important;
            }
          }

          /* Enhanced scrollbar styles for mobile */
          @media (max-width: 767px) {
            ::-webkit-scrollbar {
              width: 3px;
              height: 3px;
            }

            ::-webkit-scrollbar-thumb {
              background: ${isDark ? 'rgba(167, 139, 250, 0.5)' : 'rgba(100, 116, 139, 0.5)'};
              border-radius: 2px;
            }
          }

          /* Prevent zoom on iOS */
          @media (max-width: 767px) {
            input, textarea, select {
              font-size: 16px !important;
            }
          }

          /* Safe area adjustments for devices with notches */
          @supports (padding: max(0px)) {
            .app {
              padding-left: env(safe-area-inset-left);
              padding-right: env(safe-area-inset-right);
            }

            .app-header {
              padding-left: max(24px, env(safe-area-inset-left));
              padding-right: max(24px, env(safe-area-inset-right));
            }

            .submit-button-container {
              padding-left: max(32px, env(safe-area-inset-left));
              padding-right: max(32px, env(safe-area-inset-right));
              padding-bottom: max(20px, env(safe-area-inset-bottom));
            }
          }

          /* Enhanced selection colors for better visibility */
          ::selection {
            background: ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
            color: ${isDark ? '#f4f3ff' : '#0f172a'};
          }

          ::-moz-selection {
            background: ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
            color: ${isDark ? '#f4f3ff' : '#0f172a'};
          }

          /* Performance optimizations for mobile */
          @media (max-width: 767px) {
            .react-flow__node,
            .react-flow__edge,
            .sophisticated-node,
            .draggable-node {
              will-change: transform;
              transform: translateZ(0); /* Force hardware acceleration */
            }
          }

          /* Reduced motion preferences */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }

            .status-dot {
              animation: none !important;
            }

            .react-flow__edge-path {
              animation: none !important;
              stroke-dasharray: none !important;
            }
          }

          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .sophisticated-node,
            .draggable-node,
            .header-button {
              border-width: 2px !important;
            }

            .react-flow__handle {
              border-width: 3px !important;
            }
          }

          /* Focus management improvements */
          .header-button:focus-visible,
          .toolbar-tab:focus-visible,
          .pipeline-name-input:focus-visible {
            outline: 2px solid ${isDark ? '#6913e0' : '#3b82f6'} !important;
            outline-offset: 2px !important;
            border-radius: 4px !important;
          }

          /* Ensure proper touch targets on mobile */
          @media (max-width: 767px) {
            .header-button,
            .toolbar-tab,
            .draggable-node {
              min-height: 44px !important;
              min-width: 44px !important;
            }

            .react-flow__controls-button {
              min-height: 40px !important;
              min-width: 40px !important;
            }
          }

          /* Landscape orientation optimizations */
          @media (max-height: 500px) and (orientation: landscape) and (max-width: 1023px) {
            .app-header {
              height: 48px !important;
            }

            .toolbar-container {
              height: 70px !important;
            }

            .submit-button-container {
              height: 50px !important;
            }

            .pipeline-canvas {
              margin: 8px !important;
            }
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;