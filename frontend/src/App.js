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
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`app ${isDark ? 'dark' : 'light'}`}>
        <div className="app-header">
          <div className="app-title">
            <h1>VectorShift Pipeline</h1>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="app-content">
          <PipelineToolbar />
          <div className="pipeline-container">
            <PipelineUI />
          </div>
          <SubmitButton />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;