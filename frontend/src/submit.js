// submit.js - Sophisticated Submit Component

import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    try {
      // Prepare the pipeline data
      const pipelineData = {
        nodes: nodes,
        edges: edges
      };

      // Send to backend
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Create sophisticated alert
      const alertMessage = `
Pipeline Analysis Complete
═══════════════════════════════════════

📊  Nodes: ${result.num_nodes}
🔗  Edges: ${result.num_edges}
${result.is_dag ? '✓' : '✗'}  Valid DAG: ${result.is_dag ? 'Yes' : 'No'}

${result.is_dag 
  ? 'Pipeline structure validated. Ready for execution.' 
  : 'Warning: Circular dependencies detected. Pipeline cannot execute.'}
      `;
      
      alert(alertMessage);
      
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      alert(`Pipeline submission failed: ${error.message}`);
    }
  };

  const isDisabled = nodes.length === 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 32px',
      background: `
        linear-gradient(180deg, 
          rgba(15, 23, 42, 0.95) 0%, 
          rgba(30, 41, 59, 0.95) 100%
        )
      `,
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(148, 163, 184, 0.08)',
      position: 'relative'
    }}>
      {/* Subtle top border glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(196, 181, 253, 0.2), transparent)'
      }} />

      {/* Pipeline Stats */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        color: 'rgba(148, 163, 184, 0.8)',
        fontSize: '13px',
        fontWeight: '500',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '6px',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: nodes.length > 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(148, 163, 184, 0.4)'
          }} />
          <span>{nodes.length} Component{nodes.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: '6px',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: edges.length > 0 ? 'rgba(59, 130, 246, 0.8)' : 'rgba(148, 163, 184, 0.4)'
          }} />
          <span>{edges.length} Connection{edges.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        onClick={handleSubmit}
        disabled={isDisabled}
        style={{
          background: isDisabled 
            ? 'rgba(15, 23, 42, 0.6)'
            : `
              linear-gradient(135deg, 
                rgba(139, 126, 234, 0.9) 0%, 
                rgba(124, 58, 237, 0.9) 100%
              )
            `,
          color: isDisabled ? 'rgba(148, 163, 184, 0.5)' : '#f8fafc',
          border: isDisabled 
            ? '1px solid rgba(148, 163, 184, 0.1)' 
            : '1px solid rgba(139, 126, 234, 0.3)',
          borderRadius: '8px',
          padding: '12px 28px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          boxShadow: isDisabled 
            ? 'none' 
            : `
              0 4px 12px rgba(0, 0, 0, 0.15),
              0 1px 3px rgba(139, 126, 234, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif',
          letterSpacing: '0.025em',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = `
              0 6px 20px rgba(0, 0, 0, 0.2),
              0 2px 6px rgba(139, 126, 234, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `;
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = `
              0 4px 12px rgba(0, 0, 0, 0.15),
              0 1px 3px rgba(139, 126, 234, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `;
          }
        }}
      >
        {/* Button content */}
        <span style={{ 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {isDisabled ? (
            <>
              <span style={{ opacity: 0.7 }}>●</span>
              Add Components to Validate
            </>
          ) : (
            <>
              <span style={{ fontSize: '10px' }}>▶</span>
              Validate Pipeline
            </>
          )}
        </span>
        
        {/* Button highlight effect */}
        {!isDisabled && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            borderRadius: '8px 8px 0 0'
          }} />
        )}
      </button>
    </div>
  );
};