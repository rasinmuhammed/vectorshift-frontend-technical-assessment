// Validation Modal Component
import React from 'react';
import { useTheme } from './App';
import { FiX, FiCheck, FiAlertCircle, FiActivity, FiZap } from 'react-icons/fi';

export const ValidationModal = ({ isOpen, onClose, validationResult, isLoading }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    animation: 'fadeIn 0.2s ease-out',
  };

  const modalStyle = {
    background: isDark 
      ? 'linear-gradient(135deg, rgba(31, 27, 46, 0.98) 0%, rgba(20, 19, 34, 0.95) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '480px',
    width: '90%',
    maxHeight: '80vh',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
    boxShadow: isDark 
      ? '0 20px 60px rgba(105, 19, 224, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)'
      : '0 20px 60px rgba(59, 130, 246, 0.1), 0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(20px)',
    position: 'relative',
    animation: 'slideInScale 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
    transition: 'all 0.2s ease',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: isDark ? '#f4f3ff' : '#0f172a',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const statCardStyle = {
    background: isDark 
      ? 'rgba(105, 19, 224, 0.1)' 
      : 'rgba(59, 130, 246, 0.05)',
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.15)'}`,
    backdropFilter: 'blur(10px)',
  };

  const statRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  };

  const statLabelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: isDark ? 'rgba(167, 139, 250, 0.8)' : 'rgba(100, 116, 139, 0.8)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const statValueStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: isDark ? '#f4f3ff' : '#0f172a',
  };

  const statusCardStyle = (isValid) => ({
    background: isValid 
      ? (isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.1)')
      : (isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'),
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${isValid 
      ? (isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)')
      : (isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)')}`,
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
  });

  const loadingStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '40px 20px',
  };

  const LoadingSpinner = () => (
    <div style={{
      width: '40px',
      height: '40px',
      border: `3px solid ${isDark ? 'rgba(105, 19, 224, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
      borderTop: `3px solid ${isDark ? '#6913e0' : '#3b82f6'}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />);




  return (
    <>
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={titleStyle}>
              <FiZap size={24} style={{ color: isDark ? '#6913e0' : '#3b82f6' }} />
              Pipeline Validation
            </div>
            <button 
              style={closeButtonStyle}
              onClick={onClose}
              onMouseEnter={(e) => {
                e.target.style.background = isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.1)';
                e.target.style.color = isDark ? '#a78bfa' : '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)';
              }}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={contentStyle}>
            {isLoading ? (
              <div style={loadingStyle}>
                <LoadingSpinner />
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDark ? '#f4f3ff' : '#0f172a',
                }}>
                  Analyzing Pipeline...
                </div>
                <div style={{
                  fontSize: '14px',
                  color: isDark ? 'rgba(167, 139, 250, 0.7)' : 'rgba(100, 116, 139, 0.7)',
                }}>
                  Validating structure and connections
                </div>
              </div>
            ) : validationResult ? (
              <>
                {/* Pipeline Statistics */}
                <div style={statCardStyle}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: isDark ? '#f4f3ff' : '#0f172a',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <FiActivity size={18} />
                    Pipeline Statistics
                  </div>

                  <div style={statRowStyle}>
                    <div style={statLabelStyle}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isDark ? '#6913e0' : '#3b82f6',
                        boxShadow: `0 0 8px ${isDark ? '#6913e0' : '#3b82f6'}`,
                      }} />
                      Components
                    </div>
                    <div style={statValueStyle}>{validationResult.num_nodes}</div>
                  </div>

                  <div style={statRowStyle}>
                    <div style={statLabelStyle}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isDark ? '#6913e0' : '#3b82f6',
                        boxShadow: `0 0 8px ${isDark ? '#6913e0' : '#3b82f6'}`,
                      }} />
                      Connections
                    </div>
                    <div style={statValueStyle}>{validationResult.num_edges}</div>
                  </div>

                  <div style={{ ...statRowStyle, marginBottom: 0 }}>
                    <div style={statLabelStyle}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: validationResult.is_dag 
                          ? (isDark ? '#10b981' : '#059669')
                          : (isDark ? '#ef4444' : '#dc2626'),
                        boxShadow: `0 0 8px ${validationResult.is_dag 
                          ? (isDark ? '#10b981' : '#059669')
                          : (isDark ? '#ef4444' : '#dc2626')}`,
                      }} />
                      Pipeline Type
                    </div>
                    <div style={{
                      ...statValueStyle,
                      color: validationResult.is_dag 
                        ? (isDark ? '#34d399' : '#059669')
                        : (isDark ? '#f87171' : '#dc2626'),
                    }}>
                      {validationResult.is_dag ? 'Valid DAG' : 'Has Cycles'}
                    </div>
                  </div>
                </div>

                {/* Validation Status */}
                <div style={statusCardStyle(validationResult.is_dag)}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    {validationResult.is_dag ? (
                      <FiCheck size={32} style={{ 
                        color: isDark ? '#34d399' : '#059669',
                        background: isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                        borderRadius: '50%',
                        padding: '8px',
                      }} />
                    ) : (
                      <FiAlertCircle size={32} style={{ 
                        color: isDark ? '#f87171' : '#dc2626',
                        background: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                        borderRadius: '50%',
                        padding: '8px',
                      }} />
                    )}
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: validationResult.is_dag 
                        ? (isDark ? '#34d399' : '#059669')
                        : (isDark ? '#f87171' : '#dc2626'),
                    }}>
                      {validationResult.is_dag ? 'Pipeline Valid!' : 'Validation Failed'}
                    </div>
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: validationResult.is_dag 
                      ? (isDark ? 'rgba(52, 211, 153, 0.8)' : 'rgba(5, 150, 105, 0.8)')
                      : (isDark ? 'rgba(248, 113, 113, 0.8)' : 'rgba(220, 38, 38, 0.8)'),
                  }}>
                    {validationResult.is_dag 
                      ? '✨ Your pipeline structure is valid and ready for execution. All components form a proper directed acyclic graph without circular dependencies.'
                      : '⚠️ Pipeline contains circular dependencies that prevent execution. Please review your connections and remove any loops in the workflow.'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  paddingTop: '8px',
                }}>
                  <button
                    onClick={onClose}
                    style={{
                      background: 'none',
                      border: `1px solid ${isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: isDark ? 'rgba(167, 139, 250, 0.9)' : 'rgba(100, 116, 139, 0.9)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = isDark ? 'rgba(105, 19, 224, 0.1)' : 'rgba(59, 130, 246, 0.1)';
                      e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.5)' : 'rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.borderColor = isDark ? 'rgba(105, 19, 224, 0.3)' : 'rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    Close
                  </button>
                  
                  {validationResult.is_dag && (
                    <button
                      onClick={onClose}
                      style={{
                        background: `linear-gradient(135deg, ${isDark ? '#6913e0' : '#3b82f6'}, ${isDark ? '#7c3aed' : '#2563eb'})`,
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backdropFilter: 'blur(10px)',
                        boxShadow: isDark 
                          ? '0 4px 12px rgba(105, 19, 224, 0.3)'
                          : '0 4px 12px rgba(59, 130, 246, 0.25)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = isDark 
                          ? '0 6px 16px rgba(105, 19, 224, 0.4)'
                          : '0 6px 16px rgba(59, 130, 246, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = isDark 
                          ? '0 4px 12px rgba(105, 19, 224, 0.3)'
                          : '0 4px 12px rgba(59, 130, 246, 0.25)';
                      }}
                    >
                      Continue to Deploy
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default ValidationModal;