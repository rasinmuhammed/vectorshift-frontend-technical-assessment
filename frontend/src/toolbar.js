// toolbar.js - VectorShift Style Toolbar

import { useState } from 'react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  const [activeTab, setActiveTab] = useState('Objects');

  const tabs = [
    'Start',
    'Objects', 
    'Knowledge',
    'AI',
    'Integrations',
    'Logic',
    'Data',
    'Chat'
  ];

  const getNodesForTab = (tab) => {
    switch(tab) {
      case 'Objects':
        return [
          { type: 'customInput', label: 'Input', description: 'Pass data of different types into your pipeline.' },
          { type: 'customOutput', label: 'Output', description: 'Export the results from your pipeline.' },
          { type: 'text', label: 'Text', description: 'Add text to your pipeline.' },
        ];
      case 'AI':
        return [
          { type: 'llm', label: 'LLM', description: 'Query LLM with your data.' },
          { type: 'api', label: 'Google Search', description: 'Query the Google Search search API.' },
          { type: 'transform', label: 'Transformation', description: 'Use Python code to create a custom node.' }
        ];
      case 'Logic':
        return [
          { type: 'conditional', label: 'Conditional', description: 'Route data based on conditions.' },
          { type: 'filter', label: 'Filter', description: 'Filter data based on criteria.' }
        ];
      case 'Data':
        return [
          { type: 'database', label: 'Database', description: 'Connect to databases.' },
          { type: 'transform', label: 'Transform', description: 'Transform data structure.' }
        ];
      case 'Integrations':
        return [
          { type: 'api', label: 'API', description: 'Make HTTP requests.' },
          { type: 'database', label: 'Database', description: 'Database operations.' }
        ];
      case 'Knowledge':
        return [
            { type: 'api', label: 'Google Search', description: 'Query the Google Search search API.' },
        ]
      default:
        return [];
    }
  };

  return (
    <div className="toolbar-container">
      {/* Tabs */}
      <div className="toolbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`toolbar-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
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
        <div className="toolbar-content" style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'none' }}>
          <div style={{ 
            background: 'rgba(59, 130, 246, 0.1)', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
              Pipeline Builder
            </h3>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
              Create powerful data processing workflows by dragging and connecting components.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};