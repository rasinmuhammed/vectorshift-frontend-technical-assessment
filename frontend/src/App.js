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
  FiEdit3
} from 'react-icons/fi';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pipelineName, setPipelineName] = useState('Untitled Pipeline');
  const [isEditingName, setIsEditingName] = useState(false);

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

  const iconProps = { size: 12, style: { marginRight: '4px' } };

  // Loading screen for theme initialization
  if (isLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
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
          fontSize: '14px',
          fontWeight: '500',
        }}>
          <FiActivity size={20} style={{ animation: 'spin 1s linear infinite' }} />
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
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`app ${isDark ? 'dark' : 'light'}`}>
     
        <div className="app-header">
          <div className="header-left">
            <div className="pipeline-name-container">
              <span style={{
                fontSize: '13px',
                fontWeight: '500',
                color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
              }}>
                Pipelines
              </span>
              <span className="breadcrumb-separator">/</span>
              
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
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                />
              ) : (
                <div
                  onClick={handleNameEdit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    transition: 'all 0.2s ease',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: isDark ? '#f4f3ff' : '#0f172a',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  <span>{pipelineName}</span>
                  <FiEdit3 size={12} style={{ 
                    opacity: 0.6,
                    transition: 'opacity 0.2s ease'
                  }} />
                </div>
              )}
            </div>
          </div>
          
          <div className="header-right">
            <div className="status-indicator">
              <div className="status-dot"></div>
              <span>Draft saved</span>
            </div>
            
            <button 
              className="header-button secondary" 
              onClick={toggleTheme}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? (
                <><FiSun {...iconProps} /> Light</>
              ) : (
                <><FiMoon {...iconProps} /> Dark</>
              )}
            </button>
            
            <button className="header-button secondary" title="View Pipeline Traces">
              <FiEye {...iconProps} />
              View Traces
            </button>
            
            <button className="header-button secondary" title="Version History">
              <FiClock {...iconProps} />
              Version history
            </button>
            
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
              Deploy Changes
            </button>
            
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
              Run
            </button>
            
            <button className="header-button secondary" title="Export Pipeline">
              <FiExternalLink {...iconProps} />
              Export
            </button>
          </div>
        </div>
        
        <PipelineToolbar />

        <div className="pipeline-canvas">
          <PipelineUI />
        </div>
       
        <SubmitButton />

        <style jsx global>{`
          /* Shimmer animation for premium buttons */
          @keyframes shimmer {
            0% { left: -100%; }
            50% { left: -100%; }
            100% { left: 100%; }
          }

          /* Pulse animation for status indicators */
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }

          /* Dash flow animation for connection lines */
          @keyframes dash-flow {
            to {
              stroke-dashoffset: -9;
            }
          }

          /* Smooth scrollbar styles */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${isDark ? 'rgba(167, 139, 250, 0.3)' : 'rgba(100, 116, 139, 0.3)'};
            border-radius: 3px;
            transition: background 0.3s ease;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? 'rgba(167, 139, 250, 0.5)' : 'rgba(100, 116, 139, 0.5)'};
          }

          /* Enhanced focus styles */
          button:focus-visible,
          input:focus-visible,
          textarea:focus-visible,
          select:focus-visible {
            outline: 2px solid ${isDark ? '#6913e0' : '#3b82f6'};
            outline-offset: 2px;
          }

          /* Smooth transitions for theme changes */
          * {
            transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                       border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                       color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                       box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Prevent text selection on UI elements */
          .app-header,
          .toolbar-container,
          .react-flow__controls,
          .top-right-controls {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
          }

          /* Enhanced typography */
          body {
            font-feature-settings: "cv03", "cv04", "cv11";
          }

          /* Custom selection colors */
          ::selection {
            background: ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
            color: ${isDark ? '#f4f3ff' : '#0f172a'};
          }

          ::-moz-selection {
            background: ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'};
            color: ${isDark ? '#f4f3ff' : '#0f172a'};
          }

          /* Performance optimizations */
          .react-flow__node {
            will-change: transform;
          }

          .react-flow__edge {
            will-change: d;
          }
        `}</style>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;