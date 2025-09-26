import React, { createContext, useContext, useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import './App.css';

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

function App() {
  const [isDark, setIsDark] = useState(false); // Default to light mode to match VectorShift

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`app ${isDark ? 'dark' : 'light'}`}>
        {/* Header matching VectorShift exactly */}
        <div className="app-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span>Pipelines</span>
              <span className="breadcrumb-separator">/</span>
              <span>Untitled Pipeline</span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="status-indicator draft">
              <div className="status-dot"></div>
              <span>Draft saved</span>
            </div>
            
            <button className="header-button secondary" onClick={toggleTheme}>
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
            
            <button className="header-button secondary">
              View Traces
            </button>
            
            <button className="header-button secondary">
              Version history
            </button>
            
            <button className="header-button primary">
              🚀 Deploy Changes
            </button>
            
            <button className="header-button primary">
              ▶️ Run
            </button>
            
            <button className="header-button secondary">
              📤 Export
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <PipelineToolbar />
        
        {/* Main Pipeline Canvas */}
        <div className="pipeline-canvas">
          <PipelineUI />
        </div>
        
        {/* Submit Button - positioned as overlay */}
        <SubmitButton />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;