// Enhanced Submit Component - Premium Pipeline Validator
import { useStore } from './store';
import { useTheme } from './App';
import { shallow } from 'zustand/shallow';
import { FiPlay, FiCheck, FiAlertCircle, FiActivity } from 'react-icons/fi';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const { isDark } = useTheme();

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
      
      // Create sophisticated alert with custom modal-like appearance
      const alertMessage = `Pipeline Analysis Complete\n\n` +
        `📊 Nodes: ${result.num_nodes}\n` +
        `🔗 Edges: ${result.num_edges}\n` +
        `${result.is_dag ? '✅' : '❌'} Valid DAG: ${result.is_dag ? 'Yes' : 'No'}\n\n` +
        `${result.is_dag 
          ? '✨ Pipeline structure validated. Ready for execution.' 
          : '⚠️ Warning: Circular dependencies detected. Pipeline cannot execute.'}`;
      
      alert(alertMessage);
      
    } catch (error) {
      console.error('Error submitting pipeline:', error);
      alert(`❌ Pipeline submission failed: ${error.message}`);
    }
  };

  const isDisabled = nodes.length === 0;
  const hasConnections = edges.length > 0;

  const containerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 32px',
    height: '80px',
    background: isDark 
      ? `linear-gradient(180deg, 
          rgba(10, 10, 15, 0.95) 0%, 
          rgba(20, 19, 34, 0.98) 100%
        )`
      : `linear-gradient(180deg, 
          rgba(255, 255, 255, 0.95) 0%, 
          rgba(248, 250, 252, 0.98) 100%
        )`,
    backdropFilter: 'blur(20px)',
    borderTop: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
    zIndex: 1000,
    boxShadow: isDark 
      ? '0 -8px 32px rgba(105, 19, 224, 0.1)'
      : '0 -8px 32px rgba(0, 0, 0, 0.04)',
  };

  const statsStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: 'inherit',
  };

  const statItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 16px',
    background: isDark 
      ? 'rgba(31, 27, 46, 0.6)' 
      : 'rgba(255, 255, 255, 0.6)',
    borderRadius: '8px',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
    backdropFilter: 'blur(10px)',
  };

  const buttonStyle = {
    background: isDisabled 
      ? (isDark ? 'rgba(31, 27, 46, 0.6)' : 'rgba(248, 250, 252, 0.6)')
      : (isDark 
          ? `linear-gradient(135deg, #6913e0, #7c3aed)`
          : `linear-gradient(135deg, #3b82f6, #2563eb)`
        ),
    color: isDisabled 
      ? (isDark ? 'rgba(167, 139, 250, 0.5)' : 'rgba(100, 116, 139, 0.5)')
      : '#ffffff',
    border: isDisabled 
      ? `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}` 
      : 'none',
    borderRadius: '10px',
    padding: '14px 32px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    boxShadow: isDisabled 
      ? 'none' 
      : (isDark
          ? `0 4px 20px rgba(105, 19, 224, 0.3), 
             0 1px 3px rgba(105, 19, 224, 0.4),
             inset 0 1px 0 rgba(255, 255, 255, 0.1)`
          : `0 4px 20px rgba(59, 130, 246, 0.25),
             0 1px 3px rgba(59, 130, 246, 0.3),
             inset 0 1px 0 rgba(255, 255, 255, 0.2)`
        ),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    letterSpacing: '0.025em',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backdropFilter: 'blur(10px)',
  };

  return (
    <div style={containerStyle}>
      {/* Subtle top border glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent, ${
          isDark ? 'rgba(105, 19, 224, 0.4)' : 'rgba(59, 130, 246, 0.3)'
        }, transparent)`
      }} />

      {/* Pipeline Statistics */}
      <div style={statsStyle}>
        <div style={statItemStyle}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: nodes.length > 0 
              ? (isDark ? '#6913e0' : '#3b82f6')
              : (isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(100, 116, 139, 0.4)'),
            boxShadow: nodes.length > 0 
              ? `0 0 8px ${isDark ? '#6913e0' : '#3b82f6'}` 
              : 'none',
            transition: 'all 0.3s ease',
          }} />
          <FiActivity size={14} />
          <span>{nodes.length} Component{nodes.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div style={statItemStyle}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: hasConnections 
              ? (isDark ? '#6913e0' : '#3b82f6')
              : (isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(100, 116, 139, 0.4)'),
            boxShadow: hasConnections 
              ? `0 0 8px ${isDark ? '#6913e0' : '#3b82f6'}` 
              : 'none',
            transition: 'all 0.3s ease',
          }} />
          <FiCheck size={14} />
          <span>{edges.length} Connection{edges.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Pipeline Status Indicator */}
        <div style={{
          ...statItemStyle,
          background: (nodes.length > 0 && hasConnections) 
            ? (isDark 
                ? 'rgba(16, 185, 129, 0.15)' 
                : 'rgba(16, 185, 129, 0.1)'
              )
            : statItemStyle.background,
          borderColor: (nodes.length > 0 && hasConnections)
            ? (isDark 
                ? 'rgba(16, 185, 129, 0.3)' 
                : 'rgba(16, 185, 129, 0.2)'
              )
            : (isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'),
          color: (nodes.length > 0 && hasConnections)
            ? (isDark ? '#34d399' : '#059669')
            : (isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)'),
        }}>
          {(nodes.length > 0 && hasConnections) ? (
            <>
              <FiCheck size={14} />
              <span>Pipeline Ready</span>
            </>
          ) : (
            <>
              <FiAlertCircle size={14} />
              <span>In Progress</span>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Submit Button */}
      <button 
        type="submit"
        onClick={handleSubmit}
        disabled={isDisabled}
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
            e.target.style.boxShadow = isDark
              ? `0 8px 30px rgba(105, 19, 224, 0.4), 
                 0 4px 8px rgba(105, 19, 224, 0.5),
                 inset 0 1px 0 rgba(255, 255, 255, 0.15)`
              : `0 8px 30px rgba(59, 130, 246, 0.35),
                 0 4px 8px rgba(59, 130, 246, 0.4),
                 inset 0 1px 0 rgba(255, 255, 255, 0.25)`;
          }
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = isDark
              ? `0 4px 20px rgba(105, 19, 224, 0.3), 
                 0 1px 3px rgba(105, 19, 224, 0.4),
                 inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : `0 4px 20px rgba(59, 130, 246, 0.25),
                 0 1px 3px rgba(59, 130, 246, 0.3),
                 inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
          }
        }}
        onMouseDown={(e) => {
          if (!isDisabled) {
            e.target.style.transform = 'translateY(-1px) scale(0.98)';
          }
        }}
        onMouseUp={(e) => {
          if (!isDisabled) {
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
          }
        }}
      >
        {/* Button Icon and Text */}
        {isDisabled ? (
          <>
            <FiAlertCircle size={16} style={{ opacity: 0.7 }} />
            <span>Add Components to Validate</span>
          </>
        ) : (
          <>
            <FiPlay size={16} />
            <span>Validate Pipeline</span>
          </>
        )}
        
        {/* Premium Button Highlight Effect */}
        {!isDisabled && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            borderRadius: '10px 10px 0 0'
          }} />
        )}

        {/* Animated Gradient Overlay for Premium Feel */}
        {!isDisabled && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            animation: 'shimmer 3s infinite',
            borderRadius: '10px',
          }} />
        )}
      </button>

      {/* Custom CSS Animation for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { left: -100%; }
          50% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};