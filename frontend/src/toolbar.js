// toolbar.js - Sophisticated Dark Toolbar

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  const nodeCategories = [
    {
      title: 'Core Components',
      nodes: [
        { type: 'customInput', label: 'Input', description: 'Data source' },
        { type: 'customOutput', label: 'Output', description: 'Data destination' },
        { type: 'text', label: 'Text', description: 'Text processing' },
        { type: 'llm', label: 'Language Model', description: 'AI processing' }
      ]
    },
    {
      title: 'Data Processing',
      nodes: [
        { type: 'filter', label: 'Filter', description: 'Data filtering' },
        { type: 'transform', label: 'Transform', description: 'Data transformation' },
        { type: 'conditional', label: 'Conditional', description: 'Logic branching' }
      ]
    },
    {
      title: 'External Services',
      nodes: [
        { type: 'api', label: 'API', description: 'HTTP requests' },
        { type: 'database', label: 'Database', description: 'Data storage' }
      ]
    }
  ];

  return (
    <div style={{
      background: `
        linear-gradient(180deg, 
          rgba(15, 23, 42, 0.95) 0%, 
          rgba(30, 41, 59, 0.95) 50%,
          rgba(15, 23, 42, 0.95) 100%
        )
      `,
      backdropFilter: 'blur(20px)',
      padding: '24px 32px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
      position: 'relative'
    }}>
      {/* Subtle top border glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(196, 181, 253, 0.3), transparent)'
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: '#f8fafc',
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '8px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            Pipeline Builder
          </h1>
          <p style={{
            color: 'rgba(226, 232, 240, 0.7)',
            fontSize: '14px',
            fontWeight: '400',
            margin: 0,
            letterSpacing: '0.025em'
          }}>
            Drag components to create sophisticated data processing workflows
          </p>
        </div>

        {/* Node Categories */}
        <div style={{
          display: 'flex',
          gap: '48px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {nodeCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} style={{ 
              minWidth: '280px',
              maxWidth: '320px'
            }}>
              {/* Category Header */}
              <div style={{
                marginBottom: '16px',
                paddingBottom: '8px',
                borderBottom: '1px solid rgba(196, 181, 253, 0.1)'
              }}>
                <h3 style={{
                  color: 'rgba(196, 181, 253, 0.9)',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: 0,
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif'
                }}>
                  {category.title}
                </h3>
              </div>
              
              {/* Category Nodes */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px'
              }}>
                {category.nodes.map((node, nodeIndex) => (
                  <DraggableNode 
                    key={nodeIndex}
                    type={node.type} 
                    label={node.label}
                    description={node.description}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Instructions */}
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          paddingTop: '20px',
          borderTop: '1px solid rgba(148, 163, 184, 0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
            color: 'rgba(148, 163, 184, 0.7)',
            fontSize: '11px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <span>• Drag components to canvas</span>
            <span>• Connect outputs to inputs</span>
            <span>• Configure node properties</span>
            <span>• Submit for validation</span>
          </div>
        </div>
      </div>
    </div>
  );
};